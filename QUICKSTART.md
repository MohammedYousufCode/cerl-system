# ⚡ CERL Quick Start Guide

Get CERL up and running in 5 minutes!

---

## 🎯 Prerequisites Check

```bash
# Check Python (need 3.8+)
python --version

# Check Node.js (need 16+)
node --version

# Check MySQL
mysql --version
```

---

## 🚀 Quick Setup

### 1. Backend (2 minutes)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Linux/Mac)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create database (in MySQL)
mysql -u root -p
CREATE DATABASE cerl_db;
EXIT;

# Run migrations
python manage.py migrate

# Load sample data
python load_sample_data.py

# Start server (keep this terminal open)
python manage.py runserver 127.0.0.1:8000
```

✅ **Backend running at:** http://127.0.0.1:8000

**Expected Output:**
```
Watching for file changes with StatReloader
Performing system checks...
System check identified no issues (0 silenced).
Django version 5.0.1, using settings 'cerl_project.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

> ⚠️ **Keep this terminal window open!** The backend server must be running.

### 2. Frontend (1 minute)

**Open a NEW terminal window** (keep backend terminal running):

```bash
# Navigate to frontend (new terminal)
cd frontend

# Install dependencies (only needed first time)
npm install

# Start dev server
npm run dev
```

✅ **Frontend running at:** http://localhost:5173

**Expected Output:**
```
VITE v5.4.21  ready in 394 ms

➜  Local:   http://localhost:5173/
```

> ⚠️ **Keep both terminal windows open!** Both servers must be running simultaneously.

### 3. Test Login

1. **Open Browser**: Navigate to http://localhost:5173
2. **You should see**: Login page with "CERL System" heading
3. **Test Login with Admin credentials:**
   - Username: `admin`
   - Password: `Yousuf@2005`
   - Click "Login" button
4. **Expected Result**: 
   - ✅ You should be redirected to the home page
   - ✅ You should see the map with resources
   - ✅ Navigation should work without errors

**Alternative Test User:**
- Username: `testuser`
- Password: `test123`

> 💡 **Tip**: If login fails, check:
> - Backend server is running (Terminal 1)
> - Frontend server is running (Terminal 2)
> - No errors in browser console (F12)
> - No errors in terminal windows

---

## 🎉 You're Done!

### What's Next?

1. **Explore the Map** - View resources on the interactive map
2. **Admin Dashboard** - Access at `/admin` (if logged in as admin)
3. **Submit Resource** - Try submitting a new resource
4. **Read Documentation** - Check [SETUP.md](SETUP.md) for details

---

## 🐛 Troubleshooting

**Backend won't start?**
- Check MySQL is running
- Verify database exists
- Check `.env` file exists

**Frontend won't start?**
- Run `npm install` again
- Check Node.js version (16+)
- Clear cache: `rm -rf node_modules package-lock.json && npm install`

**Can't login?**
- Run `python load_sample_data.py` to create users
- Check backend is running
- Verify credentials

**Connection error?**
- Verify backend is running: http://127.0.0.1:8000/api
- Check backend started with: `python manage.py runserver 127.0.0.1:8000`
- Frontend uses proxy automatically - no configuration needed

---

## 📚 Need More Help?

- **Detailed Setup**: [SETUP.md](SETUP.md)
- **Full Documentation**: [DOCUMENTATION.md](DOCUMENTATION.md)
- **FAQ**: See [README.md](README.md#-faq)

---

**Happy Coding! 🚀**

