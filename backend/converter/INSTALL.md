# File Converter Dependencies

## Install these packages in your Django backend:

```bash
cd backend
pip install pdf2docx
pip install docx2pdf
```

## Note:
- pdf2docx: Converts PDF to Word (.docx)
- docx2pdf: Converts Word to PDF (Windows only - uses Microsoft Word COM)

## For Linux/Mac alternative:
If docx2pdf doesn't work (it's Windows-only), use LibreOffice:
```bash
# Install LibreOffice
sudo apt-get install libreoffice  # Ubuntu/Debian
brew install libreoffice          # macOS

# Then use subprocess in Python to call:
# soffice --headless --convert-to pdf filename.docx
```
