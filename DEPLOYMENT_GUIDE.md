# ÉquiSettle Documentation Deployment Guide

## 🚀 Overview

This guide covers how to deploy the ÉquiSettle technical documentation site to Vercel with password protection.

## 📋 Prerequisites

- GitHub account with repository access
- Vercel account (free tier is sufficient)
- Node.js 18+ for local development

## 🔧 Setup Instructions

### 1. Repository Setup

1. **Create GitHub Repository**
   ```bash
   # Initialize git repository
   cd equisettle-docs
   git init
   git add .
   git commit -m "Initial documentation setup"

   # Add remote and push
   git branch -M main
   git remote add origin https://github.com/your-org/equisettle-docs.git
   git push -u origin main
   ```

### 2. Vercel Deployment Setup

#### Step 1: Connect to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your `equisettle-docs` repository
4. Configure project settings:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

#### Step 2: Environment Variables
In Vercel project settings, add these environment variables:

```bash
# Required
REACT_APP_DOCS_PASSWORD=your-secure-password-here

# Optional (for custom branding)
REACT_APP_SITE_TITLE=ÉquiSettle Documentation
REACT_APP_COMPANY_NAME=Twosvn Agency
```

#### Step 3: Deploy
1. Click "Deploy" - Vercel will automatically build and deploy
2. Your documentation will be available at: `https://your-project-name.vercel.app`

### 3. GitHub Actions Setup (Optional)

For automated deployments, configure these secrets in your GitHub repository:

**Settings → Secrets and Variables → Actions:**

```bash
DOCS_PASSWORD=your-secure-password-here
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-vercel-org-id
VERCEL_PROJECT_ID=your-vercel-project-id
```

**To get Vercel credentials:**
1. **Vercel Token**: Go to [Vercel Account Settings](https://vercel.com/account/tokens) → Create Token
2. **Org ID & Project ID**: Run `vercel link` in your project directory

## 🔐 Security Configuration

### Password Protection
The documentation includes custom password protection that:
- Protects all content behind a login screen
- Uses session storage for authentication persistence
- Includes logout functionality
- Provides responsive design for mobile access

### Security Headers
The `vercel.json` configuration includes security headers:
- `X-Frame-Options: DENY` - Prevents embedding in frames
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer information
- `Permissions-Policy` - Restricts browser APIs

### Access Control
- Password is required for any documentation access
- Sessions expire when browser is closed
- No persistent authentication tokens
- Manual logout available

## 🌐 Custom Domain (Optional)

### Step 1: Domain Configuration
1. In Vercel project settings, go to "Domains"
2. Add your custom domain (e.g., `docs.equisettle.com`)
3. Configure DNS settings as instructed

### Step 2: SSL Certificate
Vercel automatically provides SSL certificates for custom domains.

### Step 3: Redirects (Optional)
Add to `vercel.json` for custom redirects:
```json
{
  "redirects": [
    {
      "source": "/",
      "destination": "/docs/backend/overview",
      "permanent": false
    }
  ]
}
```

## 📊 Monitoring & Analytics

### Vercel Analytics
Enable in Vercel dashboard:
1. Go to project settings
2. Navigate to "Analytics" tab
3. Enable Web Analytics

### Performance Monitoring
Vercel provides built-in performance monitoring:
- Core Web Vitals tracking
- Real User Monitoring (RUM)
- Function execution logs

## 🔄 Updates & Maintenance

### Content Updates
1. **Direct Updates**: Edit files in `/docs/` directory
2. **Commit Changes**: `git add . && git commit -m "Update documentation"`
3. **Deploy**: `git push origin main` (triggers automatic deployment)

### Password Changes
1. Update `REACT_APP_DOCS_PASSWORD` in Vercel environment variables
2. Redeploy the application
3. Inform team members of the new password

### Version Management
- Use semantic versioning for major documentation updates
- Tag releases for tracking: `git tag v1.0.0 && git push --tags`
- Consider creating releases on GitHub for change tracking

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check Node.js version
node --version  # Should be 18+

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Password Not Working
1. Verify environment variable is set in Vercel
2. Check for typos in variable name
3. Redeploy to apply environment changes

#### 404 Errors
1. Verify `vercel.json` routing configuration
2. Check that all referenced pages exist in `/docs/`
3. Ensure proper sidebar configuration in `sidebars.ts`

#### Slow Loading
1. Check image optimization
2. Review bundle size with `npm run build`
3. Enable Vercel compression features

### Debug Mode
Enable debug logging:
```bash
# Local development
DEBUG=docusaurus:* npm start

# Production build analysis
npm run build -- --analyze
```

### Support Contacts
- **Vercel Issues**: [Vercel Support](https://vercel.com/support)
- **Technical Issues**: Contact development team
- **Content Issues**: Submit GitHub issues

## 🎯 Best Practices

### Content Management
- Use consistent markdown formatting
- Include proper frontmatter on all pages
- Cross-reference related documentation
- Keep navigation structure intuitive

### Security
- Use strong passwords (12+ characters, mixed case, numbers, symbols)
- Regularly update passwords
- Monitor access logs in Vercel dashboard
- Keep dependencies updated

### Performance
- Optimize images before adding to documentation
- Use lazy loading for large content sections
- Monitor Core Web Vitals
- Minimize external dependencies

### Maintenance Schedule
- **Weekly**: Review access logs and performance metrics
- **Monthly**: Update dependencies and security patches
- **Quarterly**: Review and update documentation content
- **Annually**: Password rotation and security audit

---

## 📞 Quick Reference

### Important URLs
- **Live Documentation**: `https://equisettle-docs.vercel.app`
- **Vercel Dashboard**: `https://vercel.com/dashboard`
- **GitHub Repository**: `https://github.com/your-org/equisettle-docs`

### Environment Variables
```bash
REACT_APP_DOCS_PASSWORD=your-password
REACT_APP_SITE_TITLE=ÉquiSettle Documentation
REACT_APP_COMPANY_NAME=Twosvn Agency
```

### Deployment Commands
```bash
# Local development
npm start

# Production build
npm run build

# Deploy via Git
git push origin main
```

---

**© 2024 ÉquiSettle by Twosvn Agency. All rights reserved.**