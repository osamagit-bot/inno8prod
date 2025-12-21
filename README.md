# Inno8 Website

A modern software house website built with Next.js frontend and Django backend.

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: Django 4.2 with Django REST Framework
- **Database**: SQLite (development) / PostgreSQL (production)
- **Styling**: Tailwind CSS with custom Inno8 color palette
- **Font**: Inter (Google Fonts)

## Color Palette

- Dark Blue: `#012340`
- Blue: `#0477BF`
- Orange: `#FCB316`
- Light Blue: `#048ABF`

## Setup Instructions

### Frontend (Next.js)

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Backend (Django)

1. Navigate to backend directory:
```bash
cd backend
```

2. Activate virtual environment:
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. Run migrations:
```bash
python manage.py migrate
```

4. Create superuser (optional):
```bash
python manage.py createsuperuser
```

5. Run development server:
```bash
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

## Project Structure

```
Inno8 Website/
├── app/                    # Next.js app directory
├── components/             # React components
├── public/                 # Static assets
├── backend/               # Django backend
│   ├── inno8_backend/     # Django project
│   └── venv/              # Virtual environment
├── package.json           # Frontend dependencies
└── README.md
```

## Features

- ✅ Responsive header with navigation
- ✅ Custom Inno8 branding and color scheme
- ✅ Mobile-friendly design
- ✅ Django REST API backend
- ✅ SQLite database (ready for PostgreSQL)
- ✅ CORS configuration for single domain setup

## Deployment

The application is designed for single domain deployment:
- `inno8.com/` → Next.js frontend
- `inno8.com/api/` → Django backend APIs

Use Nginx as reverse proxy with Gunicorn for Django in production.