# Rajdeep Mukherjee - Portfolio Setup Guide

This is your customized portfolio based on Giulio Collesei's award-winning design, adapted with your AI research projects and information.

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **pnpm** - Fast package manager (will be installed automatically)

### Installation Steps

1. **Navigate to the portfolio directory**
   ```bash
   cd rajdeep-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install -g pnpm  # Install pnpm globally (if not already installed)
   pnpm install          # Install all project dependencies
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   ```

4. **Open in browser**
   - The site will be available at `http://localhost:5173`
   - Hot reload is enabled - changes will appear automatically

## 📦 Build for Production

To create an optimized production build:

```bash
pnpm build
```

The built files will be in the `dist/` directory, ready to deploy to any static hosting service (Netlify, Vercel, GitHub Pages, etc.).

## 🎨 Customization Guide

### Your Content is Already Set Up!

I've customized the following with your information:

✅ **Projects** (`src/store/models/projects.ts`)
- Aero-LLM
- AWS Agentic System
- Accessibility-Aware Agents
- Multimodal Web Agents
- EC-TSS

✅ **Project Details** (`public/locales/en/*.json`)
- Each project has a dedicated JSON file with full descriptions
- Includes your role, agency, completion date, challenge/solution/impact

✅ **About Section** (`public/locales/en/translation.json`)
- Updated with your education (UMich, Oakland University)
- Your research focus and achievements
- AWS experience and publications

✅ **Metadata** (`index.html`)
- SEO tags updated with your name and keywords
- Social media preview cards

### Further Customization

#### Add/Edit Projects
1. Edit `src/store/models/projects.ts` - add to the projects array
2. Create a new JSON file in `public/locales/en/[project-name].json`
3. Follow the existing format for consistency

#### Change Colors
- Primary color: `src/styles/config/colors.css`
- Currently set to `#ff2f00` (Giulio's orange-red)
- You can change to blue for AI theme: `#0000FF` or `#007AFF`

#### Update Images/Videos
- Replace images in `public/images/`
- Add your profile photo
- Update project screenshots/videos

#### Modify Text Content
All text is in `public/locales/en/translation.json`:
- Intro text
- Portfolio descriptions
- About section
- Contact info

## 🎯 Key Features

### What You're Getting (from Giulio's Site)
- ✨ Award-winning 3D WebGL animations (Three.js)
- 🎨 Custom shader effects
- 🎵 Audio system with hover sounds
- 📱 Fully responsive design
- ⚡ Smooth GSAP animations
- 🎭 Custom cursor
- 🌐 Internationalization ready (i18n)
- 🔄 Smooth page transitions
- 📊 Project showcase with detailed views

### Technology Stack
- **Framework**: React 18 + TypeScript
- **3D Graphics**: Three.js with custom shaders
- **Animation**: GSAP (GreenSock)
- **State**: Redux (Rematch)
- **Build**: Vite
- **Styling**: PostCSS with custom utilities
- **Audio**: Howler.js

## 📝 Important Notes

### Before Deploying

1. **Add Your Contact Info**
   - Update email/social links in `public/locales/en/translation.json`
   - Contact section at the bottom

2. **Add Project Images/Videos**
   - The current setup references video IDs that don't exist
   - Add your project images to `public/images/`
   - Update the videoID references or remove video features

3. **Test All Pages**
   - Navigate through all projects
   - Check responsive design on mobile
   - Test all interactive elements

4. **Remove Unused Files**
   - Delete old project JSON files (sketchin.json, aquest.json, etc.)
   - Clean up unused images

### Deployment Options

**Netlify** (Recommended)
```bash
# Build command
pnpm build

# Publish directory
dist
```

**Vercel**
```bash
# Automatically detects Vite
# Just connect your GitHub repo
```

**GitHub Pages**
```bash
# Add to package.json scripts:
"deploy": "pnpm build && gh-pages -d dist"
```

## 🆘 Troubleshooting

### Port Already in Use
```bash
# The dev server uses port 5173 by default
# If it's taken, it will auto-increment to 5174, 5175, etc.
```

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### TypeScript Errors
```bash
# The project uses strict TypeScript
# Most errors are in custom types - check src/global.d.ts
```

## 📚 Project Structure

```
rajdeep-portfolio/
├── public/
│   ├── locales/en/          # All text content (JSON)
│   ├── images/              # Project images
│   ├── audio/               # Sound effects
│   └── draco/               # 3D model compression
├── src/
│   ├── components/
│   │   ├── Experience/      # Three.js/WebGL components
│   │   ├── ProjectHero/     # Project detail pages
│   │   └── ...
│   ├── store/
│   │   └── models/          # Redux state (projects.ts)
│   ├── styles/              # Global CSS
│   └── main.tsx             # App entry point
├── index.html               # HTML template (metadata updated)
└── package.json             # Dependencies (renamed to rajdeep-portfolio)
```

## 🎓 Next Steps

1. **Run the dev server**: `pnpm dev`
2. **Preview your site**: Open `http://localhost:5173`
3. **Add your images**: Replace placeholder images
4. **Customize colors**: Update `src/styles/config/colors.css`
5. **Build for production**: `pnpm build`
6. **Deploy**: Choose Netlify, Vercel, or GitHub Pages

## 💡 Tips

- The site uses **custom cursor** - test on desktop
- **3D animations** are GPU-intensive - test performance
- **Audio** requires user interaction to start (browser policy)
- **Scroll animations** work best on desktop/tablet

---

## 🎉 You're All Set!

Your portfolio is ready to go! The full Giulio experience with YOUR content and projects.

For questions or issues, check the original repo: https://github.com/Giulico/folio-2022
