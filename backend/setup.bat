@echo off
echo ========================================
echo CERL Backend Setup Script
echo ========================================

echo.
echo Step 1: Creating virtual environment...
python -m venv venv

echo.
echo Step 2: Activating virtual environment...
call venv\Scripts\activate

echo.
echo Step 3: Upgrading pip...
python -m pip install --upgrade pip

echo.
echo Step 4: Installing dependencies...
pip install -r requirements.txt

echo.
echo Step 5: Creating .env file...
if not exist .env (
    copy .env.example .env
    echo .env file created. Please edit it with your database credentials.
) else (
    echo .env file already exists.
)

echo.
echo Step 6: Running migrations...
python manage.py makemigrations
python manage.py migrate

echo.
echo Step 7: Creating superuser...
echo Username: admin
echo Password: Yousuf@2005
python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='admin').exists() or User.objects.create_superuser('admin', 'admin@cerl.local', 'Yousuf@2005', role='admin')"

echo.
echo Step 8: Collecting static files...
python manage.py collectstatic --noinput

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the server, run:
echo   venv\Scripts\activate
echo   python manage.py runserver
echo.
pause
