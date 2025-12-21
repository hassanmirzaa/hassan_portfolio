# Deployment Guide

This guide will help you deploy your portfolio website to make it live. The recommended platform for Next.js applications is **Vercel**, as it's made by the creators of Next.js and offers seamless integration.

## 🚀 Quick Deployment with Vercel (Recommended)

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Sign up/Login to Vercel**
   - Go to [https://vercel.com](https://vercel.com)
   - Sign up or log in with your GitHub account

2. **Import Your Repository**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Choose `hassanmirzaa/hassan_portfolio` from the list
   - Click "Import"

3. **Configure Project Settings**
   - **Framework Preset:** Next.js (should be auto-detected)
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `npm run build` (should be auto-filled)
   - **Output Directory:** `.next` (should be auto-filled)
   - **Install Command:** `npm install --legacy-peer-deps` (important!)

4. **Environment Variables** (if needed)
   - If you have any environment variables (like API keys), add them here
   - For the contact form email API, you may need to add:
     - `EMAIL_SERVICE_API_KEY` (or similar, depending on your email service)

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (usually 2-3 minutes)
   - Your site will be live at a URL like: `https://hassan-portfolio.vercel.app`

6. **Custom Domain (Optional)**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow the DNS configuration instructions

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts
   - For production deployment, run: `vercel --prod`

## 🌐 Alternative Deployment Options

### Netlify

1. **Sign up/Login to Netlify**
   - Go to [https://netlify.com](https://netlify.com)
   - Sign up or log in with your GitHub account

2. **Import Your Repository**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Select `hassanmirzaa/hassan_portfolio`

3. **Configure Build Settings**
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - **Install command:** `npm install --legacy-peer-deps`

4. **Deploy**
   - Click "Deploy site"
   - Your site will be live at a URL like: `https://random-name.netlify.app`

### GitHub Pages (Not Recommended for Next.js)

GitHub Pages serves static files only, so you'd need to export your Next.js app as static HTML. This is not recommended as you'll lose many Next.js features.

## 📋 Pre-Deployment Checklist

Before deploying, make sure:

- [ ] All code is committed and pushed to GitHub
- [ ] The project builds successfully locally (`npm run build`)
- [ ] All images and assets are in the `public/` folder
- [ ] Environment variables are configured (if needed)
- [ ] Contact form API is configured (if using)
- [ ] No sensitive information is in the code

## 🔧 Build Configuration

The project is configured with:
- **Node.js version:** 18+ (Vercel auto-detects this)
- **Build command:** `npm run build`
- **Install command:** `npm install --legacy-peer-deps` (important for React 19 compatibility)

## 🐛 Troubleshooting Deployment

### Build Fails

1. **Check Node.js version**
   - Ensure you're using Node.js 18 or higher
   - Vercel/Netlify should auto-detect, but you can specify in settings

2. **Check build logs**
   - Review the deployment logs in your hosting platform
   - Look for specific error messages

3. **Test build locally**
   ```bash
   npm run build
   ```
   - If it fails locally, it will fail in deployment

### Images Not Loading

- Ensure all images are in the `public/` folder
- Use paths starting with `/` (e.g., `/tusai.png`)
- Check that file names match exactly (case-sensitive)

### Environment Variables

- Add any required environment variables in your hosting platform's dashboard
- Never commit `.env` files to GitHub
- Use the platform's environment variable settings

## 🔄 Continuous Deployment

Once connected to GitHub:
- Every push to the `main` branch will trigger a new deployment
- Pull requests can create preview deployments
- You can configure branch protection and deployment rules in your hosting platform

## 📝 Post-Deployment

After deployment:

1. **Test your live site**
   - Check all pages load correctly
   - Test the contact form (if applicable)
   - Verify images load properly
   - Test on mobile devices

2. **Set up custom domain** (optional)
   - Configure DNS settings
   - Add SSL certificate (usually automatic)

3. **Monitor performance**
   - Use Vercel Analytics or similar tools
   - Monitor build times and errors

## 🆘 Need Help?

- **Vercel Docs:** [https://vercel.com/docs](https://vercel.com/docs)
- **Netlify Docs:** [https://docs.netlify.com](https://docs.netlify.com)
- **Next.js Deployment:** [https://nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)

---

**Happy deploying! 🚀**

