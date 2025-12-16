# TrajetCount - Fleet Management System 🚛

A comprehensive fleet management system designed for transportation companies to efficiently manage vehicles, drivers, trips, and tire maintenance. The system features role-based access with separate interfaces for administrators and drivers.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Integration](#api-integration)
- [User Roles](#user-roles)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [Related Repositories](#related-repositories)

## 🎯 Overview

TrajetCount is a modern fleet management solution that streamlines transportation operations through:
- **Vehicle Fleet Management**: Comprehensive tracking of trucks and trailers
- **Driver Management**: Complete driver profiles with statistics and assignments
- **Trip Planning & Tracking**: End-to-end trip management from planning to completion
- **Tire Maintenance**: Real-time tire condition monitoring and maintenance tracking
- **Reporting System**: Automated PDF report generation for completed trips

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based secure authentication
- Role-based access control (Admin/Chauffeur)
- Protected routes and API endpoints
- Secure logout functionality

### 👨‍💼 Admin Dashboard (Dark Theme)
- **Vehicle Management (Camions)**
  - Add, edit, delete trucks
  - Real-time availability tracking
  - Mileage and maintenance monitoring
  
- **Trailer Management (Remorques)**
  - Complete trailer lifecycle management
  - Load capacity and condition tracking
  - Serial number and brand management
  
- **Tire Management (Pneus)**
  - Individual tire tracking with wear percentage
  - Pressure monitoring with color-coded alerts
  - Assignment to specific vehicles
  - Maintenance status tracking
  
- **Driver Management (Chauffeurs)**
  - Driver profile management
  - Statistics and performance tracking
  - Trip assignment capabilities
  
- **Trip Management (Trajets)**
  - Complete trip lifecycle management
  - Resource assignment (driver, vehicle, trailer)
  - Route planning and tracking
  - Status management with real-time updates

### 🚗 Chauffeur Interface (Light Theme)
- **My Trips (Mes Trajets)**
  - View assigned trips with filtering
  - Start trips with mileage recording
  - Complete trips with final documentation
  - Download PDF trip reports
  
- **My Tires (Mes Pneus)**
  - View vehicle tire status
  - Update tire condition and pressure
  - Real-time maintenance alerts
  - Visual health indicators

### 📊 Advanced Features
- **Real-time Updates**: Immediate UI refresh without page reload
- **PDF Generation**: Automated trip reports with comprehensive details
- **Responsive Design**: Mobile-first approach for all devices
- **Search & Filtering**: Advanced filtering across all modules
- **Status Management**: Color-coded status indicators throughout the system

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library with latest features
- **Vite** - Fast build tool and development server
- **Redux Toolkit** - State management with modern patterns
- **React Router DOM** - Client-side routing with protected routes
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client with interceptors

### Development Tools
- **ESLint** - Code linting and quality enforcement
- **Git** - Version control with conventional commits

## 📁 Project Structure

```
src/
├── components/
│   ├── admin/           # Admin dashboard components (dark theme)
│   │   ├── camions.jsx     # Truck management
│   │   ├── chauffeurs.jsx  # Driver management
│   │   ├── pneus.jsx       # Tire management
│   │   ├── remorques.jsx   # Trailer management
│   │   └── trajets.jsx     # Trip management
│   ├── chauffeur/       # Driver interface components (light theme)
│   │   ├── dashboard.jsx   # Main dashboard
│   │   ├── mes-trajets.jsx # Trip management for drivers
│   │   ├── mes-pneus.jsx   # Tire management for drivers
│   │   └── navbar.jsx      # Light-themed navigation
│   ├── auth/            # Authentication components
│   │   ├── login.jsx       # Login form
│   │   ├── register.jsx    # Registration form
│   │   └── privateRoute.jsx # Route protection
│   └── common/          # Shared components
├── config/
│   └── api.js           # API configuration and interceptors
├── layout/
│   └── navbar.jsx       # Main navigation (dark theme)
├── redux/
│   ├── store.js         # Redux store configuration
│   └── authSlicer.js    # Authentication state management
└── assets/              # Static assets and styles
```

## 🚀 Installation

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn package manager
- Git

### Setup Frontend

1. **Clone the repository**
   ```bash
   git clone https://github.com/mazin0eg/TrajetCount-frontend.git
   cd TrajetCount-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Create .env file (if needed)
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🎮 Usage

### For Administrators
1. Login with admin credentials
2. Access the dark-themed admin dashboard
3. Manage fleet resources through dedicated modules:
   - Add and configure vehicles
   - Assign drivers to trips
   - Monitor tire conditions
   - Track trip progress
   - Generate comprehensive reports

### For Drivers (Chauffeurs)
1. Login with driver credentials
2. Access the light-themed driver interface
3. Manage personal assignments:
   - View and start assigned trips
   - Update vehicle tire conditions
   - Complete trips with documentation
   - Download trip reports

## 🔌 API Integration

The frontend communicates with the backend through RESTful APIs:

### Authentication Endpoints
```javascript
POST /api/auth/login      # User authentication
POST /api/auth/register   # User registration
GET  /api/auth/verify     # Token verification
```

### Admin Endpoints
```javascript
# Vehicle Management
GET    /api/camions       # Get all trucks
POST   /api/camions       # Create new truck
PUT    /api/camions/:id   # Update truck
DELETE /api/camions/:id   # Delete truck

# Similar patterns for remorques, pneus, chauffeurs, trajets
```

### Driver Endpoints
```javascript
GET  /api/chauffeur/trajets              # View my trips
GET  /api/chauffeur/trajets/:id/pdf      # Download trip PDF
GET  /api/chauffeur/pneus               # View my vehicle tires
PUT  /api/chauffeur/pneus/:id           # Update tire status
```

## 👥 User Roles

### 🛡️ Administrator
- **Full System Access**: Complete CRUD operations on all resources
- **Fleet Management**: Comprehensive vehicle and trailer management
- **Driver Oversight**: Monitor and assign drivers to trips
- **Trip Coordination**: Plan, assign, and track all transportation activities
- **Maintenance Management**: Oversee tire conditions and maintenance schedules
- **Reporting**: Access to all system reports and analytics

### 🚚 Chauffeur (Driver)
- **Personal Trip Management**: View and manage assigned trips
- **Vehicle Responsibility**: Monitor and update assigned vehicle conditions
- **Trip Documentation**: Record trip details and generate reports
- **Maintenance Reporting**: Update tire conditions and report issues
- **Limited Scope**: Access only to personally assigned resources

## 📸 Screenshots

### Admin Dashboard (Dark Theme)
- Modern dark interface for professional fleet management
- Comprehensive CRUD operations across all modules
- Real-time status updates and analytics

### Driver Interface (Light Theme)
- Clean, light interface optimized for field use
- Mobile-responsive design for on-the-go access
- Simplified workflows for common driver tasks

## 🤝 Contributing

We welcome contributions to improve TrajetCount! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Commit Convention
We follow conventional commits:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation updates
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions or updates

## 📂 Related Repositories

- **Backend Repository**: [TrajetCount-Backend](https://github.com/mazin0eg/TrajetCount-backend)
  - Node.js/Express API server
  - MongoDB database integration
  - JWT authentication
  - PDF generation capabilities

## 📄 License

This project is part of a fleet management solution. All rights reserved.

## 🔮 Future Enhancements

- [ ] Real-time GPS tracking integration
- [ ] Mobile application development
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Integration with third-party logistics services
- [ ] Automated maintenance scheduling
- [ ] Driver performance analytics

---

**Built with ❤️ for efficient fleet management**

For questions or support, please open an issue in the respective repository.
