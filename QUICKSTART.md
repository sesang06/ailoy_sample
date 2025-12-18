# Quick Start Guide

## Deploy to GitHub Pages in 3 Steps

### 1️⃣ Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git branch -M main
git remote add origin https://github.com/sesang06/sesang06.github.io.git
git push -u origin main
```

### 2️⃣ Enable GitHub Pages

1. Go to: https://github.com/sesang06/sesang06.github.io/settings/pages
2. Under "Build and deployment":
   - Source: **Deploy from a branch**
   - Branch: **gh-pages** / **/ (root)**
3. Save

### 3️⃣ Deploy

```bash
npm run deploy
```

Wait 1-5 minutes, then visit: **https://sesang06.github.io**

---

## Future Updates

Every time you make changes:

```bash
git add .
git commit -m "Your message"
git push

npm run deploy
```

---

## Local Development

```bash
npm run dev
```

Visit: http://localhost:5173

---

## Need Help?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions and troubleshooting.

