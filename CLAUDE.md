# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static website for 东莞中元华信财税服务有限公司 (Zhong Yuan Huaxin Finance & Tax Service Co., Ltd), a Chinese finance/tax service company specializing in foreign representative office registration and startup enterprise services.

## Technology Stack

- **Static HTML/CSS/JS** - No framework, no build system
- **CSS Variables** - Black/white/grey theme with gold accent (`:root` in `css/style.css`)
- **Vanilla JavaScript** - All interaction logic in `js/main.js`
- **Deployment**: Vercel static hosting (`vercel.json` configured)

## Key Architecture

### File Structure
```
zh-yh-finance/
├── index.html           # Main landing page
├── service-*.html       # Service detail pages (3 pages)
├── css/style.css        # All styles with CSS variables theme
├── js/main.js           # Mobile menu, scroll, form handling
├── public/              # SEO files (robots.txt, sitemap.xml)
└── vercel.json          # Vercel deployment config
```

### CSS Theme System
The site uses CSS variables in `css/style.css:1-31` for consistent styling:
- `--color-black`: #1A1A1A (primary)
- `--color-gold`: #D4AF37 (CTA accent)
- All colors, spacing, shadows defined as variables

### JavaScript Modules
`js/main.js` handles:
- Mobile menu toggle with hamburger animation
- Header scroll shadow effect
- Smooth scroll anchor navigation
- Contact form validation (currently logs to console, no backend)
- Notification system for form feedback
- Intersection Observer for lazy loading images

### SEO Implementation
- Schema.org LocalBusiness markup in HTML `<script type="application/ld+json">`
- Per-page meta tags (Title, Description, Keywords in Chinese)
- Semantic HTML structure throughout
- Sitemap and robots.txt in `public/`

## Deployment

The project deploys to Vercel as static files. Run `/vercel:deploy` to deploy.

## Placeholders to Replace

Before production, search and replace these placeholders:
- `+86-769-XXXXXXXX` → actual phone number
- `广东省东莞市 XXXX 区 XXXX 路 XX 号` → actual address
- `info@zh-yh-finance.com` → actual email
- `粤 ICP 备 XXXXXXXX 号` → actual ICP registration number
- WeChat QR placeholder needs real image

## Service Pages

Three dedicated service pages exist:
- `service-company-registration.html` - Company registration services
- `service-tax-planning.html` - Tax planning services
- `service-tax-compliance.html` - Tax compliance services

Each follows the same structure: page hero → service intro → features → content detail → process steps → FAQ → CTA.

## Development Notes

- All content is in Chinese (Simplified)
- Mobile-first responsive design (breakpoints: 992px, 768px, 480px)
- Form submission currently only logs to console - needs backend integration for production
- Images folder exists but contains placeholder structure for WeChat QR code