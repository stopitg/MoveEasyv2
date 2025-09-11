# Architecture Documentation: MoveEasy Backend API

## Overview

This document provides a comprehensive overview of the backend API architecture for the MoveEasy long-distance move planner application. The backend follows a modern Node.js/Express architecture with TypeScript and PostgreSQL.

## High-Level Architecture

```
┌─────────────────┐    HTTP/HTTPS    ┌─────────────────┐
│  React Frontend │ ◄─────────────► │  Express Backend │
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

### Task Management System

#### `src/services/taskService.ts`
**Purpose:** Task management business logic
**Key Features:**
- Task creation with validation
- Task retrieval with filtering and sorting
- Task updates and status management
- Task deletion with proper cleanup
- Task reordering functionality
- Task statistics and analytics

### Inventory Management System

#### `src/services/roomService.ts`
**Purpose:** Room management business logic
**Key Features:**
- Room creation and organization
- Room hierarchy management
- Room statistics and analytics

#### `src/services/itemService.ts`
**Purpose:** Item management business logic
**Key Features:**
- Item creation with detailed properties
- Item categorization and tagging
- Item value estimation
- Item search and filtering
- Item statistics and analytics

#### `src/services/boxService.ts`
**Purpose:** Box management business logic
**Key Features:**
- Box creation and labeling
- QR code generation for boxes
- Box content tracking
- Box destination management
- Box statistics and analytics

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

### Security Considerations

1. **Authentication:**
   - JWT tokens with expiration
   - Password hashing with bcrypt
   - Secure token storage

2. **Input Validation:**
   - Server-side validation with express-validator
   - SQL injection prevention with Knex.js

3. **CORS Configuration:**
   - Restricted to frontend origin
   - Credentials support for authentication

4. **Security Headers:**
   - Helmet middleware for security headers
   - HTTPS enforcement in production

## API Design

### RESTful Endpoints

The API follows RESTful conventions with consistent patterns:

- `GET /api/resource` - List resources
- `POST /api/resource` - Create resource
- `GET /api/resource/:id` - Get specific resource
- `PUT /api/resource/:id` - Update resource
- `DELETE /api/resource/:id` - Delete resource

### Response Format

All API responses follow a consistent format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

### Error Handling

- Consistent error response format
- Proper HTTP status codes
- Detailed error messages for development
- Sanitized error messages for production

## Database Schema

### Core Tables

- `users` - User accounts and profiles
- `moves` - Move records with location data
- `tasks` - Task management with categories and priorities
- `rooms` - Room definitions for moves
- `items` - Inventory items with descriptions and values
- `boxes` - Box tracking with QR codes and contents

### Relationships

- Users have many Moves (one-to-many)
- Moves have many Tasks, Rooms, Items, Boxes (one-to-many)
- Items belong to Rooms (many-to-one)
- Items can be in Boxes (many-to-one)
- Boxes have destination Rooms (many-to-one)

## Scalability Considerations

1. **Database:**
   - Proper indexing for performance
   - JSONB for flexible data storage
   - Connection pooling ready

2. **API Design:**
   - RESTful endpoints
   - Consistent response format
   - Error handling

3. **Performance:**
   - Efficient database queries
   - Proper caching strategies
   - Request/response optimization

## Development Workflow

1. **Development:**
   - `npm run dev` - Start development server with hot reload
   - `npm run build` - Compile TypeScript
   - `npm start` - Start production server

2. **Database Management:**
   - `npx knex migrate:make <name>` - Create migration
   - `npx knex migrate:latest` - Run migrations
   - `npx knex migrate:rollback` - Rollback migrations

This architecture provides a solid foundation for the MoveEasy Backend API, with clear separation of concerns, type safety, and scalability considerations built in from the start.
