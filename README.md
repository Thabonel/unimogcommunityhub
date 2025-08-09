# UnimogCommunityHub

## Project Overview

The ultimate community platform for Unimog enthusiasts. Connect with fellow owners, share knowledge, plan expeditions, and live the Unimog lifestyle.

**Live Site**: https://unimoghub.com (or your deployment URL)

## Features

- 🌍 **Community Platform**: Connect with Unimog owners worldwide
- 🗺️ **Trip Planning**: Advanced route planning with Mapbox integration
- 📚 **Knowledge Base**: Comprehensive articles, manuals, and repair guides
- 🤖 **AI Assistants**: Barry the AI Mechanic for maintenance help
- 🔧 **Vehicle Maintenance**: Track maintenance, fuel logs, and repairs
- 📸 **Photo Sharing**: Share your Unimog adventures with the community
- 💬 **Real-time Chat**: Connect with other enthusiasts
- 🎯 **45-Day Free Trial**: Full access to all features for new users

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: Tailwind CSS + Shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Maps**: Mapbox GL JS
- **Authentication**: Supabase Auth
- **AI Integration**: OpenAI (ChatGPT)
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Supabase account for backend services
- Mapbox account for map features

### Environment Variables

Create a `.env` file in the root directory:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token
VITE_OPENAI_API_KEY=your_openai_api_key
```

### Installation

```bash
# Clone the repository
git clone https://github.com/Thabonel/unimogcommunityhub.git

# Navigate to project directory
cd unimogcommunityhub

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Database Setup

Run the migrations in your Supabase SQL editor:

1. Navigate to your Supabase project
2. Go to SQL Editor
3. Run the migration files in `supabase/migrations/` folder in order

## Deployment

### Netlify Deployment

1. Fork this repository
2. Connect your GitHub account to Netlify
3. Create a new site from Git
4. Add environment variables in Netlify dashboard
5. Deploy!

### Manual Deployment

```bash
# Build the project
npm run build

# The dist folder contains the built application
# Deploy the contents to your hosting service
```

## Contributing

We welcome contributions from the Unimog community! Please feel free to submit issues and pull requests.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## License

This project is proprietary software. All rights reserved.

---

Built with ❤️ by the Unimog Community