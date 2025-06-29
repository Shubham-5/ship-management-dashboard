# Ship Maintenance Dashboard

A complete React-based Ship Maintenance Dashboard for ENTNT with simulated authentication, role-based access, and comprehensive fleet management features.

## Features

### Core Functionality
- **Authentication & Authorization**: Simulated login with role-based access (Admin, Inspector, Engineer)
- **Ship Management**: Complete CRUD operations for ships with detailed profiles
- **Component Management**: Track ship components with maintenance status
- **Maintenance Jobs**: Create, update, and manage maintenance tasks with priorities and scheduling
- **Calendar View**: Visual scheduling of maintenance jobs with monthly calendar
- **Notification Center**: Real-time notifications for job updates, overdue maintenance, and system events
- **Reports & Analytics**: Generate fleet status, maintenance summary, performance, and cost analysis reports
- **Dashboard**: KPI overview with fleet statistics and recent activity

### Technical Features
- **Data Persistence**: All data stored in localStorage with automatic synchronization
- **Responsive Design**: Mobile-friendly UI using Material-UI components
- **State Management**: Zustand for efficient state management across components
- **Form Validation**: React Hook Form with comprehensive validation
- **Routing**: React Router with protected routes based on user roles

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI)** for components and theming
- **React Router** for navigation
- **Zustand** for state management
- **React Hook Form** for form handling
- **Vite** for development and building

### Data & Storage
- **localStorage** for data persistence (simulating backend)
- **Simulated APIs** with realistic data structures

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ship-management-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Demo Credentials

The application includes demo users for testing different roles:

**Admin User:**
- Email: admin@entnt.in
- Password: admin123

**Inspector User:**
- Email: inspector@entnt.in
- Password: inspect123

**Engineer User:**
- Email: engineer@entnt.in
- Password: engine123

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout.tsx      # Main layout with sidebar navigation
├── pages/              # Page components
│   ├── LoginPage.tsx   # Authentication page
│   ├── DashboardPage.tsx # Main dashboard with KPIs
│   ├── ShipsPage.tsx   # Ship management
│   ├── ShipDetailPage.tsx # Individual ship details
│   ├── JobsPage.tsx    # Maintenance jobs management
│   ├── CalendarPage.tsx # Job scheduling calendar
│   ├── NotificationsPage.tsx # Notification center
│   └── ReportsPage.tsx # Report generation
├── store/              # Zustand state management
│   ├── authStore.ts    # Authentication state
│   ├── shipStore.ts    # Ships, components, and jobs state
│   └── notificationStore.ts # Notifications state
├── utils/              # Utility functions
│   └── localStorage.ts # localStorage helpers
├── App.tsx             # Main app component with routing
└── main.tsx           # App entry point
```

## Key Features Explained

### Authentication System
- Session-based authentication with localStorage persistence
- Role-based access control (Admin, Inspector, Engineer)
- Automatic session validation and redirect

### Ship Management
- Complete ship profiles with IMO numbers, flags, and status
- Component tracking with maintenance status and serial numbers
- Hierarchical relationship between ships and components

### Maintenance Jobs
- Comprehensive job management with priorities and status tracking
- Assignment to engineers with scheduled dates
- Automatic notification creation for job events

### Notification System
- Real-time notifications for job creation, updates, and completion
- Overdue maintenance alerts
- Ship status change notifications
- Automatic cleanup and read status tracking

### Calendar Integration
- Monthly view of scheduled maintenance jobs
- Visual indicators for job priorities and status
- Click-through navigation to job details

### Reports & Analytics
- Fleet status reports with component and job statistics
- Maintenance summary with completion rates and priority breakdown
- Performance analysis with recommendations
- Export functionality (JSON format simulation)

## Development Notes

### State Management
The application uses Zustand for state management with three main stores:
- `authStore`: Handles user authentication and session management
- `shipStore`: Manages ships, components, and maintenance jobs
- `notificationStore`: Handles notifications and alerts

### Data Persistence
All data is stored in localStorage with automatic serialization/deserialization. The localStorage utility provides consistent data access across the application.

### Notification System
Notifications are automatically created for:
- New maintenance job creation
- Job status updates and completion
- Ship status changes
- Overdue maintenance detection (checked every 30 minutes)

### Responsive Design
The application is fully responsive using Material-UI's breakpoint system and flexible layout components.

## Application Architecture Overview

The Ship Maintenance Dashboard follows a modern React architecture with the following key design decisions:

### State Management Architecture
- **Zustand Stores**: Three separate stores handle different domains (auth, ships/jobs, notifications)
- **localStorage Integration**: Automatic persistence layer ensures data survives browser sessions
- **Reactive Updates**: UI automatically updates when state changes occur

### Component Architecture
- **Layout Component**: Centralized navigation and sidebar with notification badges
- **Page Components**: Each major feature has its own page component with routing
- **Protected Routes**: Role-based access control at the routing level
- **Form Components**: React Hook Form integration for consistent validation

### Data Flow
1. User actions trigger store methods
2. Store methods update state and persist to localStorage
3. Components automatically re-render with new state
4. Notifications are created for relevant actions

## Technical Decisions Made

### Frontend Framework & Libraries
- **React 18 with TypeScript**: Type safety and modern React features
- **Material-UI (MUI)**: Professional, accessible UI components with consistent theming
- **Zustand**: Lightweight state management (chosen over Redux for simplicity)
- **React Hook Form**: Performant form handling with built-in validation
- **React Router**: Standard routing solution with protected route support

### State Management Choice
**Why Zustand over Redux/Context API:**
- Smaller bundle size and simpler API
- Built-in TypeScript support
- Easy integration with localStorage
- Less boilerplate code compared to Redux
- Better performance than Context API for frequent updates

### Data Persistence Strategy
**localStorage Implementation:**
- Simulates backend API calls without external dependencies
- Automatic serialization/deserialization
- Consistent data structure across app lifecycle
- Easy debugging and data inspection

### UI/UX Decisions
- **Material-UI**: Ensures accessibility and professional appearance
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts
- **Notification System**: Real-time feedback for user actions
- **Role-based Navigation**: Different menu items based on user role

## Development & Deployment

### Build Process
```bash
npm run build    # Creates production build
npm run preview  # Preview production build locally
```

### Environment Configuration
No environment variables required 

