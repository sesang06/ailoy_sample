# Deployment Guide

## GitHub Pages Deployment using gh-pages

This project is configured to deploy to GitHub Pages at `sesang06.github.io` using the `gh-pages` package.

### Prerequisites

1. Repository name should be: `sesang06.github.io`
2. Node.js and npm installed
3. Git repository initialized

### Setup Steps

1. **Initialize Git Repository (if not already done)**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: LLM File Summarization UI with RAG"
   ```

2. **Create GitHub Repository**
   - Go to GitHub and create a new repository named `sesang06.github.io`
   - **DO NOT** initialize with README, .gitignore, or license

3. **Connect and Push to GitHub**
   ```bash
   git branch -M main
   git remote add origin https://github.com/sesang06/sesang06.github.io.git
   git push -u origin main
   ```

4. **Deploy to GitHub Pages**
   ```bash
   npm run deploy
   ```

   This command will:
   - Build the project (`npm run build`)
   - Push the `dist` folder to the `gh-pages` branch
   - Automatically publish to `https://sesang06.github.io`

5. **Configure GitHub Pages (First Time Only)**
   - Go to your repository on GitHub
   - Navigate to `Settings` > `Pages`
   - Under "Build and deployment":
     - Source: Select `Deploy from a branch`
     - Branch: Select `gh-pages` and `/ (root)`
   - Click Save

6. **Wait for Deployment**
   - It may take a few minutes for the site to be live
   - Check `https://sesang06.github.io`

### Updating Your Site

Whenever you make changes:

```bash
# Make your changes
git add .
git commit -m "Your commit message"
git push origin main

# Deploy updated version
npm run deploy
```

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production (to test build locally)
npm run build

# Preview production build locally
npm run preview
```

### Project Structure

- `/src` - Source code
- `/public` - Static assets (including `.nojekyll`)
- `/dist` - Build output (created by `npm run build`, not committed to git)
- `/node_modules` - Dependencies (not committed to git)

### Important Notes

#### LLM Models
- The site uses Ailoy-web for local LLM processing
- First load may take time as models are downloaded
- Models are cached in browser storage
- **Embedding Model**: BAAI/bge-m3 (for RAG/vector search)
- **Language Model**: Qwen/Qwen3-0.6B

#### Browser Requirements
- Modern browser with WebAssembly support
- Sufficient storage for model caching
- Good internet connection for first-time model download

#### Performance
- Initial model download: ~500MB-1GB
- Subsequent loads: Uses cached models (much faster)
- RAG processing: Vector search for relevant document chunks

### Troubleshooting

**Deployment fails:**
```bash
# Clear gh-pages cache
rm -rf node_modules/.cache/gh-pages

# Try deploying again
npm run deploy
```

**Permission denied:**
- Make sure you're logged into GitHub
- Check that you have push access to the repository

**Site shows 404:**
- Wait 1-5 minutes after deployment
- Clear browser cache
- Verify GitHub Pages is enabled in repository settings
- Check that `gh-pages` branch exists

**Models not loading:**
- Check browser console for errors
- Ensure your browser supports WebAssembly
- Check network tab for model download progress
- Try clearing browser cache and localStorage

**Build errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Try building again
npm run build
```

### Scripts Reference

- `npm run dev` - Start development server (localhost:5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run deploy` - Build and deploy to GitHub Pages

### Additional Configuration

If you want to deploy to a different repository (e.g., `username/repo-name`):

1. Update `vite.config.ts`:
   ```typescript
   base: '/repo-name/', // Change to your repository name
   ```

2. Deploy normally:
   ```bash
   npm run deploy
   ```

### Branches

- `main` - Source code
- `gh-pages` - Deployed site (automatically managed by gh-pages package)

**Do not manually edit the `gh-pages` branch** - it's automatically managed by the deployment script.
