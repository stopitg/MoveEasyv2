# Architecture Documentation: MoveEasy Frontend

## Overview

This document provides a comprehensive overview of the frontend architecture for the MoveEasy long-distance move planner application. The frontend is built with React, TypeScript, and modern web technologies.

## High-Level Architecture

```
┌─────────────────┐    HTTP/HTTPS    ┌─────────────────┐
│  React Frontend │ ◄─────────────► │  Express Backend │
│   (Port 3000)   │                  │   (Port 5000)   │
└─────────────────┘                  └─────────────────┘
```

## Frontend Architecture (React + TypeScript + Vite)

### Application Structure

#### `src/App.tsx`
**Purpose:** Main application component and routing setup
**Key Features:**
- React Router configuration
- Authentication provider wrapping
- Route definitions (login, register, dashboard)
- Protected route implementation
- Default route redirection

#### `src/main.tsx`
**Purpose:** Application entry point
**Key Features:**
- React DOM rendering
- Root component mounting
- CSS imports (Tailwind)

### Authentication System

#### `src/contexts/AuthContext.tsx`
**Purpose:** Global authentication state management
**Key Features:**
- User state management
- Token storage and retrieval
- Login/logout functionality
- Registration handling
- Automatic token refresh
- Local storage persistence
- Loading state management

#### `src/components/ProtectedRoute.tsx`
**Purpose:** Route protection component
**Key Features:**
- Authentication state checking
- Redirect to login for unauthenticated users
- Loading state display
- Preserve intended destination after login

### Page Components

#### `src/pages/Login.tsx`
**Purpose:** User login interface
**Key Features:**
- Email and password form
- Form validation
- Error message display
- Loading state handling
- Redirect after successful login
- Link to registration page

#### `src/pages/Register.tsx`
**Purpose:** User registration interface
**Key Features:**
- Complete user registration form
- Password confirmation validation
- Client-side validation
- Error handling
- Automatic login after registration
- Link to login page

#### `src/pages/Dashboard.tsx`
**Purpose:** Main application dashboard
**Key Features:**
- Move listing with status indicators
- Empty state handling
- Move creation navigation
- User profile display
- Logout functionality
- Responsive design
- Status-based styling

#### `src/pages/TaskManagement.tsx`
**Purpose:** Task management interface
**Key Features:**
- Task list with filtering and sorting
- Task creation and editing
- Drag-and-drop task reordering
- Task status management
- Task statistics and analytics
- Template system for common tasks

#### `src/pages/InventoryManagement.tsx`
**Purpose:** Inventory management interface
**Key Features:**
- Room-based organization
- Item creation and editing
- Box management with QR codes
- Search and filtering
- Value estimation
- Statistics and analytics

### API Integration

#### `src/services/api.ts`
**Purpose:** Centralized API communication layer
**Key Features:**
- Axios instance configuration
- Automatic token attachment
- Request/response interceptors
- Error handling and token refresh
- Type-safe API methods
- Environment-based base URL

### Type System

#### `src/types/index.ts`
**Purpose:** Frontend TypeScript type definitions
**Key Features:**
- User interface definitions
- Move and location data structures
- API response types
- Authentication context types
- Form data types
- Component prop types

### Styling System

#### Tailwind CSS Configuration
**Purpose:** Utility-first CSS framework
**Key Features:**
- Responsive design utilities
- Custom color palette
- Component-based styling
- Dark mode support (future)
- Accessibility utilities

#### `src/App.css` & `src/index.css`
**Purpose:** Global styles and Tailwind imports
**Key Features:**
- Tailwind CSS imports
- Custom CSS variables
- Global styles
- Font imports

### Component Architecture

#### Reusable Components
- `Button` - Standardized button component
- `Input` - Form input component
- `Modal` - Modal dialog component
- `LoadingSpinner` - Loading indicator
- `ErrorBoundary` - Error handling component

#### Page Components
- `Dashboard` - Main dashboard
- `Login` - Authentication pages
- `Register` - User registration
- `TaskManagement` - Task management
- `InventoryManagement` - Inventory management

### State Management

#### Context API
- `AuthContext` - Authentication state
- Future contexts for other global state

#### Local State
- Component-level state with `useState`
- Form state management
- UI state (modals, loading states)

### Routing System

#### React Router DOM
- Client-side routing
- Protected routes
- Route parameters
- Navigation guards

#### Route Structure
- `/` - Dashboard (protected)
- `/login` - Login page
- `/register` - Registration page
- `/moves/:id/tasks` - Task management
- `/moves/:id/inventory` - Inventory management

### Build System

#### Vite Configuration
- Fast development server
- Hot module replacement
- TypeScript support
- Build optimization
- Environment variable handling

#### Build Process
- TypeScript compilation
- Asset optimization
- Code splitting
- Source map generation

### Development Tools

#### TypeScript
- Type safety
- IntelliSense support
- Compile-time error checking
- Interface definitions

#### ESLint
- Code linting
- Style enforcement
- Error prevention
- Best practices

#### Vite Dev Server
- Fast HMR
- TypeScript support
- Environment variables
- Proxy configuration

## Performance Considerations

### Code Splitting
- Route-based code splitting
- Component lazy loading
- Bundle optimization

### Caching
- API response caching
- Local storage caching
- Service worker (future)

### Optimization
- Image optimization
- Bundle size optimization
- Tree shaking
- Dead code elimination

## Security Considerations

### Authentication
- JWT token management
- Secure token storage
- Automatic token refresh
- Logout on token expiry

### Input Validation
- Client-side validation
- Server-side validation integration
- XSS prevention
- CSRF protection

### Data Protection
- Sensitive data handling
- Secure API communication
- Environment variable protection

## Accessibility

### WCAG Compliance
- Keyboard navigation
- Screen reader support
- Color contrast
- Focus management

### Semantic HTML
- Proper heading structure
- Form labels
- ARIA attributes
- Landmark roles

## Responsive Design

### Mobile-First Approach
- Mobile-optimized layouts
- Touch-friendly interfaces
- Responsive breakpoints
- Flexible grid systems

### Cross-Browser Support
- Modern browser support
- Progressive enhancement
- Fallback strategies
- Polyfill support

## Development Workflow

### Local Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linting

### Code Quality
- TypeScript type checking
- ESLint code linting
- Consistent code formatting
- Component testing (future)

This architecture provides a solid foundation for the MoveEasy Frontend, with modern React patterns, type safety, and excellent developer experience.
