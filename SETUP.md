# 🚀 CERL System - Complete Setup Guide

This guide will walk you through setting up the Community Emergency Resource Locator (CERL) system from scratch.

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Backend Setup](#backend-setup)
- [Database Configuration](#database-configuration)
- [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Troubleshooting](#troubleshooting)
- [Production Deployment](#production-deployment)

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

1. **Python 3.8+**
   ```bash
   python --version
   # Should show Python 3.8 or higher
   ```

2. **Node.js 16+ and npm**
   ```bash
   node --version
   npm --version
   ```

3. **MySQL 5.7+ or MariaDB**
   ```bash
   mysql --version
   ```

4. **Git** (optional, for version control)
   ```bash
   git --version
   ```

### System Requirements

- **RAM**: Minimum 2GB, Recommended 4GB+
- **Storage**: At least 500MB free space
- **OS**: Windows 10+, Linux, or macOS

---

## Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd cerl-system/backend
```

### Step 2: Create Virtual Environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Linux/Mac:**
```bash
python3 -m venv venv
source venv/bin/activate
```

You should see `(venv)` in your terminal prompt.

### Step 3: Install Python Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Expected output:**
```
Successfully installed Django-5.0.1 djangorestframework-3.14.0 ...
```

### Step 4: Verify Installation

```bash
python manage.py --version
# Should show Django version
```

---

## Database Configuration

### Step 1: Create MySQL Database

1. **Login to MySQL:**
   ```bash
   mysql -u root -p
   ```

2. **Create Database:**
   ```sql
   CREATE DATABASE cerl_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   SHOW DATABASES;
   EXIT;
   ```

### Step 2: Configure Database Connection

Create a `.env` file in the `backend` directory:

```bash
cd backend
touch .env  # Linux/Mac
# or create .env file manually on Windows
```

Add the following content:

```env
# Database Configuration
DB_NAME=cerl_db
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_PORT=3306

# Django Settings
SECRET_KEY=your-secret-key-here-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

> ⚠️ **Important**: Replace `your_mysql_password` and `your-secret-key-here-change-in-production` with actual values.

### Step 3: Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

**Expected output:**
```
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, sessions, core_resources, user_alerts
Running migrations:
  Applying core_resources.0001_initial... OK
  ...
```

### Step 4: Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin user.

### Step 5: Load Sample Data

```bash
python load_sample_data.py
```

**Expected output:**
```
============================================================
LOADING SAMPLE DATA FOR CERL
============================================================

📝 Creating users...
✅ Created testuser
🏥 Creating resources...
✅ Created resource: K.R. Hospital Mysore
...
🎉 Sample data loaded successfully!
```

---

## Frontend Setup

### Step 1: Navigate to Frontend Directory

```bash
cd cerl-system/frontend
```

### Step 2: Install Node Dependencies

```bash
npm install
```

**Expected output:**
```
added 161 packages, and audited 162 packages in 15s
```

### Step 3: API Configuration

**No configuration needed!** The frontend automatically uses a proxy to connect to the backend.

The `vite.config.js` is already configured to proxy `/api` requests to `http://127.0.0.1:8000`.

Just make sure both servers are running on localhost.

### Step 4: Verify Installation

```bash
npm run build
```

**Expected output:**
```
✓ built in 2.5s
```

---

## Environment Variables

### Backend (.env in `backend/`)

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_NAME` | MySQL database name | `cerl_db` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `yourpassword` |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `SECRET_KEY` | Django secret key | `your-secret-key` |
| `DEBUG` | Debug mode | `True` |
| `ALLOWED_HOSTS` | Allowed hosts | `localhost,127.0.0.1` |
| `CORS_ALLOWED_ORIGINS` | CORS origins | `http://localhost:5173` |

### Frontend Configuration

**No `.env` file needed!** The frontend uses Vite proxy automatically configured in `vite.config.js`.

---

## Running the Application

### Development Mode

You need **TWO terminal windows** - one for backend, one for frontend. Both must run simultaneously.

---

#### 🖥️ Terminal 1: Backend Server

**Step-by-step commands:**

```bash
# 1. Navigate to backend directory
cd backend

# 2. Activate virtual environment (Windows)
venv\Scripts\activate

# 2. Activate virtual environment (Linux/Mac)
# source venv/bin/activate

# 3. Start Django development server (localhost only)
python manage.py runserver 127.0.0.1:8000
```

**✅ Expected output:**
```
Watching for file changes with StatReloader
Performing system checks...
System check identified no issues (0 silenced).
Django version 5.0.1, using settings 'cerl_project.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

> ⚠️ **IMPORTANT**: Keep this terminal window open! Do NOT close it. The backend must keep running.

**To stop the server:** Press `CTRL+C` or `CTRL+BREAK` in the terminal.

---

#### 🖥️ Terminal 2: Frontend Server

**Open a NEW terminal window** (keep Terminal 1 running):

**Step-by-step commands:**

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Start Vite development server (localhost only)
npm run dev
```

**✅ Expected output:**
```
VITE v5.4.21  ready in 394 ms

➜  Local:   http://localhost:5173/
```

> ⚠️ **IMPORTANT**: Keep this terminal window open too! Both servers must run at the same time.

**To stop the server:** Press `CTRL+C` in the terminal.

---

### ✅ Verify Both Servers Are Running

1. **Backend Check**: Open http://127.0.0.1:8000/api in browser
   - Should see API endpoints or JSON response
   - If you see an error, backend is not running correctly

2. **Frontend Check**: Open http://localhost:5173 in browser
   - Should see the CERL login page
   - If you see "Cannot connect", frontend is not running correctly

### Access the Application

1. **Frontend**: Open http://localhost:5173 in your browser
   - You should see the login page
   - If you see connection error, check if frontend server is running

2. **Backend API**: http://127.0.0.1:8000/api
   - Should show API endpoints or JSON response
   - If you see error, check if backend server is running

3. **Admin Panel**: http://127.0.0.1:8000/admin
   - Django admin interface
   - Use admin credentials to login

### 🧪 Test Login System

**Step-by-step testing:**

1. **Open Browser**: Navigate to http://localhost:5173
2. **Verify Login Page**: You should see "CERL System" heading and login form
3. **Test Admin Login**:
   - Enter Username: `admin`
   - Enter Password: `Yousuf@2005`
   - Click "Login" button
4. **Expected Results**:
   - ✅ Should redirect to home page (no error)
   - ✅ Should see map with resources
   - ✅ Should be able to navigate without being redirected back to login
   - ✅ Check browser console (F12) - no errors should appear

**Default Login Credentials:**

- **Admin**: 
  - Username: `admin`
  - Password: `Yousuf@2005`

- **Test User**:
  - Username: `testuser`
  - Password: `test123`

> ⚠️ **Security Note**: Change these passwords immediately in production!

### 🔍 Troubleshooting Login Issues

**If login doesn't work:**

1. **Check Backend Server**:
   - Is Terminal 1 showing "Starting development server"?
   - Try accessing http://127.0.0.1:8000/api - does it respond?

2. **Check Frontend Server**:
   - Is Terminal 2 showing "Local: http://localhost:5173/"?
   - Try accessing http://localhost:5173 - does the page load?

3. **Check Browser Console** (Press F12):
   - Look for red error messages
   - Check Network tab for failed requests

4. **Check Terminal Output**:
   - Look for error messages in both terminals
   - Backend errors usually show in Terminal 1
   - Frontend errors usually show in Terminal 2

5. **Verify Database**:
   - Run: `python load_sample_data.py` (in backend directory)
   - This ensures test users exist in database

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Error

**Error:**
```
django.db.utils.OperationalError: (2003, "Can't connect to MySQL server")
```

**Solution:**
- Ensure MySQL is running: `mysql -u root -p`
- Check database credentials in `.env`
- Verify database exists: `SHOW DATABASES;`

#### 2. Port Already in Use

**Error:**
```
Error: That port is already in use.
```

**Solution:**
- Change port: `python manage.py runserver 8001`
- Or kill the process using the port

#### 3. Module Not Found

**Error:**
```
ModuleNotFoundError: No module named 'django'
```

**Solution:**
- Activate virtual environment: `venv\Scripts\activate`
- Reinstall dependencies: `pip install -r requirements.txt`

#### 4. CORS Error

**Error:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
- Add frontend URL to `CORS_ALLOWED_ORIGINS` in backend `.env`
- Restart backend server

#### 5. Frontend Build Errors

**Error:**
```
Failed to resolve import
```

**Solution:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Check Node.js version: `node --version` (should be 16+)

#### 6. Connection Error / Can't Connect to Backend

**Error:**
```
AxiosError: Network Error
Failed to load resource: /api/auth/login/
```

**Solution:**

1. **Check if backend is running:**
   ```bash
   # In backend terminal, you should see:
   # "Starting development server at http://127.0.0.1:8000/"
   ```

2. **Verify backend is accessible:**
   - Open browser: http://127.0.0.1:8000/api
   - Should see API response (not connection error)

3. **Check backend is started correctly:**
   ```bash
   # Backend should be started with:
   python manage.py runserver 127.0.0.1:8000
   ```

4. **Restart both servers:**
   - Stop backend (CTRL+C) and restart
   - Stop frontend (CTRL+C) and restart: `npm run dev`

5. **No `.env` file needed** - Frontend uses proxy automatically

#### 6. Map Not Loading

**Solution:**
- Check internet connection (Leaflet loads tiles from OpenStreetMap)
- Verify Leaflet CSS is imported in `main.jsx`

### Getting Help

If you encounter issues not listed here:

1. Check the [Documentation](DOCUMENTATION.md)
2. Review error logs in terminal
3. Check Django logs: `python manage.py check`
4. Verify all dependencies are installed

---

## Production Deployment

### Backend Production Setup

1. **Update Settings:**
   ```python
   DEBUG = False
   ALLOWED_HOSTS = ['yourdomain.com', 'www.yourdomain.com']
   ```

2. **Collect Static Files:**
   ```bash
   python manage.py collectstatic
   ```

3. **Use Production Server:**
   ```bash
   gunicorn cerl_project.wsgi:application --bind 0.0.0.0:8000
   ```

### Frontend Production Build

1. **Build for Production:**
   ```bash
   npm run build
   ```

2. **Serve Static Files:**
   - Use Nginx or Apache
   - Or serve from Django static files

### Environment Variables for Production

- Set `DEBUG=False`
- Use strong `SECRET_KEY`
- Configure proper `ALLOWED_HOSTS`
- Use production database credentials
- Enable HTTPS
- Configure CORS properly

### Security Checklist

- [ ] Change default passwords
- [ ] Set `DEBUG=False`
- [ ] Use strong `SECRET_KEY`
- [ ] Enable HTTPS
- [ ] Configure firewall rules
- [ ] Set up database backups
- [ ] Enable logging
- [ ] Review CORS settings
- [ ] Set up monitoring

---

## Quick Reference

### Useful Commands

**Backend:**
```bash
# Activate virtual environment
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run server (localhost only)
python manage.py runserver 127.0.0.1:8000

# Load sample data
python load_sample_data.py
```

**Frontend:**
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### File Locations

- Backend settings: `backend/cerl_project/settings.py`
- Backend env: `backend/.env`
- Frontend env: `frontend/.env`
- Database migrations: `backend/core_resources/migrations/`
- Sample data script: `backend/load_sample_data.py`

---

## Next Steps

After setup:

1. ✅ Verify backend is running: http://127.0.0.1:8000/api
2. ✅ Verify frontend is running: http://localhost:5173
3. ✅ Login with default credentials
4. ✅ Explore admin dashboard
5. ✅ Test resource submission
6. ✅ Review [DOCUMENTATION.md](DOCUMENTATION.md) for features

---

## Support

For additional help:
- Check [DOCUMENTATION.md](DOCUMENTATION.md) for detailed features
- Review error messages in terminal
- Check Django/React documentation

---

**Happy Coding! 🚀**

