# 🚨 Community Emergency Resource Locator (CERL)

<div align="center">

![CERL Logo](https://img.shields.io/badge/CERL-Emergency%20Resource%20Locator-red?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.8+-blue?style=for-the-badge&logo=python)
![Django](https://img.shields.io/badge/Django-5.0-green?style=for-the-badge&logo=django)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)


**A comprehensive web and mobile-ready platform designed to help citizens and emergency responders quickly locate nearby emergency resources during disasters and crises.**

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Screenshots](#-screenshots)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

CERL (Community Emergency Resource Locator) is a real-time emergency resource management system that enables:

- **Citizens** to quickly find nearby emergency resources (hospitals, shelters, water points, etc.)
- **Administrators** to manage resources, verify data, and send emergency alerts
- **Coordinators** to update resource availability in real-time during emergencies

The system emphasizes **real-time availability**, **offline resilience**, **accessibility**, and **verified data** to improve community preparedness and response time during emergencies.

---

## ✨ Features

### 👥 For Citizens
- ✅ **GPS Location Detection** - Automatic location detection with fallback support
- ✅ **Interactive Map** - Visual map showing nearby emergency resources
- ✅ **Advanced Search & Filters** - Filter by type, status, distance, and search terms
- ✅ **Resource Details** - View capacity, contact info, directions, and availability
- ✅ **Emergency Alerts** - Real-time alerts with severity levels
- ✅ **Resource Submission** - Submit new resources with image upload
- ✅ **Emergency Helplines** - Quick access to emergency contact numbers
- ✅ **Get Directions** - One-click navigation to resources via Google Maps

### 🔐 For Administrators
- ✅ **Admin Dashboard** - Comprehensive control panel
- ✅ **User Management** - Approve users, change roles, manage permissions
- ✅ **Resource Management** - Verify resources, assign coordinators
- ✅ **Map-Based Location Editor** - Visual coordinate picker for accurate locations
- ✅ **Alert Management** - Create and manage emergency alerts
- ✅ **System Statistics** - View resource counts, verification status, usage stats
- ✅ **CSV Export** - Export resource data for reporting
- ✅ **Activity Logs** - Track resource updates and assignments

### 👨‍💼 For Resource Coordinators
- ✅ **Coordinator Dashboard** - Dedicated panel for assigned resources
- ✅ **Real-time Updates** - Update resource capacity and availability
- ✅ **Resource Analytics** - View usage statistics for assigned resources
- ✅ **Quick Actions** - Fast capacity updates during emergencies

### 🛠️ Technical Features
- ✅ **Role-Based Access Control** - Secure authentication with JWT tokens
- ✅ **RESTful API** - Well-structured Django REST Framework backend
- ✅ **Responsive Design** - Mobile and desktop optimized
- ✅ **Real-time Status** - Live resource status updates
- ✅ **Distance Calculation** - Haversine formula for accurate distance
- ✅ **Image Upload** - Support for resource images
- ✅ **Audit Logging** - Complete activity tracking

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Django 5.0.1
- **API**: Django REST Framework 3.14.0
- **Authentication**: JWT (djangorestframework-simplejwt)
- **Database**: MySQL (with PyMySQL)
- **Image Processing**: Pillow
- **CORS**: django-cors-headers
- **Production**: Gunicorn + WhiteNoise

### Frontend
- **Framework**: React 18.2
- **Routing**: React Router DOM 6.21
- **HTTP Client**: Axios 1.6
- **Maps**: Leaflet + React-Leaflet
- **Styling**: Tailwind CSS 3.4
- **Build Tool**: Vite 5.0

---

## 📁 Project Structure

```
cerl-system/
├── backend/                    # Django Backend
│   ├── cerl_project/          # Main Django project
│   │   ├── settings.py        # Project settings
│   │   ├── urls.py            # Main URL configuration
│   │   └── wsgi.py            # WSGI configuration
│   ├── core_resources/        # Main app
│   │   ├── models.py         # User, Resource, ResourceUpdate models
│   │   ├── views.py           # API views and endpoints
│   │   ├── serializers.py    # DRF serializers
│   │   └── urls.py            # App URL routes
│   ├── user_alerts/           # Alerts app
│   │   ├── models.py         # Alert model
│   │   ├── views.py           # Alert API endpoints
│   │   └── serializers.py    # Alert serializers
│   ├── load_sample_data.py    # Sample data loader
│   ├── manage.py              # Django management script
│   └── requirements.txt       # Python dependencies
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── admin/        # Admin components
│   │   │   ├── common/       # Shared components
│   │   │   ├── map/          # Map components
│   │   │   └── resources/    # Resource components
│   │   ├── pages/            # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── CoordinatorDashboard.jsx
│   │   ├── context/          # React context
│   │   │   └── AuthContext.jsx
│   │   ├── services/         # API services
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── resourceService.js
│   │   │   └── alertService.js
│   │   └── App.jsx           # Main app component
│   ├── package.json          # Node dependencies
│   └── vite.config.js        # Vite configuration
│
├── README.md                  # This file
├── SETUP.md                   # Setup instructions
└── DOCUMENTATION.md           # Detailed documentation
```

---

## 🚀 Quick Start

### Prerequisites

- **Python** 3.8 or higher
- **Node.js** 16+ and npm
- **MySQL** 5.7+ or MariaDB
- **Git** (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cerl-system
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # Linux/Mac
   pip install -r requirements.txt
   ```

3. **Database Setup**
   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE cerl_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   EXIT;
   
   # Configure database in backend/cerl_project/settings.py or use .env
   # Run migrations
   python manage.py migrate
   
   # Load sample data
   python load_sample_data.py
   ```

4. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

5. **Run the Application**

   **Step 1: Start Backend Server (Terminal 1)**
   ```bash
   # Navigate to backend directory
   cd backend
   
   # Activate virtual environment (Windows)
   venv\Scripts\activate
   
   # Activate virtual environment (Linux/Mac)
   # source venv/bin/activate
   
   # Start Django development server (localhost only)
   python manage.py runserver 127.0.0.1:8000
   ```
   
   ✅ **Expected Output:**
   ```
   Watching for file changes with StatReloader
   Performing system checks...
   System check identified no issues (0 silenced).
   Django version 5.0.1, using settings 'cerl_project.settings'
   Starting development server at http://127.0.0.1:8000/
   Quit the server with CTRL-BREAK.
   ```
   
   **Step 2: Start Frontend Server (Terminal 2 - New Terminal Window)**
   ```bash
   # Navigate to frontend directory
   cd frontend
   
   # Start Vite development server (localhost only)
   npm run dev
   ```
   
   ✅ **Expected Output:**
   ```
   VITE v5.4.21  ready in 394 ms
   
   ➜  Local:   http://localhost:5173/
   ```

6. **Access the Application**
   
   - **Frontend**: http://localhost:5173 (Login page)
   - **Backend API**: http://localhost:8000/api (API endpoints)
   - **Admin Panel**: http://localhost:8000/admin (Django admin)

7. **Test Login**
   
   Open http://localhost:5173 in your browser and login with:
   - Username: `admin`
   - Password: `Yousuf@2005`
   
   ✅ **Success indicators:**
   - Redirects to home page (not stuck on login)
   - Map loads with resources
   - No errors in browser console (F12)
   - Navigation works properly

### Default Credentials

- **Admin**: `admin` / `Yousuf@2005`
- **Test User**: `testuser` / `test123`

> ⚠️ **Important**: Change default passwords in production!

---

## 📸 Screenshots

### Home Page - Resource Map
<img width="1918" height="1076" alt="image" src="https://github.com/user-attachments/assets/93c3b395-79ac-4e90-af53-a8611d6fe6e2" />

Interactive map showing nearby emergency resources with distance markers and filters.

### Admin Dashboard
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/2bbfe912-1cdd-407f-92fa-7d5277637bf3" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/71d1dd71-a392-4f76-9c66-ecbee9297de0" />


Comprehensive admin panel with user management, resource verification, and system statistics.

### Coordinator Panel
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/6db88bcd-a8fe-477b-9518-c86e36e4dc2d" />

Real-time resource capacity updates and management interface.

---

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `GET /api/auth/me/` - Get current user

### Resource Endpoints

- `GET /api/resources/` - List all resources (with filters)
- `GET /api/resources/nearby/` - Find nearby resources
- `GET /api/resources/{id}/` - Get resource details
- `POST /api/resources/` - Create resource (authenticated)
- `PUT /api/resources/{id}/` - Update resource
- `POST /api/resources/{id}/verify/` - Verify resource (admin)
- `POST /api/resources/{id}/update_capacity/` - Update capacity (coordinator/admin)
- `POST /api/resources/{id}/assign_coordinator/` - Assign coordinator (admin)
- `GET /api/resources/stats/` - Get statistics (admin)
- `GET /api/resources/export/` - Export CSV (admin)

### Alert Endpoints

- `GET /api/alerts/` - List all alerts
- `GET /api/alerts/active/` - Get active alerts
- `POST /api/alerts/` - Create alert (admin)
- `PUT /api/alerts/{id}/` - Update alert (admin)
- `DELETE /api/alerts/{id}/` - Delete alert (admin)

### User Endpoints

- `GET /api/users/` - List users (admin)
- `PUT /api/users/{id}/` - Update user (admin)
- `POST /api/users/{id}/approve/` - Approve user (admin)

---

## 📖 Documentation

For detailed documentation, please refer to:

- **[QUICKSTART.md](QUICKSTART.md)** - ⚡ Get started in 5 minutes
- **[SETUP.md](SETUP.md)** - Complete setup guide
- **[DOCUMENTATION.md](DOCUMENTATION.md)** - Detailed feature documentation
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to contribute
- **[CHANGELOG.md](CHANGELOG.md)** - Version history
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Production deployment guide

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow PEP 8 for Python code
- Use ESLint/Prettier for JavaScript/React
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 🙏 Acknowledgments

- OpenStreetMap for map tiles
- Leaflet for mapping library
- Django REST Framework community
- React community

---

## 📞 Support

For support, email mohammedyousuf8505@gmail.com or create an issue in the repository.

---

## ❓ FAQ

### General Questions

**Q: What browsers are supported?**  
A: Modern browsers (Chrome, Firefox, Safari, Edge) with JavaScript enabled. Mobile browsers are fully supported.

**Q: Do I need an account to view resources?**  
A: No, resource viewing is public. However, you need an account to submit resources or access admin features.

**Q: How accurate is the location detection?**  
A: Accuracy depends on your device's GPS. Typically 10-50 meters accuracy. The system uses browser geolocation API.

**Q: Can I use this offline?**  
A: Currently, an internet connection is required. Offline mode is planned for future releases.

**Q: How do I update resource coordinates?**  
A: Admins can use the "Edit Location" feature in the admin dashboard with the interactive map picker.

### Technical Questions

**Q: What database does CERL use?**  
A: MySQL 5.7+ or MariaDB. SQLite can be used for development.

**Q: Can I deploy this on Windows Server?**  
A: Yes, but Linux is recommended for production. Windows Server requires additional configuration.

**Q: How do I change the default port?**  
A: Backend: `python manage.py runserver 8001`  
Frontend: Update `vite.config.js` server port

**Q: How do I reset the database?**  
A: Delete migrations (except `__init__.py`), delete database, recreate, and run `python manage.py migrate`

**Q: Where are uploaded images stored?**  
A: In `backend/media/resources/` directory. Configure `MEDIA_ROOT` in settings.py

### Troubleshooting

**Q: Map is not loading**  
A: Check internet connection (Leaflet loads tiles from OpenStreetMap). Verify Leaflet CSS is imported.

**Q: CORS errors**  
A: Add your frontend URL to `CORS_ALLOWED_ORIGINS` in backend `.env` file.

**Q: Database connection failed**  
A: Verify MySQL is running, check credentials in `.env`, ensure database exists.

**Q: Frontend can't connect to backend**  
A: 
1. Verify backend is running: http://127.0.0.1:8000/api
2. Check backend is started with: `python manage.py runserver 127.0.0.1:8000`
3. Frontend uses proxy automatically - no `.env` file needed
4. Both servers must run on localhost

---

## 📝 Additional Documentation

- **[SETUP.md](SETUP.md)** - Complete setup guide
- **[QUICKSTART.md](QUICKSTART.md)** - Quick start in 5 minutes
- **[LOGIN_FIX.md](LOGIN_FIX.md)** - 🔧 Fix login connection issues
- **[DOCUMENTATION.md](DOCUMENTATION.md)** - Detailed feature documentation
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines
- **[CHANGELOG.md](CHANGELOG.md)** - Version history
- **[LICENSE](LICENSE)** - MIT License

---

## 🔧 Quick Setup Scripts

### Windows (Backend)
```bash
cd backend
setup.bat
```

### Linux/Mac (Backend)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python load_sample_data.py
```

### Frontend (All Platforms)
```bash
cd frontend
npm install
npm run dev
```

---

## 🚀 Quick Run Commands (Copy & Paste)

### Start Backend (Terminal 1)
```bash
cd backend
venv\Scripts\activate
python manage.py runserver
```

### Start Frontend (Terminal 2 - New Window)
```bash
cd frontend
npm run dev
```

### Test Login
1. Open: http://localhost:5173
2. Username: `admin`
3. Password: `Yousuf@2005`
4. Click Login

**✅ Success = Redirects to home page with map**

---

## 🚨 Known Limitations

- **Offline Mode**: Currently requires internet connection
- **Push Notifications**: Not yet implemented (planned)
- **SMS Alerts**: Not yet implemented (planned)
- **PDF Export**: CSV export only (PDF planned)
- **Multi-language**: English only (i18n planned)
- **Mobile App**: Web-only (React Native app planned)

---

<div align="center">

**Made with ❤️ for Emergency Response**

[⬆ Back to Top](#-community-emergency-resource-locator-cerl)

</div>

