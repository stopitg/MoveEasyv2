# Frontend Deployment Guide

This guide covers deploying the MoveEasy Frontend to various platforms.

## Prerequisites

- Node.js 18+ installed locally
- Git installed
- Backend API deployed and accessible
- Platform-specific accounts (Vercel, Netlify, AWS, etc.)

## Environment Variables

Before deploying, ensure you have the following environment variables configured:

```env
VITE_API_URL=https://your-backend-api-domain.com/api
```

## Vercel Deployment (Recommended)

Vercel provides excellent support for Vite applications with automatic deployments.

### 1. Prepare Repository

1. Push your frontend code to a GitHub repository
2. Ensure all dependencies are in `package.json`
3. Verify `vercel.json` configuration

### 2. Deploy to Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your frontend repository
5. Vercel will automatically detect it's a Vite project

### 3. Configure Environment Variables

1. Go to your project dashboard
2. Click on "Settings" → "Environment Variables"
3. Add `VITE_API_URL` with your backend API URL
4. Redeploy the project

### 4. Custom Domain (Optional)

1. Go to "Settings" → "Domains"
2. Add your custom domain
3. Configure DNS settings as instructed

## Netlify Deployment

### 1. Prepare Repository

1. Push your frontend code to a GitHub repository
2. Ensure all dependencies are in `package.json`

### 2. Deploy to Netlify

1. Go to [Netlify.com](https://netlify.com)
2. Sign in with GitHub
3. Click "New site from Git"
4. Select your frontend repository

### 3. Configure Build Settings

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** 18

### 4. Set Environment Variables

1. Go to "Site settings" → "Environment variables"
2. Add `VITE_API_URL` with your backend API URL
3. Redeploy the site

### 5. Configure Redirects

Create `public/_redirects` file:

```
/*    /index.html   200
```

## AWS S3 + CloudFront Deployment

### 1. Build Application

```bash
npm run build
```

### 2. Upload to S3

```bash
# Install AWS CLI
aws configure

# Create S3 bucket
aws s3 mb s3://your-bucket-name

# Upload files
aws s3 sync dist/ s3://your-bucket-name --delete
```

### 3. Configure S3 for Static Website

1. Go to S3 console
2. Select your bucket
3. Go to "Properties" → "Static website hosting"
4. Enable static website hosting
5. Set index document to `index.html`
6. Set error document to `index.html` (for SPA routing)

### 4. Set up CloudFront

1. Go to CloudFront console
2. Create distribution
3. Set origin to your S3 bucket
4. Configure custom error pages for SPA routing
5. Set up custom domain (optional)

## GitHub Pages Deployment

### 1. Install gh-pages

```bash
npm install --save-dev gh-pages
```

### 2. Update package.json

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://username.github.io/repository-name"
}
```

### 3. Deploy

```bash
npm run deploy
```

### 4. Configure GitHub Pages

1. Go to repository settings
2. Scroll to "Pages" section
3. Select "gh-pages" branch
4. Set source to "Deploy from a branch"

## Docker Deployment

### 1. Build Image

```bash
docker build -t moveeasy-frontend .
```

### 2. Run Container

```bash
docker run -p 80:80 \
  -e VITE_API_URL=https://your-api-domain.com/api \
  moveeasy-frontend
```

### 3. Docker Compose

```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=https://your-api-domain.com/api
```

## Environment-Specific Builds

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Build Optimization

### 1. Code Splitting

The application uses automatic code splitting via Vite:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          api: ['axios']
        }
      }
    }
  }
})
```

### 2. Asset Optimization

- Images are automatically optimized
- CSS is minified
- JavaScript is minified and tree-shaken
- Unused code is eliminated

### 3. Bundle Analysis

```bash
# Install bundle analyzer
npm install --save-dev rollup-plugin-visualizer

# Add to vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    // ... other plugins
    visualizer({
      filename: 'dist/stats.html',
      open: true
    })
  ]
})
```

## Performance Optimization

### 1. Lazy Loading

```typescript
// Lazy load components
const TaskManagement = lazy(() => import('./pages/TaskManagement'))
const InventoryManagement = lazy(() => import('./pages/InventoryManagement'))
```

### 2. Image Optimization

- Use WebP format when possible
- Implement lazy loading for images
- Use appropriate image sizes

### 3. Caching Strategy

- Set appropriate cache headers
- Use service workers for offline support
- Implement browser caching

## Security Considerations

### 1. Environment Variables

- Never commit `.env` files
- Use build-time environment variables
- Sanitize user inputs

### 2. Content Security Policy

Add CSP headers to prevent XSS attacks:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
```

### 3. HTTPS

- Always use HTTPS in production
- Redirect HTTP to HTTPS
- Use secure cookies

## Monitoring and Analytics

### 1. Error Tracking

Consider integrating error tracking:

```bash
npm install @sentry/react
```

### 2. Analytics

Add analytics tracking:

```bash
npm install @vercel/analytics
```

### 3. Performance Monitoring

Monitor Core Web Vitals and performance metrics.

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript compilation errors

2. **Environment Variables Not Working**
   - Ensure variables start with `VITE_`
   - Rebuild the application after adding variables
   - Check variable names are correct

3. **Routing Issues (404 on refresh)**
   - Configure server to serve `index.html` for all routes
   - Check redirect configuration
   - Verify SPA routing setup

4. **API Connection Issues**
   - Verify `VITE_API_URL` is correct
   - Check CORS configuration on backend
   - Ensure API is accessible from frontend domain

### Debug Commands

```bash
# Check build output
npm run build

# Preview production build
npm run preview

# Check environment variables
printenv | grep VITE_

# Analyze bundle size
npm run build && npx vite-bundle-analyzer dist
```

## Scaling Considerations

### 1. CDN Usage

- Use CDN for static assets
- Implement edge caching
- Optimize asset delivery

### 2. Performance Monitoring

- Monitor Core Web Vitals
- Track user experience metrics
- Set up performance alerts

### 3. Caching Strategy

- Implement proper caching headers
- Use service workers for offline support
- Cache API responses appropriately

## Backup and Recovery

### 1. Code Backup

- Version control (Git)
- Regular backups of repository
- Tag releases for easy rollback

### 2. Configuration Backup

- Backup environment variables
- Document deployment process
- Keep deployment scripts in version control

This deployment guide should help you successfully deploy the MoveEasy Frontend to your chosen platform.
