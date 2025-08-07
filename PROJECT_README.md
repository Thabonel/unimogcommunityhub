# UnimogCommunityHub

A comprehensive React 18 + TypeScript community platform for Unimog enthusiasts, featuring trip planning, route management, AI chat assistance, and community features.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Mapbox account (for maps)
- OpenAI API key (for Barry AI chat)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd unimogcommunityhub

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Add your API keys to .env:
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
# VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token
# VITE_OPENAI_API_KEY=your_openai_key

# Run database migrations in Supabase dashboard
# See docs/ENVIRONMENT_SETUP.md for details

# Start development server
npm run dev
```

## 📚 Documentation

### Essential Guides
- **[TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** - Common issues and solutions
- **[ENVIRONMENT_SETUP.md](docs/ENVIRONMENT_SETUP.md)** - Initial setup guide
- **[CODEBASE_OVERVIEW.md](docs/CODEBASE_OVERVIEW.md)** - Project structure

### Feature Documentation
- **[MAPBOX_ROUTE_FLICKERING_FIX.md](docs/MAPBOX_ROUTE_FLICKERING_FIX.md)** - Route rendering fix details
- **[MAPBOX_FIX.md](docs/MAPBOX_FIX.md)** - Map initialization fixes
- **[CHATGPT_INTEGRATION_COMPLETE.md](docs/CHATGPT_INTEGRATION_COMPLETE.md)** - AI chat setup

### Development Guides
- **[CONTRIBUTING.md](docs/CONTRIBUTING.md)** - Contribution guidelines
- **[COMMIT_CONVENTION.md](docs/COMMIT_CONVENTION.md)** - Commit message format
- **[STYLE_GUIDE.md](docs/STYLE_GUIDE.md)** - Code style guidelines

### Deployment
- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** - General deployment guide
- **[NETLIFY_DEPLOYMENT.md](docs/NETLIFY_DEPLOYMENT.md)** - Netlify specific guide

## 🛠️ Key Features

### Trip Planning
- Interactive map with Mapbox GL JS
- Route planning with waypoints
- Road-following routes (Mapbox Directions API)
- GPX/KML track upload and management
- Save and share routes

### AI Assistant
- Barry the AI Mechanic (ChatGPT powered)
- Technical support and advice
- Unimog-specific knowledge

### Community Features
- User profiles and authentication
- Forums and discussions
- Vehicle documentation
- Parts marketplace

### Technical Features
- Offline support with service workers
- Real-time updates via Supabase
- Responsive design
- TypeScript for type safety

## 🗂️ Project Structure

```
unimogcommunityhub/
├── src/
│   ├── components/      # React components
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API and service layers
│   ├── contexts/        # React contexts
│   ├── utils/          # Utility functions
│   └── types/          # TypeScript types
├── supabase/
│   ├── migrations/     # Database migrations
│   └── functions/      # Edge functions
├── docs/              # Documentation
└── public/           # Static assets
```

## 🐛 Common Issues

### Development Server Won't Start
```bash
# Kill existing processes
lsof -ti:8080 | xargs kill -9
# Restart
npm run dev
```

### White/Blank Page
- Check browser console for errors
- Clear cache: `Cmd+Shift+R` (Mac) or `Ctrl+F5` (Windows)
- Check for build errors: `npm run build`

### Map Issues
- Verify Mapbox token in `.env`
- Check [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md#2-map-and-route-issues)

### Database Issues
- Run migrations in Supabase dashboard
- Check authentication status
- Verify environment variables

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Format code
npm run format

# Run tests
npm test
```

## 🚀 Deployment

### Netlify
See [NETLIFY_DEPLOYMENT.md](docs/NETLIFY_DEPLOYMENT.md)

### Environment Variables Required
```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_MAPBOX_ACCESS_TOKEN
VITE_OPENAI_API_KEY
```

## 🔒 Security

- API keys stored in environment variables
- Row Level Security (RLS) on Supabase
- Authentication via Supabase Auth
- See [docs/SECURE_CHATGPT_SETUP.md](docs/SECURE_CHATGPT_SETUP.md)

## 📝 Recent Updates

### January 2025
- Fixed route line flickering issue
- Added comprehensive troubleshooting guide
- Improved database migrations
- Enhanced offline detection

### Previous Updates
- See [docs/FIXES_COMPLETED.md](docs/FIXES_COMPLETED.md)
- See [docs/SESSION_FIXES_SUMMARY.md](docs/SESSION_FIXES_SUMMARY.md)

## 🤝 Contributing

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

## 📄 License

[Add license information]

## 🆘 Support

- Check [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) first
- GitHub Issues for bug reports
- Community forum for discussions

## 🙏 Acknowledgments

- Built with React, TypeScript, and Vite
- Maps powered by Mapbox
- Database by Supabase
- AI assistance by OpenAI
- UI components from shadcn/ui

---

*For detailed technical documentation, see the [docs/](docs/) directory.*