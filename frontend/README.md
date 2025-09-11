# MoveEasy Frontend

A React-based frontend application for the MoveEasy long-distance move planner.

## Features

- User authentication and registration
- Move management dashboard
- Task management with drag-and-drop
- Inventory tracking with room organization
- Box management with QR code generation
- Responsive design for desktop and mobile

## Tech Stack

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **State Management:** React Context API

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- MoveEasy Backend API running (see backend repository)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd moveeasy-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | http://localhost:5000/api |

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React Context providers
├── pages/             # Page components
├── services/          # API service layer
├── types/             # TypeScript type definitions
├── assets/            # Static assets
└── main.tsx           # Application entry point
```

## Key Components

### Authentication
- `AuthContext` - Global authentication state management
- `ProtectedRoute` - Route protection component
- `Login` - User login page
- `Register` - User registration page

### Move Management
- `Dashboard` - Main dashboard with move overview
- `MoveForm` - Create/edit move form
- `MoveCard` - Individual move display

### Task Management
- `TaskManagement` - Task list and management
- `TaskForm` - Create/edit task form
- `TaskCard` - Individual task display

### Inventory Management
- `InventoryManagement` - Room and item management
- `RoomForm` - Create/edit room form
- `ItemForm` - Create/edit item form
- `BoxManagement` - Box tracking and QR codes

## API Integration

The frontend communicates with the backend through the `ApiService` class located in `src/services/api.ts`. This service handles:

- HTTP request/response interceptors
- Automatic token attachment
- Error handling and token refresh
- Type-safe API methods

## Styling

The application uses Tailwind CSS for styling with a custom design system. Key design principles:

- Mobile-first responsive design
- Consistent color palette
- Accessible components
- Clean, modern interface

## Docker Support

The application includes Docker support for containerized deployment:

```bash
# Build the image
docker build -t moveeasy-frontend .

# Run the container
docker run -p 3000:80 moveeasy-frontend
```

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Set environment variables in Netlify dashboard

### Manual Deployment

1. Build the application: `npm run build`
2. Upload the `dist` folder to your web server
3. Configure your web server to serve the SPA

## Development

### Code Style

The project uses ESLint for code linting. Run `npm run lint` to check for issues.

### TypeScript

The project is fully typed with TypeScript. Type definitions are located in `src/types/`.

### State Management

The application uses React Context API for state management. Key contexts:

- `AuthContext` - User authentication state
- Additional contexts can be added as needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.