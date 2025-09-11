# MoveEasy - Long-Distance Move Planner

A comprehensive SaaS platform for planning and managing long-distance moves, featuring task management, inventory tracking, and vendor coordination.

## 🚀 Repository Split

This monorepo has been prepared for splitting into separate repositories:

- **Backend Repository**: `moveeasy-backend` - Node.js/Express API
- **Frontend Repository**: `moveeasy-frontend` - React/Vite application

## 📁 Project Structure

```
MoveEasyv2/
├── backend/                 # Backend API (Node.js/Express/TypeScript)
│   ├── src/                # Source code
│   ├── docs/               # Documentation
│   ├── package.json        # Dependencies
│   ├── Dockerfile          # Container config
│   ├── docker-compose.yml  # Local development
│   ├── railway.json        # Railway deployment
│   └── README.md           # Backend documentation
├── frontend/               # Frontend App (React/TypeScript/Vite)
│   ├── src/                # Source code
│   ├── docs/               # Documentation
│   ├── package.json        # Dependencies
│   ├── Dockerfile          # Container config
│   ├── docker-compose.yml  # Local development
│   ├── vercel.json         # Vercel deployment
│   └── README.md           # Frontend documentation
├── memory-bank/            # Project documentation
├── docker-compose.yml      # Full-stack local development
└── REPOSITORY_SPLIT_GUIDE.md # Split instructions
```

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Knex.js ORM
- **Authentication**: JWT with bcrypt
- **Security**: Helmet, CORS

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL
- Git

### Local Development (Monorepo)

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd MoveEasyv2
   ```

2. **Start all services**:
   ```bash
   docker-compose up
   ```

   This will start:
   - PostgreSQL database on port 5432
   - Backend API on port 5000
   - Frontend app on port 3000

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Health: http://localhost:5000/health

### Individual Service Development

#### Backend Only
```bash
cd backend
npm install
npm run dev
```

#### Frontend Only
```bash
cd frontend
npm install
npm run dev
```

## 📚 Documentation

- [Repository Split Guide](REPOSITORY_SPLIT_GUIDE.md) - How to split into separate repos
- [Backend Documentation](backend/README.md) - API documentation
- [Frontend Documentation](frontend/README.md) - Frontend documentation
- [Backend Deployment](backend/DEPLOYMENT.md) - Backend deployment guide
- [Frontend Deployment](frontend/DEPLOYMENT.md) - Frontend deployment guide

## 🔧 Features

### Core Features
- ✅ User authentication and registration
- ✅ Move management and tracking
- ✅ Task management with templates
- ✅ Room-based inventory organization
- ✅ Box tracking with QR codes
- ✅ Responsive design for all devices

### Technical Features
- ✅ TypeScript for type safety
- ✅ RESTful API design
- ✅ JWT authentication
- ✅ Database migrations
- ✅ Docker containerization
- ✅ Comprehensive documentation

## 🚀 Deployment

### Backend Deployment
- **Railway** (Recommended)
- **Heroku**
- **AWS Elastic Beanstalk**
- **Docker**

### Frontend Deployment
- **Vercel** (Recommended)
- **Netlify**
- **AWS S3 + CloudFront**
- **GitHub Pages**

## 🔒 Environment Variables

### Backend
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

### Frontend
```env
VITE_API_URL=http://localhost:5000/api
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For questions or issues:

1. Check the documentation in each repository
2. Review the deployment guides
3. Check the architecture documentation
4. Open an issue in the appropriate repository

## 🔄 Next Steps

1. **Split into separate repositories** following the [Repository Split Guide](REPOSITORY_SPLIT_GUIDE.md)
2. **Deploy backend** to your chosen platform
3. **Deploy frontend** to your chosen platform
4. **Configure environment variables** for production
5. **Test the complete application** end-to-end

---

**Note**: This monorepo is designed for easy splitting into separate repositories. Each directory (`backend/` and `frontend/`) contains everything needed to run independently.
