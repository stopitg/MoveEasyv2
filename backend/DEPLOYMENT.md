# Backend Deployment Guide

This guide covers deploying the MoveEasy Backend API to various platforms.

## Prerequisites

- Node.js 18+ installed locally
- Git installed
- Database (PostgreSQL) access
- Platform-specific accounts (Railway, Heroku, AWS, etc.)

## Environment Variables

Before deploying, ensure you have the following environment variables configured:

```env
NODE_ENV=production
PORT=5000
DB_HOST=your_database_host
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
JWT_SECRET=your_secure_jwt_secret_minimum_32_characters
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-frontend-domain.com
```

## Railway Deployment (Recommended)

Railway provides easy deployment with built-in PostgreSQL support.

### 1. Prepare Repository

1. Push your backend code to a GitHub repository
2. Ensure all dependencies are in `package.json`
3. Verify `railway.json` configuration

### 2. Deploy to Railway

1. Go to [Railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your backend repository
5. Railway will automatically detect it's a Node.js project

### 3. Configure Environment Variables

1. Go to your project dashboard
2. Click on the backend service
3. Go to "Variables" tab
4. Add all required environment variables

### 4. Set up Database

1. In Railway dashboard, click "New" → "Database" → "PostgreSQL"
2. Railway will automatically set `DATABASE_URL` environment variable
3. Update your backend to use `DATABASE_URL` if available

### 5. Run Migrations

1. Go to "Deployments" tab
2. Click on the latest deployment
3. Go to "Logs" tab
4. Run migrations: `npx knex migrate:latest`

## Heroku Deployment

### 1. Install Heroku CLI

```bash
# macOS
brew install heroku/brew/heroku

# Windows
# Download from https://devcenter.heroku.com/articles/heroku-cli
```

### 2. Login and Create App

```bash
heroku login
heroku create your-app-name-backend
```

### 3. Add PostgreSQL Addon

```bash
heroku addons:create heroku-postgresql:hobby-dev
```

### 4. Set Environment Variables

```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secure_jwt_secret
heroku config:set CORS_ORIGIN=https://your-frontend-domain.com
```

### 5. Deploy

```bash
git push heroku main
```

### 6. Run Migrations

```bash
heroku run npx knex migrate:latest
```

## AWS Elastic Beanstalk

### 1. Install EB CLI

```bash
pip install awsebcli
```

### 2. Initialize EB Application

```bash
eb init
eb create production
```

### 3. Configure Environment Variables

```bash
eb setenv NODE_ENV=production
eb setenv JWT_SECRET=your_secure_jwt_secret
eb setenv CORS_ORIGIN=https://your-frontend-domain.com
```

### 4. Deploy

```bash
eb deploy
```

## Docker Deployment

### 1. Build Image

```bash
docker build -t moveeasy-backend .
```

### 2. Run Container

```bash
docker run -p 5000:5000 \
  -e NODE_ENV=production \
  -e DB_HOST=your_db_host \
  -e DB_PASSWORD=your_password \
  -e JWT_SECRET=your_secret \
  moveeasy-backend
```

### 3. Docker Compose

```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/moveeasy
      - JWT_SECRET=your_secret
    depends_on:
      - db
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: moveeasy
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Database Setup

### 1. Create Database

```sql
CREATE DATABASE moveeasy_production;
CREATE USER moveeasy_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE moveeasy_production TO moveeasy_user;
```

### 2. Run Migrations

```bash
NODE_ENV=production npx knex migrate:latest
```

### 3. Seed Data (Optional)

```bash
NODE_ENV=production npx knex seed:run
```

## Health Checks

The API includes a health check endpoint at `/health` that returns:

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

## Monitoring

### 1. Application Logs

Monitor application logs for errors and performance:

```bash
# Railway
railway logs

# Heroku
heroku logs --tail

# Docker
docker logs container_name
```

### 2. Database Monitoring

- Monitor database connections
- Check query performance
- Set up alerts for high CPU/memory usage

### 3. Error Tracking

Consider integrating error tracking services:
- Sentry
- Bugsnag
- Rollbar

## Security Checklist

- [ ] Environment variables are secure
- [ ] JWT secret is strong and unique
- [ ] CORS is properly configured
- [ ] Database credentials are secure
- [ ] HTTPS is enabled
- [ ] Security headers are set (Helmet)
- [ ] Input validation is enabled
- [ ] Rate limiting is configured (if needed)

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check database credentials
   - Verify database is accessible
   - Check network connectivity

2. **JWT Token Issues**
   - Verify JWT_SECRET is set
   - Check token expiration settings
   - Ensure CORS is configured correctly

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript compilation errors

### Debug Commands

```bash
# Check environment variables
printenv | grep -E "(NODE_ENV|DB_|JWT_|CORS_)"

# Test database connection
npx knex migrate:status

# Check application health
curl https://your-api-domain.com/health
```

## Scaling Considerations

### Horizontal Scaling

- Use load balancers
- Implement session storage (Redis)
- Database connection pooling
- CDN for static assets

### Vertical Scaling

- Increase server resources
- Optimize database queries
- Implement caching strategies
- Monitor performance metrics

## Backup Strategy

### Database Backups

1. **Automated Backups**
   - Set up daily automated backups
   - Test backup restoration process
   - Store backups in multiple locations

2. **Manual Backups**

```bash
# Create backup
pg_dump -h host -U user -d database > backup.sql

# Restore backup
psql -h host -U user -d database < backup.sql
```

### Application Backups

- Version control (Git)
- Configuration backups
- Environment variable backups
- SSL certificate backups

This deployment guide should help you successfully deploy the MoveEasy Backend API to your chosen platform.
