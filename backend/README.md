# MoveEasy Backend API

A Node.js/Express backend API for the MoveEasy long-distance move planner application.

## Features

- User authentication and authorization (JWT)
- Move management and tracking
- Task management with templates
- Room and inventory management
- Box tracking and labeling
- RESTful API with comprehensive validation

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL with Knex.js ORM
- **Authentication:** JWT with bcrypt password hashing
- **Validation:** express-validator
- **Security:** Helmet, CORS

## Getting Started

### Prerequisites

- Node.js 18 or higher
- PostgreSQL database
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd moveeasy-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=moveeasy_dev
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_here_minimum_32_characters_long
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

4. Set up the database:
```bash
# Run migrations
npm run migrate

# Seed the database (optional)
npm run seed
```

5. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run migrate:rollback` - Rollback last migration
- `npm run migrate:make <name>` - Create new migration
- `npm run seed` - Run database seeds

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Move Management

- `GET /api/moves` - Get user's moves
- `POST /api/moves` - Create new move
- `GET /api/moves/:id` - Get specific move
- `PUT /api/moves/:id` - Update move
- `DELETE /api/moves/:id` - Delete move
- `PATCH /api/moves/:id/status` - Update move status

### Task Management

- `GET /api/moves/:moveId/tasks` - Get tasks for a move
- `POST /api/moves/:moveId/tasks` - Create new task
- `PUT /api/moves/:moveId/tasks/:id` - Update task
- `DELETE /api/moves/:moveId/tasks/:id` - Delete task
- `PATCH /api/moves/:moveId/tasks/:id/status` - Update task status
- `POST /api/moves/:moveId/tasks/reorder` - Reorder tasks

### Room Management

- `GET /api/moves/:moveId/rooms` - Get rooms for a move
- `POST /api/moves/:moveId/rooms` - Create new room
- `PUT /api/moves/:moveId/rooms/:id` - Update room
- `DELETE /api/moves/:moveId/rooms/:id` - Delete room

### Item Management

- `GET /api/moves/:moveId/items` - Get items for a move
- `POST /api/moves/:moveId/items` - Create new item
- `PUT /api/moves/:moveId/items/:id` - Update item
- `DELETE /api/moves/:moveId/items/:id` - Delete item

### Box Management

- `GET /api/moves/:moveId/boxes` - Get boxes for a move
- `POST /api/moves/:moveId/boxes` - Create new box
- `PUT /api/moves/:moveId/boxes/:id` - Update box
- `DELETE /api/moves/:moveId/boxes/:id` - Delete box

## Database Schema

The application uses PostgreSQL with the following main tables:

- `users` - User accounts and profiles
- `moves` - Move records with location data
- `tasks` - Task management with categories and priorities
- `rooms` - Room definitions for moves
- `items` - Inventory items with descriptions and values
- `boxes` - Box tracking with QR codes and contents

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Server port | 5000 |
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 5432 |
| `DB_NAME` | Database name | moveeasy_dev |
| `DB_USER` | Database username | postgres |
| `DB_PASSWORD` | Database password | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | Token expiration time | 7d |
| `CORS_ORIGIN` | Allowed frontend origin | http://localhost:3000 |

## Docker Support

The application includes Docker support for containerized deployment:

```bash
# Build the image
docker build -t moveeasy-backend .

# Run the container
docker run -p 5000:5000 --env-file .env moveeasy-backend
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
