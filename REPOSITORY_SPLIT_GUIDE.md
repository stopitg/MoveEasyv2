# Repository Split Guide

This guide explains how to split the MoveEasy monorepo into separate backend and frontend repositories for independent hosting and deployment.

## Overview

The MoveEasy project has been restructured to support separate GitHub repositories:

- **Backend Repository**: `moveeasy-backend` - Node.js/Express API
- **Frontend Repository**: `moveeasy-frontend` - React/Vite application

## What Was Done

### 1. Backend Repository Structure

The `backend/` directory has been prepared as a standalone repository with:

- ✅ Complete `package.json` with all dependencies
- ✅ Environment configuration (`env.example`)
- ✅ Docker configuration (`Dockerfile`, `docker-compose.yml`)
- ✅ Deployment configurations (`railway.json`)
- ✅ Comprehensive documentation (`README.md`, `DEPLOYMENT.md`)
- ✅ Architecture documentation (`docs/architecture.md`)
- ✅ Proper `.gitignore` for Node.js projects

### 2. Frontend Repository Structure

The `frontend/` directory has been prepared as a standalone repository with:

- ✅ Complete `package.json` with all dependencies
- ✅ Environment configuration (`env.example`)
- ✅ Docker configuration (`Dockerfile`, `docker-compose.yml`)
- ✅ Deployment configurations (`vercel.json`)
- ✅ Comprehensive documentation (`README.md`, `DEPLOYMENT.md`)
- ✅ Architecture documentation (`docs/architecture.md`)
- ✅ Proper `.gitignore` for React projects
- ✅ Updated Vite configuration with API proxy

### 3. Configuration Updates

- ✅ Backend package.json includes all necessary dependencies
- ✅ Frontend Vite config includes API proxy for development
- ✅ Environment variables properly configured for both repos
- ✅ Docker configurations updated for independent deployment
- ✅ CORS settings configured for cross-origin requests

## Next Steps

### 1. Create Separate Repositories

#### Backend Repository

1. Create a new GitHub repository named `moveeasy-backend`
2. Copy the contents of the `backend/` directory to the new repository
3. Initialize git and push:

```bash
cd backend
git init
git add .
git commit -m "Initial backend repository setup"
git branch -M main
git remote add origin https://github.com/yourusername/moveeasy-backend.git
git push -u origin main
```

#### Frontend Repository

1. Create a new GitHub repository named `moveeasy-frontend`
2. Copy the contents of the `frontend/` directory to the new repository
3. Initialize git and push:

```bash
cd frontend
git init
git add .
git commit -m "Initial frontend repository setup"
git branch -M main
git remote add origin https://github.com/yourusername/moveeasy-frontend.git
git push -u origin main
```

### 2. Deploy Backend

1. Deploy the backend to your chosen platform (Railway, Heroku, AWS, etc.)
2. Set up the database (PostgreSQL)
3. Configure environment variables
4. Run database migrations
5. Note the deployed API URL

### 3. Deploy Frontend

1. Deploy the frontend to your chosen platform (Vercel, Netlify, AWS, etc.)
2. Set the `VITE_API_URL` environment variable to your deployed backend URL
3. Redeploy the frontend

### 4. Update CORS Settings

Update the backend's `CORS_ORIGIN` environment variable to match your deployed frontend URL.

## Development Workflow

### Local Development

1. **Backend Development**:
   ```bash
   cd moveeasy-backend
   npm install
   npm run dev
   ```

2. **Frontend Development**:
   ```bash
   cd moveeasy-frontend
   npm install
   npm run dev
   ```

### Environment Variables

#### Backend (.env)
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

#### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5000/api
```

## File Structure After Split

### Backend Repository
```
moveeasy-backend/
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── types/
│   └── migrations/
├── docs/
│   └── architecture.md
├── package.json
├── tsconfig.json
├── knexfile.js
├── Dockerfile
├── docker-compose.yml
├── railway.json
├── env.example
├── .gitignore
├── README.md
└── DEPLOYMENT.md
```

### Frontend Repository
```
moveeasy-frontend/
├── src/
│   ├── components/
│   ├── contexts/
│   ├── pages/
│   ├── services/
│   ├── types/
│   └── assets/
├── docs/
│   └── architecture.md
├── public/
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── Dockerfile
├── docker-compose.yml
├── vercel.json
├── env.example
├── .gitignore
├── README.md
└── DEPLOYMENT.md
```

## Benefits of Separation

### 1. Independent Deployment
- Deploy backend and frontend separately
- Different deployment schedules
- Independent scaling

### 2. Team Collaboration
- Different teams can work on frontend and backend
- Separate issue tracking
- Independent version control

### 3. Technology Flexibility
- Can use different hosting platforms
- Independent technology updates
- Separate CI/CD pipelines

### 4. Security
- Backend can be more restricted
- Frontend can be publicly accessible
- Separate access controls

## Migration Checklist

- [ ] Create backend repository on GitHub
- [ ] Create frontend repository on GitHub
- [ ] Copy backend files to new repository
- [ ] Copy frontend files to new repository
- [ ] Deploy backend to hosting platform
- [ ] Deploy frontend to hosting platform
- [ ] Configure environment variables
- [ ] Test both applications
- [ ] Update documentation links
- [ ] Archive or delete original monorepo

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `CORS_ORIGIN` is set to your frontend URL
   - Check that the frontend URL is correct

2. **API Connection Issues**
   - Verify `VITE_API_URL` is set correctly
   - Check that the backend is accessible
   - Ensure the API endpoint is correct

3. **Environment Variables**
   - Make sure all required variables are set
   - Check variable names and values
   - Restart applications after changing variables

### Support

For issues with the repository split:

1. Check the individual README files in each repository
2. Review the deployment guides
3. Check the architecture documentation
4. Verify environment variable configuration

## Conclusion

The MoveEasy project has been successfully prepared for repository separation. Each repository is now self-contained with proper documentation, configuration, and deployment instructions. Follow the steps above to complete the migration to separate repositories.
