# Setup Guide for Development

## Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher (comes with Node.js)
- **Git**: For version control
- **Docker** (optional): For containerized development

## Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Presentation
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
```bash
# Copy the example env file
cp .env.example .env.local

# Edit .env.local and set your API base URL
# The default is https://localhost:7071
```

### 4. Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Environment Variables

Create a `.env.local` file in the project root (this file is git-ignored):

```env
# API Configuration
VITE_API_BASE_URL=https://localhost:7071

# App Configuration
VITE_APP_NAME=AlMuthannaPrecast Inventory Management
VITE_APP_VERSION=1.0.0

# Build Environment
NODE_ENV=development
```

**Important**: Replace `VITE_API_BASE_URL` with your actual API server address.

### Development Environment Variables
- `NODE_ENV`: Should be `development`
- `VITE_LOG_LEVEL`: Set to `debug` for verbose logging
- `VITE_API_BASE_URL`: Your local or remote API endpoint

## Available Scripts

### Development
```bash
# Start development server with hot reload
npm run dev
```

### Production Build
```bash
# Create optimized production build
npm run build

# Preview production build locally
npm preview
```

### Linting
```bash
# Run ESLint to check code quality
npm run lint
```

## Development with Docker

### Docker Development Setup
```bash
# Copy env file for Docker Compose
cp .env.example .env

# Edit .env and set your API URL
nano .env

# Build and start containers
docker-compose up --build

# Stop containers
docker-compose down
```

The app will be available at `http://localhost:5173`

### View Logs
```bash
# View all service logs
docker-compose logs -f

# View only app logs
docker-compose logs -f app
```

## Project Structure

```
src/
├── api/                    # API client configuration
│   ├── client.js          # Axios client setup
│   └── endpoints.js       # API endpoint definitions
├── components/            # React components
│   ├── forms/            # Form components
│   ├── layout/           # Layout components
│   ├── pages/            # Page components
│   ├── modals/           # Modal dialogs
│   └── shared/           # Shared components
├── context/              # React context
│   ├── DataContext.jsx   # Data state management
│   ├── LanguageContext.jsx # Language/i18n
│   └── NotificationContext.jsx # Notifications
├── hooks/                # Custom hooks
│   ├── useAPI.js
│   ├── useData.js
│   ├── useForm.js
│   ├── useLanguage.js
│   └── useNotification.js
├── styles/               # CSS files
├── utils/                # Utility functions
│   ├── formatters.js
│   ├── i18n.js
│   └── validators.js
├── App.jsx               # Root component
└── main.jsx              # Entry point
```

## Troubleshooting

### Issue: "Cannot find module" errors
**Solution**: Run `npm install` again
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: API connection fails
**Solution**: Check your `.env.local` file
```bash
# Verify VITE_API_BASE_URL is set correctly
cat .env.local

# Make sure the API server is running and accessible
curl -v https://your-api-url/api/items
```

### Issue: Port 5173 already in use
**Solution**: Either stop the process using port 5173 or use a different port
```bash
# Use different port
npm run dev -- --port 3000
```

### Issue: Docker build fails
**Solution**: Clear Docker cache and rebuild
```bash
docker-compose down
docker system prune -a
docker-compose up --build
```

## Testing Your Setup

### 1. Development Server Running
```bash
npm run dev
# Should show: ➜  Local:   http://localhost:5173/
```

### 2. App Loads in Browser
- Open `http://localhost:5173`
- You should see the AlMuthannaPrecast Inventory Management app

### 3. API Connection Works
- Open browser DevTools (F12)
- Go to Network tab
- Navigate to Items or any page that fetches data
- You should see API requests being made

### 4. Environment Variables Loaded
- Open browser Console
- You should see the app hint: "Set VITE_API_BASE_URL if your API runs on another host."

## Common Development Tasks

### Add a New Component
```bash
# Create new component file
touch src/components/MyComponent.jsx

# Example structure:
# export default function MyComponent() {
#   return <div>Component</div>
# }
```

### Update Environment Variables
```bash
# Edit .env.local
nano .env.local

# Restart dev server for changes to take effect
```

### Build for Production
```bash
npm run build

# Check build output
ls -lah dist/
```

## Getting Help

- Check existing GitHub issues
- Review the API documentation
- Check the main README.md
- Review DEPLOYMENT.md for production setup

## Next Steps

1. Start the development server
2. Explore the application UI
3. Review the component structure
4. Read DEPLOYMENT.md for production deployment
5. Check CODE_REVIEW_AND_IMPLEMENTATION_PLAN.md for pending features
