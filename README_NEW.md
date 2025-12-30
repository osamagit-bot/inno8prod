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

## Offline Fallback System

The website now includes a comprehensive fallback data system that ensures all components work seamlessly when the backend is offline:

### Features:
- **Automatic Fallback**: All components automatically use fallback data when API calls fail
- **Consistent Experience**: Users get a fully functional website even without backend connectivity
- **Graceful Degradation**: No broken components or empty sections when offline
- **Smart Caching**: Components prefer backend data but fall back to static content

### Components with Fallback Data:
- ✅ Header (navigation menu, site settings, social links)
- ✅ Hero Section (title, subtitle, description, background)
- ✅ About Section (company info, mission, vision)
- ✅ Services Section (service listings and descriptions)
- ✅ Why Choose Us (features and benefits)
- ✅ Working Process (step-by-step process)
- ✅ Testimonials (client reviews and ratings)
- ✅ Projects (portfolio items)
- ✅ Client Logos (partner/client showcase)
- ✅ Footer (contact info, quick links)
- ✅ Color Palette (brand colors)

### Fallback Data Location:
- **File**: `lib/fallbackData.ts`
- **Content**: Comprehensive default data for all sections
- **Structure**: Matches backend API response format

### How It Works:
1. Components attempt to fetch data from backend APIs
2. If API call fails (network error, server down, etc.), fallback data is used
3. Console logs indicate when fallback data is being used
4. No user-facing errors or broken layouts

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
├── lib/                    # Utilities and API functions
│   ├── api.ts             # API endpoints and functions
│   ├── fallbackData.ts    # Fallback data for offline mode
│   └── fallbackUtils.ts   # Utility functions for fallback handling
├── contexts/              # React contexts
│   └── ColorContext.tsx   # Color palette context
├── public/                # Static assets
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
- ✅ **Offline fallback system for all components**
- ✅ **Graceful degradation when backend is unavailable**
- ✅ **Smart error handling with fallback data**

## Development Notes

### Testing Offline Mode:
1. Start the frontend: `npm run dev`
2. Stop the Django backend server
3. Navigate through the website - all sections should work with fallback data
4. Check browser console for "Backend offline" messages

### Updating Fallback Data:
1. Edit `lib/fallbackData.ts`
2. Ensure data structure matches your backend API responses
3. Test components work with updated fallback data

### Adding New Components:
When creating new components that fetch data:
1. Add fallback data to `lib/fallbackData.ts`
2. Use try-catch blocks in API calls
3. Set fallback data in catch blocks
4. Log when fallback is used for debugging

## Deployment

The application is designed for single domain deployment:
- `inno8.com/` → Next.js frontend
- `inno8.com/api/` → Django backend APIs

Use Nginx as reverse proxy with Gunicorn for Django in production.

### Production Considerations:
- Fallback data ensures website remains functional during backend maintenance
- Consider implementing service worker for enhanced offline capabilities
- Monitor backend uptime and fallback usage in production