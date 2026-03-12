from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import HttpResponse
from django.core.files.storage import default_storage
from django.core.cache import cache
import os
import tempfile
import logging
import time
import uuid
from pathlib import Path
from werkzeug.utils import secure_filename

logger = logging.getLogger(__name__)

class ConversionError(Exception):
    """Custom exception for file conversion errors"""
    pass

@api_view(['POST'])
def convert_file(request):
    """Convert PDF to Word or Word to PDF"""
    if 'file' not in request.FILES:
        logger.error('No file in request.FILES')
        return Response({'error': 'No file provided'}, status=400)
    
    uploaded_file = request.FILES['file']
    conversion_type = request.POST.get('conversion_type', 'pdf_to_word')
    
    logger.info(f'File: {uploaded_file.name}, Size: {uploaded_file.size}, Type: {conversion_type}')
    
    # Validate file size (50MB limit)
    if uploaded_file.size > 50 * 1024 * 1024:
        logger.error(f'File too large: {uploaded_file.size}')
        return Response({'error': 'File size exceeds 50MB limit'}, status=400)
    
    # Get original filename and extension
    original_name = uploaded_file.name
    file_ext = Path(original_name).suffix.lower()
    
    # Sanitize filename to prevent path traversal
    safe_filename = secure_filename(original_name)
    if not safe_filename:
        safe_filename = f'file{file_ext}'
    elif not Path(safe_filename).suffix:
        safe_filename = safe_filename + file_ext
    
    # Validate file type
    if conversion_type == 'pdf_to_word' and file_ext != '.pdf':
        logger.error(f'Wrong file type for pdf_to_word: {file_ext}')
        return Response({'error': 'Please upload a PDF file'}, status=400)
    elif conversion_type == 'word_to_pdf' and file_ext not in ['.docx', '.doc']:
        logger.error(f'Wrong file type for word_to_pdf: {file_ext}')
        return Response({'error': 'Please upload a Word document (.docx or .doc)'}, status=400)
    
    # For files > 5MB, use async job system
    if uploaded_file.size > 5 * 1024 * 1024:
        return start_async_conversion(uploaded_file, conversion_type, safe_filename, file_ext)
    
    # For small files, convert directly
    return convert_directly(uploaded_file, conversion_type, safe_filename, file_ext)

def start_async_conversion(uploaded_file, conversion_type, safe_filename, file_ext):
    """Start async conversion for large files"""
    job_id = str(uuid.uuid4())
    
    # Save file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as temp_input:
        for chunk in uploaded_file.chunks():
            temp_input.write(chunk)
        temp_input_path = temp_input.name
    
    # Store job info in cache
    cache.set(f'conversion_job_{job_id}', {
        'temp_path': temp_input_path,
        'conversion_type': conversion_type,
        'safe_filename': safe_filename,
        'status': 'queued'
    }, timeout=600)
    
    # Start conversion in background (simplified - in production use Celery)
    import threading
    thread = threading.Thread(target=process_conversion_job, args=(job_id,))
    thread.start()
    
    return Response({
        'job_id': job_id,
        'status': 'processing',
        'message': 'Large file detected. Processing in background...'
    })

def convert_directly(uploaded_file, conversion_type, safe_filename, file_ext):
    """Convert small files directly"""
    temp_input_path = None
    output_path = None
    
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as temp_input:
            for chunk in uploaded_file.chunks():
                temp_input.write(chunk)
            temp_input_path = temp_input.name
        
        if conversion_type == 'pdf_to_word':
            output_path = convert_pdf_to_word(temp_input_path)
            output_filename = Path(safe_filename).stem + '.docx'
            content_type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        else:
            output_path = convert_word_to_pdf(temp_input_path)
            output_filename = Path(safe_filename).stem + '.pdf'
            content_type = 'application/pdf'
        
        with open(output_path, 'rb') as output_file:
            file_content = output_file.read()
        
        cleanup_files(temp_input_path, output_path)
        
        response = HttpResponse(file_content, content_type=content_type)
        response['Content-Disposition'] = f'attachment; filename="{output_filename}"'
        return response
        
    except Exception as e:
        cleanup_files(temp_input_path, output_path)
        return Response({'error': str(e)}, status=500)

def process_conversion_job(job_id):
    """Process conversion job in background"""
    try:
        job_data = cache.get(f'conversion_job_{job_id}')
        if not job_data:
            return
        
        update_progress(job_id, 10, 'Starting conversion...')
        
        temp_input_path = job_data['temp_path']
        conversion_type = job_data['conversion_type']
        safe_filename = job_data['safe_filename']
        
        update_progress(job_id, 30, 'Converting file...')
        
        if conversion_type == 'pdf_to_word':
            output_path = convert_pdf_to_word(temp_input_path)
            output_filename = Path(safe_filename).stem + '.docx'
            content_type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        else:
            output_path = convert_word_to_pdf(temp_input_path)
            output_filename = Path(safe_filename).stem + '.pdf'
            content_type = 'application/pdf'
        
        update_progress(job_id, 80, 'Preparing download...')
        
        with open(output_path, 'rb') as output_file:
            file_content = output_file.read()
        
        # Store converted file
        cache.set(f'converted_file_{job_id}', {
            'content': file_content,
            'filename': output_filename,
            'content_type': content_type
        }, timeout=300)
        
        cleanup_files(temp_input_path, output_path)
        update_progress(job_id, 100, 'Completed')
        
    except Exception as e:
        logger.error(f'Job {job_id} failed: {str(e)}')
        update_progress(job_id, -1, f'Error: {str(e)}', error=True)

def update_progress(job_id, percentage, message, error=False):
    """Update job progress"""
    cache.set(f'conversion_progress_{job_id}', {
        'percentage': percentage,
        'message': message,
        'error': error
    }, timeout=300)

@api_view(['GET'])
def get_progress(request, job_id):
    """Get conversion progress"""
    progress = cache.get(f'conversion_progress_{job_id}')
    if not progress:
        return Response({'error': 'Job not found'}, status=404)
    return Response(progress)

@api_view(['GET'])
def download_file(request, job_id):
    """Download converted file"""
    file_data = cache.get(f'converted_file_{job_id}')
    if not file_data:
        return Response({'error': 'File not found or expired'}, status=404)
    
    response = HttpResponse(file_data['content'], content_type=file_data['content_type'])
    response['Content-Disposition'] = f'attachment; filename="{file_data["filename"]}"'
    
    # Cleanup
    cache.delete(f'converted_file_{job_id}')
    cache.delete(f'conversion_progress_{job_id}')
    cache.delete(f'conversion_job_{job_id}')
    
    return response


def cleanup_files(*file_paths):
    """Safely cleanup temporary files"""
    for file_path in file_paths:
        if file_path:
            try:
                os.unlink(file_path)
            except OSError as e:
                logger.warning(f'Failed to cleanup file {file_path}: {str(e)}')


def convert_pdf_to_word(pdf_path):
    """Convert PDF to Word using pdf2docx"""
    try:
        from pdf2docx import Converter
        
        output_path = pdf_path.replace('.pdf', '.docx')
        cv = Converter(pdf_path)
        cv.convert(output_path)
        cv.close()
        
        return output_path
    except ImportError:
        raise ConversionError('pdf2docx library not installed. Run: pip install pdf2docx')
    except Exception as e:
        raise ConversionError(f'PDF to Word conversion failed: {str(e)}')


def convert_word_to_pdf(word_path):
    """Convert Word to PDF using LibreOffice (cross-platform) or docx2pdf (Windows)"""
    import platform
    import subprocess
    import shutil
    
    output_path = word_path.replace('.docx', '.pdf').replace('.doc', '.pdf')
    
    # Try LibreOffice first (works on Linux/Windows/Mac)
    soffice_path = shutil.which('soffice')
    if soffice_path:
        try:
            logger.info(f'Attempting LibreOffice conversion: {word_path}')
            
            result = subprocess.run([
                soffice_path,
                '--headless',
                '--convert-to',
                'pdf',
                '--outdir',
                os.path.dirname(output_path),
                word_path
            ], capture_output=True, timeout=30, check=True)
            
            if os.path.exists(output_path):
                logger.info('LibreOffice conversion successful')
                return output_path
        except (subprocess.CalledProcessError, subprocess.TimeoutExpired) as e:
            logger.warning(f'LibreOffice conversion failed: {str(e)}')
    
    # Fallback to docx2pdf on Windows
    if platform.system() == 'Windows':
        try:
            import pythoncom
            from docx2pdf import convert
            
            logger.info(f'Attempting docx2pdf conversion: {word_path}')
            pythoncom.CoInitialize()
            try:
                convert(word_path, output_path)
                logger.info('docx2pdf conversion successful')
                
                if not os.path.exists(output_path):
                    raise ConversionError('PDF file was not created')
                
                return output_path
            finally:
                pythoncom.CoUninitialize()
        except ImportError:
            raise ConversionError('docx2pdf not installed. Install LibreOffice or run: pip install docx2pdf')
        except Exception as e:
            logger.error(f'docx2pdf error: {str(e)}')
            raise ConversionError(f'Word to PDF conversion failed: {str(e)}')
    else:
        raise ConversionError('LibreOffice is required for Word to PDF conversion. Install: sudo apt-get install libreoffice')
