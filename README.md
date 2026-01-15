# MICHU Project

This is the frontend codebase for the MICHU project.

## Project Structure
```
MICHU/
├── index.html              # Main landing page
├── README.md               # Project documentation
├── robots.txt              # SEO robots file
├── sitemap.xml             # SEO sitemap
├── .gitignore              # Git ignore rules
├── css/                    # Stylesheets
│   └── style.css           # Main stylesheet
├── js/                     # JavaScript files
│   ├── script.js           # Main site functionality
│   ├── supabase.js         # Supabase configuration
│   ├── email-service.js    # EmailJS integration
│   ├── csrf-protection.js  # Security utilities
│   ├── portal-auth.js      # Portal authentication
│   └── portal-dashboard.js # Dashboard functionality
├── pages/                  # Secondary pages
│   ├── distributor-portal.html  # Login page
│   ├── privacy-policy.html      # Privacy policy
│   └── terms.html               # Terms & conditions
├── admin/                  # Admin section
│   ├── admin.html          # Admin dashboard
│   └── distributor-dashboard.html  # Distributor dashboard
└── .github/
    └── workflows/
        └── deploy.yml      # GitHub Actions deployment
```

## Features
- Dynamic product loading from Supabase
- Contact form with EmailJS integration
- Mobile-responsive design
- Distributor portal with authentication
- Admin panel for content management

## Setup
1. Clone the repository.
2. Open `index.html` in your browser or serve with a local server (e.g., Live Server).

## Deployment
This project is configured to deploy automatically to GitHub Pages when pushing to the `main` branch.