# 📚 CERL System - Complete Documentation

Comprehensive documentation for the Community Emergency Resource Locator (CERL) system.

---

## 📋 Table of Contents

- [System Overview](#system-overview)
- [User Roles & Permissions](#user-roles--permissions)
- [Features Documentation](#features-documentation)
- [API Reference](#api-reference)
- [Frontend Components](#frontend-components)
- [Backend Architecture](#backend-architecture)
- [Database Schema](#database-schema)
- [Deployment Guide](#deployment-guide)

---

## System Overview

CERL is a comprehensive emergency resource management system designed to help communities locate and manage emergency resources during disasters and crises.

### Core Objectives

1. **Rapid Discovery** - Enable quick location of nearby emergency resources
2. **Real-time Updates** - Provide up-to-date resource availability
3. **Verified Data** - Ensure resource information accuracy
4. **Accessibility** - Support for various devices and connectivity levels
5. **Community Preparedness** - Improve response time during emergencies

---

## User Roles & Permissions

### 👤 Citizen (Default Role)

**Permissions:**
- View all resources (public)
- Search and filter resources
- Submit new resources
- View emergency alerts
- Access emergency helplines

**Restrictions:**
- Cannot verify resources
- Cannot create alerts
- Cannot manage users

### 👨‍💼 Resource Coordinator

**Permissions:**
- All Citizen permissions
- Update capacity for assigned resources
- View analytics for assigned resources
- Manage assigned resource status

**Restrictions:**
- Cannot verify resources
- Cannot create alerts
- Cannot manage users
- Can only update assigned resources

### 🔐 Administrator

**Permissions:**
- All permissions
- Verify resources
- Create and manage alerts
- Manage users (approve, change roles)
- Assign coordinators to resources
- View system statistics
- Export data
- Edit resource locations

**Restrictions:**
- None (full system access)

---

## Features Documentation

### 🗺️ Resource Discovery

#### Location-Based Search

Users can find resources based on their current location:

- **GPS Detection**: Automatic location detection using browser geolocation API
- **Fallback Location**: Defaults to Mysore, Karnataka if GPS unavailable
- **Distance Filter**: Filter resources within specified radius (1-50 km)
- **Nearby Resources**: Haversine formula calculates accurate distances

#### Filtering Options

- **Resource Type**: Hospital, Police, Fire, Shelter, Food, Water
- **Status**: Open, Closed, Full Capacity
- **Region**: Filter by city/district
- **Search**: Text search in name and description
- **Distance**: Maximum distance slider

#### Map Features

- **Interactive Map**: Leaflet-based map with OpenStreetMap tiles
- **Resource Markers**: Color-coded markers by resource type
- **User Location**: Blue marker showing current position
- **Distance Circle**: Visual radius showing search area
- **Click to View**: Click markers for resource details
- **Get Directions**: One-click navigation via Google Maps

### 📍 Resource Management

#### Resource Submission

**Citizens can submit new resources:**

1. Navigate to "Submit Resource" page
2. Fill in resource details:
   - Name, Type, Address
   - Location (map picker or coordinates)
   - Capacity information
   - Contact details
   - Description
   - Image upload (optional)
3. Submit for admin verification

#### Resource Verification

**Admins can verify resources:**

1. View unverified resources in admin dashboard
2. Review resource details
3. Click "Verify" to approve
4. Verified resources appear in public listings

#### Location Editing

**Admins can update resource coordinates:**

1. Click "📍 Edit Location" on any resource
2. Use interactive map picker
3. Click on map or enter coordinates manually
4. Save changes

### 🚨 Emergency Alerts

#### Alert Creation (Admin Only)

**Create emergency alerts:**

1. Navigate to Admin Dashboard
2. Fill alert form:
   - Title
   - Description
   - Severity (Low, Medium, High)
   - Target Region
   - Expiry Date (optional)
3. Alert appears immediately to users

#### Alert Display

- **Banner Display**: Top of page with severity colors
- **Auto-refresh**: Updates every 30 seconds
- **Dismissible**: Users can dismiss alerts
- **Region Filtering**: Alerts filtered by user region
- **Severity Indicators**: Color-coded (Red=High, Orange=Medium, Yellow=Low)

### 📊 Admin Dashboard

#### User Management

- **View All Users**: List of all registered users
- **Approve Users**: Approve coordinator/admin accounts
- **Change Roles**: Update user roles (Citizen, Coordinator, Admin)
- **User Details**: View username, email, phone, role, approval status

#### Resource Management

- **Resource List**: View all resources with details
- **Verify Resources**: Approve submitted resources
- **Assign Coordinators**: Assign coordinators to resources
- **Edit Locations**: Update resource coordinates
- **Export CSV**: Download resource data

#### Statistics Dashboard

- **Total Resources**: Count of all resources
- **Verified Resources**: Count of verified resources
- **By Type**: Breakdown by resource type
- **By Status**: Breakdown by status (Open/Closed/Full)

#### Activity Logs

- **Recent Updates**: Latest 10 resource capacity updates
- **Change History**: Track capacity changes
- **Coordinator Actions**: See who made changes
- **Timestamps**: When changes occurred

### 👨‍💼 Coordinator Dashboard

#### Assigned Resources

- **Resource List**: View all assigned resources
- **Quick Updates**: Fast capacity updates
- **Status Management**: Update resource status
- **Analytics**: View usage statistics

#### Capacity Updates

1. Select resource from list
2. Enter new available capacity
3. Add change log (optional)
4. Save update
5. Status auto-updates based on capacity

---

## API Reference

### Base URL

```
http://localhost:8000/api
```

### Authentication

All authenticated endpoints require JWT token in header:

```
Authorization: Bearer <access_token>
```

### Endpoints

#### Authentication

##### Register User
```
POST /api/auth/register/
```

**Request Body:**
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "securepassword",
  "role": "citizen",
  "phone_number": "+919876543210"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "username": "newuser",
    "email": "user@example.com",
    "role": "citizen",
    "is_approved": true
  },
  "tokens": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

##### Login
```
POST /api/auth/login/
```

**Request Body:**
```json
{
  "username": "admin",
  "password": "password"
}
```

**Response:** Same as register

##### Get Current User
```
GET /api/auth/me/
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "role": "admin",
  "is_approved": true
}
```

#### Resources

##### List Resources
```
GET /api/resources/
```

**Query Parameters:**
- `type`: Filter by type (hospital, police, fire, shelter, food, water)
- `status`: Filter by status (open, closed, full)
- `region`: Filter by region
- `search`: Search in name/description

**Example:**
```
GET /api/resources/?type=hospital&status=open&region=Mysore
```

##### Get Nearby Resources
```
GET /api/resources/nearby/
```

**Query Parameters:**
- `lat`: Latitude (required)
- `lon`: Longitude (required)
- `max_distance`: Maximum distance in km (default: 10)
- `type`: Filter by type (optional)
- `status`: Filter by status (optional)

**Example:**
```
GET /api/resources/nearby/?lat=12.3051&lon=76.6550&max_distance=5&type=hospital
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "K.R. Hospital Mysore",
    "type": "hospital",
    "latitude": "12.305100",
    "longitude": "76.655000",
    "distance": 2.5,
    "status": "open",
    "capacity": 500,
    "available_capacity": 120,
    "contact": "+918212520200",
    "verified": true
  }
]
```

##### Get Resource Details
```
GET /api/resources/{id}/
```

##### Create Resource
```
POST /api/resources/
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `name`: Resource name
- `type`: Resource type
- `latitude`: Latitude
- `longitude`: Longitude
- `address`: Full address
- `region`: Region/city
- `capacity`: Total capacity
- `available_capacity`: Available capacity
- `status`: Status (open/closed/full)
- `contact`: Contact number
- `helpline`: Helpline number (optional)
- `description`: Description
- `image`: Image file (optional)

##### Update Resource
```
PUT /api/resources/{id}/
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:** Same as create (all fields)

##### Verify Resource (Admin)
```
POST /api/resources/{id}/verify/
```

**Headers:**
```
Authorization: Bearer <admin_token>
```

##### Update Capacity (Coordinator/Admin)
```
POST /api/resources/{id}/update_capacity/
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "available_capacity": 100,
  "change_log": "Updated after emergency response"
}
```

##### Assign Coordinator (Admin)
```
POST /api/resources/{id}/assign_coordinator/
```

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "coordinator_id": 5
}
```

##### Get Statistics (Admin)
```
GET /api/resources/stats/
```

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "total_resources": 25,
  "verified_resources": 20,
  "by_type": [
    {"type": "hospital", "count": 5},
    {"type": "shelter", "count": 8}
  ],
  "by_status": [
    {"status": "open", "count": 18},
    {"status": "full", "count": 2}
  ]
}
```

##### Export CSV (Admin)
```
GET /api/resources/export/
```

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:** CSV file download

#### Alerts

##### List All Alerts
```
GET /api/alerts/
```

##### Get Active Alerts
```
GET /api/alerts/active/
```

**Query Parameters:**
- `region`: Filter by region (optional)

##### Create Alert (Admin)
```
POST /api/alerts/
```

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "title": "Heavy Rainfall Warning",
  "description": "Heavy rain expected in next 48 hours",
  "severity": "high",
  "region": "Mysore",
  "expires_at": "2024-12-31T23:59:59Z"
}
```

##### Update Alert (Admin)
```
PUT /api/alerts/{id}/
```

##### Delete Alert (Admin)
```
DELETE /api/alerts/{id}/
```

#### Users (Admin Only)

##### List Users
```
GET /api/users/
```

**Headers:**
```
Authorization: Bearer <admin_token>
```

##### Update User
```
PUT /api/users/{id}/
```

**Request Body:**
```json
{
  "role": "coordinator",
  "is_approved": true
}
```

##### Approve User
```
POST /api/users/{id}/approve/
```

---

## Frontend Components

### Page Components

#### HomePage
- Main landing page with map and resource list
- Location detection
- Resource filtering
- Resource details modal

#### LoginPage
- User authentication
- JWT token storage
- Redirect after login

#### RegisterPage
- User registration
- Role selection
- Form validation

#### AdminDashboard
- User management
- Resource management
- Alert creation
- Statistics display
- Activity logs

#### CoordinatorDashboard
- Assigned resources list
- Capacity updates
- Resource analytics

#### ResourceSubmitPage
- Resource submission form
- Map picker for location
- Image upload
- Form validation

### Common Components

#### Map
- Leaflet map integration
- Resource markers
- User location marker
- Distance circle
- Popup details

#### MapPicker
- Interactive coordinate selection
- Manual coordinate input
- Real-time coordinate display

#### SearchFilters
- Type filter dropdown
- Status filter dropdown
- Distance slider
- Search input

#### ResourceList
- Resource cards
- Quick filters
- Capacity indicators
- Status badges

#### AlertBanner
- Alert display
- Severity colors
- Dismiss functionality
- Auto-refresh

#### ProtectedRoute
- Route protection
- Role-based access
- Redirect to login

### Services

#### api.js
- Axios instance configuration
- Request/response interceptors
- Token management

#### authService.js
- Login/register
- Token storage
- User management

#### resourceService.js
- Resource CRUD operations
- Nearby search
- Statistics
- Export

#### alertService.js
- Alert CRUD operations
- Active alerts

---

## Backend Architecture

### Django Apps

#### core_resources
Main application containing:
- User model (custom user)
- Resource model
- ResourceUpdate model (audit log)
- Authentication endpoints
- Resource management endpoints

#### user_alerts
Alert management application:
- Alert model
- Alert CRUD endpoints
- Active alerts filtering

### Models

#### User (Custom)
- Extends AbstractUser
- Role field (citizen/coordinator/admin)
- Phone number
- Approval status

#### Resource
- Basic info (name, type, description)
- Location (latitude, longitude, address, region)
- Capacity (total, available)
- Status (open/closed/full)
- Contact info
- Verification status
- Coordinator assignment
- Image upload

#### Alert
- Title, description
- Severity (low/medium/high)
- Region targeting
- Active status
- Expiry date
- Creator (admin)

#### ResourceUpdate
- Audit log for capacity changes
- Previous/new capacity
- Change log message
- Timestamp
- Coordinator/admin reference

### Views

#### ViewSets
- `ResourceViewSet`: Full CRUD + custom actions
- `AlertViewSet`: Alert management
- `UserViewSet`: User management (admin)
- `ResourceUpdateViewSet`: Read-only audit log

#### Custom Actions
- `nearby`: Find nearby resources
- `verify`: Verify resource (admin)
- `update_capacity`: Update capacity (coordinator/admin)
- `assign_coordinator`: Assign coordinator (admin)
- `stats`: Get statistics (admin)
- `export`: Export CSV (admin)
- `active`: Get active alerts

### Serializers

- `UserSerializer`: User data serialization
- `ResourceSerializer`: Resource with distance calculation
- `AlertSerializer`: Alert data
- `ResourceUpdateSerializer`: Audit log data

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(150) UNIQUE,
    email VARCHAR(254),
    password VARCHAR(128),
    role VARCHAR(20),
    phone_number VARCHAR(15),
    is_approved BOOLEAN,
    date_joined DATETIME,
    ...
);
```

### Resources Table
```sql
CREATE TABLE resources (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    type VARCHAR(20),
    description TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    address TEXT,
    region VARCHAR(100),
    capacity INT,
    available_capacity INT,
    status VARCHAR(10),
    contact VARCHAR(15),
    helpline VARCHAR(15),
    image VARCHAR(100),
    verified BOOLEAN,
    verified_by_id INT,
    coordinator_id INT,
    created_at DATETIME,
    updated_at DATETIME,
    ...
);
```

### Alerts Table
```sql
CREATE TABLE alerts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255),
    description TEXT,
    severity VARCHAR(10),
    region VARCHAR(100),
    is_active BOOLEAN,
    created_by_id INT,
    created_at DATETIME,
    expires_at DATETIME,
    ...
);
```

### Resource Updates Table
```sql
CREATE TABLE resource_updates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    resource_id INT,
    coordinator_id INT,
    timestamp DATETIME,
    change_log TEXT,
    previous_capacity INT,
    new_capacity INT,
    ...
);
```

---

## Deployment Guide

### Backend Deployment

1. **Prepare Server:**
   ```bash
   sudo apt update
   sudo apt install python3-pip python3-venv mysql-server nginx
   ```

2. **Setup Database:**
   ```bash
   mysql -u root -p
   CREATE DATABASE cerl_db;
   CREATE USER 'cerl_user'@'localhost' IDENTIFIED BY 'password';
   GRANT ALL PRIVILEGES ON cerl_db.* TO 'cerl_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

3. **Deploy Code:**
   ```bash
   git clone <repository>
   cd cerl-system/backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

4. **Configure Settings:**
   - Update `DEBUG = False`
   - Set `ALLOWED_HOSTS`
   - Configure database credentials
   - Set `SECRET_KEY`

5. **Run Migrations:**
   ```bash
   python manage.py migrate
   python manage.py collectstatic
   ```

6. **Setup Gunicorn:**
   ```bash
   pip install gunicorn
   gunicorn cerl_project.wsgi:application --bind 0.0.0.0:8000
   ```

7. **Configure Nginx:**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://127.0.0.1:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }

       location /static/ {
           alias /path/to/cerl-system/backend/staticfiles/;
       }

       location /media/ {
           alias /path/to/cerl-system/backend/media/;
       }
   }
   ```

### Frontend Deployment

1. **Build:**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Serve:**
   - Option 1: Serve from Django static files
   - Option 2: Use Nginx to serve `dist/` folder
   - Option 3: Deploy to Vercel/Netlify

### Environment Variables

**Production Backend:**
```env
DEBUG=False
SECRET_KEY=<strong-secret-key>
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DB_NAME=cerl_db
DB_USER=cerl_user
DB_PASSWORD=<secure-password>
```

**Production Frontend:**
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

---

## Security Considerations

1. **Authentication**: JWT tokens with expiration
2. **Authorization**: Role-based access control
3. **CORS**: Configured for specific origins
4. **SQL Injection**: Django ORM protection
5. **XSS**: React auto-escaping
6. **CSRF**: Django CSRF protection
7. **File Upload**: Image validation
8. **Password**: Django password hashing

---

## Performance Optimization

1. **Database Indexing**: Indexes on location, type, status
2. **Pagination**: API pagination for large datasets
3. **Caching**: Consider Redis for frequently accessed data
4. **CDN**: Use CDN for static assets
5. **Image Optimization**: Compress uploaded images
6. **Lazy Loading**: Load resources on demand

---

## Future Enhancements

- [ ] Offline mode with service workers
- [ ] Push notifications
- [ ] SMS alerts
- [ ] Advanced analytics dashboard
- [ ] PDF export
- [ ] Multi-language support
- [ ] Accessibility improvements
- [ ] Mobile app (React Native)

---

**Version**: 1.0.0

---

For setup instructions, see [SETUP.md](SETUP.md)

For quick start, see [README.md](README.md)

