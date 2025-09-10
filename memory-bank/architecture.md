# Architecture Documentation: Long-Distance Move Planner SaaS

## Overview

This document provides a comprehensive overview of the system architecture and explains the purpose of each file in the codebase. The application follows a modern full-stack architecture with a React frontend and Node.js/Express backend.

## High-Level Architecture

```
┌─────────────────┐    HTTP/HTTPS    ┌─────────────────┐
│   React Frontend │ ◄─────────────► │  Express Backend │
│   (Port 3000)   │                  │   (Port 5000)   │
└─────────────────┘                  └─────────────────┘
                                              │
                                              ▼
                                     ┌─────────────────┐
                                     │   PostgreSQL    │
                                     │    Database     │
                                     └─────────────────┘
```

## Backend Architecture (Node.js + Express + TypeScript)

### Core Application Files

#### `src/app.ts`
**Purpose:** Main Express application configuration and middleware setup
**Key Features:**
- CORS configuration for frontend communication
- Security middleware (Helmet)
- Request logging (Morgan)
- Body parsing for JSON and URL-encoded data
- Error handling middleware
- Route registration
- Health check endpoint

#### `src/server.ts`
**Purpose:** Server entry point and startup configuration
**Key Features:**
- Server initialization
- Port configuration from environment variables
- Graceful shutdown handling
- Development vs production environment detection

### Database Layer

#### `src/config/database.ts`
**Purpose:** Database connection configuration using Knex.js
**Key Features:**
- Environment-based configuration
- Connection pooling setup
- Query builder initialization
- Database client export for use throughout the application

#### `knexfile.js`
**Purpose:** Knex.js configuration for different environments
**Key Features:**
- Development, staging, and production configurations
- Migration and seed file paths
- SSL configuration for production
- Connection parameters from environment variables

#### Migration Files
**`src/migrations/20250910021612_create_users_table.js`**
- Creates users table with UUID primary key
- Email uniqueness constraint
- Password storage (hashed)
- User profile fields (first_name, last_name)
- Timestamps for audit trail
- Email index for performance

**`src/migrations/20250910021623_create_moves_table.js`**
- Creates moves table with UUID primary key
- Foreign key relationship to users table
- JSONB fields for flexible location data
- Move status tracking
- Household size and inventory estimates
- Proper indexing for performance

### Authentication System

#### `src/services/authService.ts`
**Purpose:** Core authentication business logic
**Key Features:**
- Password hashing with bcrypt (12 salt rounds)
- JWT token generation and validation
- User creation with duplicate email checking
- User login with credential verification
- User profile retrieval and updates
- Secure password comparison

#### `src/controllers/authController.ts`
**Purpose:** HTTP request handlers for authentication endpoints
**Key Features:**
- User registration endpoint (`POST /api/auth/register`)
- User login endpoint (`POST /api/auth/login`)
- Profile retrieval endpoint (`GET /api/auth/me`)
- Profile update endpoint (`PUT /api/auth/profile`)
- Consistent error handling and response formatting
- Input validation integration

#### `src/routes/auth.ts`
**Purpose:** Authentication route definitions and validation
**Key Features:**
- Route path definitions
- Input validation rules using express-validator
- Middleware integration
- Request validation before controller execution

#### `src/middleware/auth.ts`
**Purpose:** Authentication middleware for protecting routes
**Key Features:**
- JWT token extraction from Authorization header
- Token verification and user context injection
- Optional authentication for public routes
- Error handling for invalid/expired tokens
- Request object extension with user data

### Move Management System

#### `src/services/moveService.ts`
**Purpose:** Move management business logic
**Key Features:**
- Move creation with location data serialization
- User-specific move retrieval
- Move updates with partial data support
- Move deletion with cascade handling
- Move status management
- Location data deserialization for API responses

#### `src/controllers/moveController.ts`
**Purpose:** HTTP request handlers for move management endpoints
**Key Features:**
- Move creation endpoint (`POST /api/moves`)
- Move listing endpoint (`GET /api/moves`)
- Individual move retrieval (`GET /api/moves/:id`)
- Move updates (`PUT /api/moves/:id`)
- Move deletion (`DELETE /api/moves/:id`)
- Move status updates (`PATCH /api/moves/:id/status`)
- User authorization checks
- Consistent error handling

#### `src/routes/moves.ts`
**Purpose:** Move management route definitions and validation
**Key Features:**
- Comprehensive input validation for move data
- Location data validation (address, city, state, etc.)
- Move date validation
- Household size and inventory size validation
- Status validation for updates
- Authentication middleware integration

### Type System

#### `src/types/index.ts`
**Purpose:** TypeScript type definitions for the entire application
**Key Features:**
- User interface definitions
- Move and location data structures
- API request/response types
- Authentication types
- Database entity types
- JWT payload definitions

### Utility Layer

#### `src/middleware/validation.ts`
**Purpose:** Request validation middleware
**Key Features:**
- Validation error handling
- Error response formatting
- Validation chain execution
- Integration with express-validator

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

## Configuration Files

### Backend Configuration

#### `package.json` (Backend)
**Dependencies:**
- `express`: Web framework
- `cors`: Cross-origin resource sharing
- `helmet`: Security headers
- `morgan`: HTTP request logging
- `dotenv`: Environment variable management
- `bcryptjs`: Password hashing
- `jsonwebtoken`: JWT token handling
- `express-validator`: Input validation
- `pg`: PostgreSQL client
- `knex`: SQL query builder

**Dev Dependencies:**
- `typescript`: TypeScript compiler
- `@types/*`: TypeScript type definitions
- `ts-node`: TypeScript execution
- `nodemon`: Development server

#### `tsconfig.json`
**Purpose:** TypeScript compiler configuration
**Key Features:**
- Strict type checking
- ES2020 target
- CommonJS modules
- Source map generation
- Declaration file generation
- Path mapping for imports

### Frontend Configuration

#### `package.json` (Frontend)
**Dependencies:**
- `react`: UI library
- `react-dom`: DOM rendering
- `react-router-dom`: Client-side routing
- `axios`: HTTP client
- `vite`: Build tool and dev server

**Dev Dependencies:**
- `@types/react`: React TypeScript types
- `@types/react-dom`: React DOM TypeScript types
- `@types/react-router-dom`: Router TypeScript types
- `typescript`: TypeScript compiler
- `tailwindcss`: CSS framework
- `postcss`: CSS processing
- `autoprefixer`: CSS vendor prefixing

#### `vite.config.ts`
**Purpose:** Vite build tool configuration
**Key Features:**
- React plugin integration
- Development server configuration
- Build optimization
- TypeScript support

#### `tailwind.config.js`
**Purpose:** Tailwind CSS configuration
**Key Features:**
- Content path definitions
- Theme customization
- Plugin configuration

## Environment Configuration

### Backend Environment Variables
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `DB_NAME`: Database name
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `JWT_SECRET`: JWT signing secret
- `JWT_EXPIRES_IN`: Token expiration time
- `CORS_ORIGIN`: Allowed frontend origin

### Frontend Environment Variables
- `VITE_API_URL`: Backend API URL

## Security Considerations

1. **Authentication:**
   - JWT tokens with expiration
   - Password hashing with bcrypt
   - Secure token storage

2. **Input Validation:**
   - Server-side validation with express-validator
   - Client-side validation for UX
   - SQL injection prevention with Knex.js

3. **CORS Configuration:**
   - Restricted to frontend origin
   - Credentials support for authentication

4. **Security Headers:**
   - Helmet middleware for security headers
   - HTTPS enforcement in production

## Scalability Considerations

1. **Database:**
   - Proper indexing for performance
   - JSONB for flexible data storage
   - Connection pooling ready

2. **API Design:**
   - RESTful endpoints
   - Consistent response format
   - Error handling

3. **Frontend:**
   - Component-based architecture
   - Type safety with TypeScript
   - Responsive design

## Development Workflow

1. **Backend Development:**
   - `npm run dev`: Start development server with hot reload
   - `npm run build`: Compile TypeScript
   - `npm start`: Start production server

2. **Frontend Development:**
   - `npm run dev`: Start development server
   - `npm run build`: Build for production
   - `npm run preview`: Preview production build

3. **Database Management:**
   - `npx knex migrate:make <name>`: Create migration
   - `npx knex migrate:latest`: Run migrations
   - `npx knex migrate:rollback`: Rollback migrations

This architecture provides a solid foundation for the Long-Distance Move Planner SaaS, with clear separation of concerns, type safety, and scalability considerations built in from the start.
