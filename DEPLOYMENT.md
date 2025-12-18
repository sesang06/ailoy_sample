# Deployment Guide

## GitHub Pages Deployment

This project is configured to deploy to GitHub Pages at `sesang06.github.io`.

### Prerequisites

1. Repository name should be: `sesang06.github.io`
2. GitHub Pages must be enabled in repository settings

### Setup Steps

1. **Enable GitHub Pages in Repository Settings**
   - Go to your repository on GitHub
   - Navigate to `Settings` > `Pages`
   - Under "Build and deployment":
     - Source: Select `GitHub Actions`

2. **Push to Main Branch**
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/sesang06/sesang06.github.io.git
   git push -u origin main
   ```

3. **Automatic Deployment**
   - The GitHub Actions workflow will automatically trigger
   - Check the progress in the `Actions` tab of your repository
   - Once completed, your site will be live at: `https://sesang06.github.io`

### Manual Deployment

If you want to trigger deployment manually:
1. Go to the `Actions` tab in your repository
2. Select the "Deploy to GitHub Pages" workflow
3. Click "Run workflow"

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Project Structure

- `/src` - Source code
- `/public` - Static assets (including `.nojekyll`)
- `/dist` - Build output (created by `npm run build`)
- `/.github/workflows` - GitHub Actions configuration

### Important Notes

- The site uses Ailoy-web for local LLM processing
- First load may take time as models are downloaded
- Models are cached in browser storage
- Supports BAAI/bge-m3 embedding model for RAG
- Uses Qwen/Qwen3-0.6B language model

### Troubleshooting

**Deployment fails:**
- Check that GitHub Pages is set to use "GitHub Actions" as the source
- Verify all dependencies are in `package.json`
- Check the Actions log for specific errors

**Site shows 404:**
- Wait a few minutes after deployment completes
- Clear browser cache
- Check that the workflow completed successfully

**Models not loading:**
- Check browser console for errors
- Ensure your browser supports WebAssembly
- Check network tab for model download progress

