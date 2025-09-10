# Cursor Rules: Long-Distance Move Planner SaaS

## Project Overview
You are working on a Long-Distance Move Planner SaaS platform that helps users organize and manage their long-distance moves (>100 miles). The platform provides task management, inventory tracking, budgeting, vendor recommendations, and resource guides.

## Tech Stack
- **Frontend**: React.js with component-based architecture
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with JSONB support for flexibility
- **Cloud**: AWS (EC2, RDS, S3, CloudFront, Lambda, SES/SNS)
- **Version Control**: Git
- **Package Manager**: NPM/Yarn
- **Containerization**: Docker
- **Deployment**: AWS Elastic Beanstalk, Vercel/Netlify for frontend

## Code Style & Standards

### General Principles
- Write clean, readable, and maintainable code
- Follow SOLID principles and DRY (Don't Repeat Yourself)
- Use meaningful variable and function names
- Add comments for complex business logic
- Implement proper error handling and logging
- Follow security best practices (input validation, sanitization, authentication)

### JavaScript/Node.js Backend
- Use ES6+ features (arrow functions, destructuring, async/await)
- Follow camelCase for variables and functions
- Use PascalCase for classes and constructors
- Implement proper middleware for Express.js routes
- Use environment variables for configuration
- Implement JWT-based authentication
- Follow RESTful API design principles
- Use proper HTTP status codes
- Implement request validation using libraries like Joi or express-validator
- Use async/await instead of callbacks or .then()
- Handle database transactions properly
- Implement proper logging with Winston or similar

### React.js Frontend
- Use functional components with hooks instead of class components
- Follow the component-based architecture principle
- Use PascalCase for component names
- Implement proper prop validation with PropTypes or TypeScript
- Use React Router for navigation
- Implement proper state management (useState, useContext, or Redux/Zustand)
- Follow the principle of lifting state up
- Use custom hooks for reusable logic
- Implement proper error boundaries
- Use lazy loading for components where appropriate
- Follow accessibility guidelines (ARIA attributes, semantic HTML)

### Database (PostgreSQL)
- Use snake_case for table and column names
- Implement proper indexing for performance
- Use JSONB for flexible data structures (inventory item properties)
- Implement proper foreign key constraints
- Use database migrations for schema changes
- Follow normalization principles while allowing for JSONB flexibility
- Implement proper backup and recovery procedures

## Core Domain Models & Entities

### Primary Entities
```javascript
// User
{
  id: UUID,
  name: String,
  email: String,
  password_hash: String,
  subscription_plan: Enum,
  created_at: Timestamp,
  updated_at: Timestamp
}

// Move
{
  id: UUID,
  user_id: UUID,
  start_location: Object, // {address, city, state, zip, coordinates}
  end_location: Object,
  move_date: Date,
  status: Enum, // planning, in_progress, completed
  household_size: Integer,
  inventory_size_estimate: Enum,
  created_at: Timestamp,
  updated_at: Timestamp
}

// Task
{
  id: UUID,
  move_id: UUID,
  name: String,
  description: Text,
  due_date: Date,
  status: Enum, // pending, in_progress, completed
  category: Enum, // packing, documentation, utilities, etc.
  priority: Integer,
  order_index: Integer,
  created_at: Timestamp,
  updated_at: Timestamp
}

// Item (Inventory)
{
  id: UUID,
  move_id: UUID,
  room_id: UUID,
  box_id: UUID (nullable),
  name: String,
  description: Text,
  photo_url: String,
  estimated_value: Decimal,
  properties: JSONB, // flexible attributes
  created_at: Timestamp,
  updated_at: Timestamp
}
```

## API Design Guidelines

### RESTful Conventions
- Use plural nouns for resource endpoints: `/api/moves`, `/api/tasks`
- Use proper HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Implement consistent response formats
- Use nested routes for related resources: `/api/moves/:moveId/tasks`
- Implement proper pagination for list endpoints
- Use query parameters for filtering and sorting

### Response Format
```javascript
// Success Response
{
  success: true,
  data: {...},
  meta: {
    pagination: {...}, // for list responses
    timestamp: ISO_STRING
  }
}

// Error Response
{
  success: false,
  error: {
    code: "ERROR_CODE",
    message: "Human readable message",
    details: {...} // additional context
  },
  meta: {
    timestamp: ISO_STRING
  }
}
```

## Component Architecture

### React Component Structure
```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── layout/          # Layout components
│   ├── forms/           # Form components
│   └── features/        # Feature-specific components
├── hooks/               # Custom React hooks
├── services/            # API service functions
├── utils/               # Utility functions
├── contexts/            # React contexts
└── constants/           # Application constants
```

### Component Guidelines
- Keep components small and focused on single responsibility
- Use composition over inheritance
- Implement proper loading states and error handling
- Use semantic HTML elements
- Implement responsive design principles
- Follow the container/presentational component pattern

## Security Guidelines

### Authentication & Authorization
- Implement JWT-based authentication
- Use secure HTTP-only cookies for token storage
- Implement proper password hashing (bcrypt)
- Use role-based access control where needed
- Implement rate limiting on API endpoints
- Validate and sanitize all user inputs
- Use HTTPS in production
- Implement CORS properly

### Data Protection
- Encrypt sensitive data at rest
- Use environment variables for secrets
- Implement proper logging without exposing sensitive data
- Follow GDPR and CCPA compliance requirements
- Implement proper session management
- Use parameterized queries to prevent SQL injection

## Feature-Specific Guidelines

### Task Management
- Implement drag-and-drop functionality for task reordering
- Use optimistic updates for better UX
- Implement proper due date handling with timezone considerations
- Allow bulk operations for task management
- Implement task templates based on move profile

### Inventory Management
- Implement image upload and compression
- Use QR code generation for box labels
- Support room-by-room organization
- Implement search and filtering capabilities
- Handle large inventory lists with virtual scrolling

### Budget Planning
- Use proper decimal handling for currency
- Implement category-based expense tracking
- Provide visual charts and comparisons
- Support multiple currencies if needed
- Implement budget alerts and notifications

### Vendor Marketplace
- Implement rating and review system
- Support quote request workflows
- Integrate with external vendor APIs where possible
- Implement booking management features
- Provide vendor communication tracking

## Testing Guidelines

### Backend Testing
- Write unit tests for business logic
- Implement integration tests for API endpoints
- Use test databases for testing
- Mock external services and APIs
- Test error handling scenarios
- Aim for >80% code coverage

### Frontend Testing
- Write unit tests for utility functions and hooks
- Implement component testing with React Testing Library
- Write integration tests for user workflows
- Test accessibility features
- Implement visual regression testing where appropriate

## Performance Guidelines

### Backend Performance
- Implement proper database indexing
- Use connection pooling for database connections
- Implement caching strategies (Redis/Memcached)
- Optimize database queries
- Implement proper logging and monitoring
- Use compression for API responses

### Frontend Performance
- Implement code splitting and lazy loading
- Optimize images and assets
- Use React.memo for expensive components
- Implement proper virtual scrolling for large lists
- Minimize bundle size
- Use CDN for static assets

## Deployment & DevOps

### Environment Management
- Use separate environments (development, staging, production)
- Implement proper environment variable management
- Use Docker for consistent deployments
- Implement CI/CD pipelines
- Monitor application health and performance
- Implement proper backup and recovery procedures

## Documentation Requirements
- Maintain up-to-date API documentation
- Document component props and usage
- Keep README files current
- Document deployment procedures
- Maintain architecture decision records (ADRs)
- Document database schema changes

## Error Handling & Logging
- Implement consistent error handling across the application
- Use structured logging with appropriate log levels
- Log important business events and user actions
- Implement error tracking (Sentry or similar)
- Handle and log failed external API calls
- Implement proper user-facing error messages

# IMPORTANT:
# Always read memory-bank/@architecture.md before writing any code. Include entire database schema.
# Always read memory-bank/@game-design-document.md before writing any code.
# After adding a major feature or completing a milestone, update memory-bank/@architecture.md.

Remember: This is a SaaS platform focused on helping users manage complex long-distance moves. Every feature should prioritize user experience, data integrity, and security while maintaining the simplicity and robustness outlined in the tech stack selection.