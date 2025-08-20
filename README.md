# Taekwondonomics Website

A modern React-based website for Taekwondonomics, Asia's premier taekwondo training school in Singapore.

## Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Carousel**: Hero section with auto-rotating slides
- **Modern Components**: Clean, professional UI components
- **SEO Optimized**: Proper meta tags and semantic HTML
- **Performance Optimized**: Static export for fast loading

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Cloudflare Pages (static export)
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd akiraxtkd.com
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Cloudflare Pages

### Method 1: Git Integration (Recommended)

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Log in to [Cloudflare Pages](https://pages.cloudflare.com/)
3. Click "Create a project" and connect your Git repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Root directory**: `/` (or leave empty)
5. Click "Save and Deploy"

### Method 2: Direct Upload

1. Build the project locally:
```bash
npm run build
```

2. Upload the `out` folder to Cloudflare Pages dashboard

### Environment Variables

No environment variables are required for this static site.

## Build Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production (creates `out` folder)
- `npm run start` - Start production server locally

## Project Structure

```
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   ├── Header.tsx           # Navigation header
│   ├── HeroCarousel.tsx     # Hero section carousel
│   ├── WhySection.tsx       # Why choose us section
│   ├── ClassesSection.tsx   # Classes overview
│   ├── AwardsSection.tsx    # Awards and recognition
│   ├── ContactSection.tsx   # Contact information
│   └── Footer.tsx           # Site footer
├── public/                  # Static assets
├── _headers                 # Cloudflare headers config
├── _redirects              # Cloudflare redirects config
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── package.json            # Dependencies and scripts
```

## Customization

### Colors
Edit the color palette in `tailwind.config.js`:
```js
colors: {
  primary: {
    // Primary blue colors
  },
  accent: {
    // Accent orange colors  
  }
}
```

### Content
Update content in the respective component files:
- Hero content: `components/HeroCarousel.tsx`
- Classes info: `components/ClassesSection.tsx`
- Contact details: `components/ContactSection.tsx`

### Images
Replace placeholder images with your own by updating the `image` URLs in:
- `components/HeroCarousel.tsx`
- `components/ClassesSection.tsx`

## Performance

The site is optimized for performance with:
- Static export (no server required)
- Optimized images with proper caching headers
- Minimal JavaScript bundle
- CSS optimization with Tailwind

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is proprietary to Taekwondonomics.
