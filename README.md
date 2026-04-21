# AlMuthannaPrecast Inventory Management System

A modern React-based inventory management system for AlMuthannaPrecast, built with Vite, React Router, and integrated with RESTful APIs.

## Overview

This application provides comprehensive inventory management capabilities including:
- **Voucher Management**: Create, search, and export vouchers
- **Item Management**: Track items with quantity thresholds
- **Project Management**: Organize items by project
- **Manufacturing Tracking**: Manage manufacturers and units
- **Excel Export**: Export vouchers with advanced filtering
- **Multi-language Support**: English and Arabic UI

## Quick Start

### Prerequisites
- **Node.js**: v18 or higher
- **npm**: v9 or higher

### Installation & Running

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env.local

# 3. Edit .env.local and set your API URL
# VITE_API_BASE_URL=https://your-api-server.com

# 4. Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## Environment Configuration

### Environment Variables

Create a `.env.local` file (git-ignored) with:

```env
# Required
VITE_API_BASE_URL=https://localhost:7071

# Optional
VITE_APP_NAME=AlMuthannaPrecast Inventory Management
VITE_APP_VERSION=1.0.0
NODE_ENV=development
VITE_LOG_LEVEL=debug
```

### Available Environment Files
- `.env.example` - Template (commit to git)
- `.env.local` - Development (git-ignored)
- `.env.production` - Production template

## Docker Deployment

### Development with Docker

```bash
# Start with docker-compose
docker-compose up

# Access at http://localhost:5173
# Includes hot-reload and automatic rebuilds
```

### Production Deployment

```bash
# Build production image
docker build -t inventory-app:latest .

# Run with Docker
docker run -p 80:80 \
  -e VITE_API_BASE_URL=https://api.example.com \
  inventory-app:latest

# Or use docker-compose for production
docker-compose -f docker-compose.prod.yml up
```

**Access**: http://localhost

## Available Scripts

```bash
# Development server (with hot reload)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## Project Structure

```
src/
├── api/                    # API client & endpoints
│   ├── client.js          # Axios configuration
│   └── endpoints.js       # API endpoint definitions
├── components/            # React components
│   ├── forms/            # Form components
│   ├── layout/           # Layout (Sidebar, Topbar)
│   ├── pages/            # Page components
│   ├── modals/           # Modal dialogs
│   └── shared/           # Reusable components
├── context/              # React context providers
│   ├── DataContext.jsx   # Data state management
│   ├── LanguageContext.jsx # i18n & language
│   └── NotificationContext.jsx # Toast notifications
├── hooks/                # Custom hooks
├── styles/               # CSS stylesheets
├── utils/                # Utility functions
├── App.jsx               # Root component
└── main.jsx              # Entry point
```

## API Integration

The application integrates with **AlMuthannaPrecast API v1** (see `v1.json` for OpenAPI spec).

### Endpoints
- **Items**: CRUD operations, minimum stock notifications
- **Manufactures**: Create and manage manufacturers
- **Projects**: Create and manage projects
- **Units**: Create and manage units
- **Vouchers**: CRUD operations, export to Excel with filtering

### API Base URL
Set `VITE_API_BASE_URL` environment variable to your API server:
- Development: `https://localhost:7071`
- Production: Your production API endpoint

## Features

### ✅ Implemented
- [x] Full CRUD for all entities
- [x] Voucher export to Excel
- [x] Project and item filtering
- [x] Inline unit/manufacture creation
- [x] Multi-language support (EN/AR)
- [x] Form validation
- [x] Error notifications
- [x] Dashboard with stock alerts
- [x] Docker containerization

### 📋 In Progress
- [ ] Minimum quantity notifications on voucher creation
- [ ] Advanced export filtering
- [ ] Real-time stock updates

See [CODE_REVIEW_AND_IMPLEMENTATION_PLAN.md](./CODE_REVIEW_AND_IMPLEMENTATION_PLAN.md) for details.

## Technology Stack

### Frontend
- **React**: 19.2.5
- **React Router**: 7.14.1
- **Vite**: 8.0.9
- **Axios**: 1.15.1
- **React Hook Form**: 7.72.1
- **Zod**: 4.3.6 (Validation)

### Styling
- **CSS**: Custom CSS with CSS Variables
- **i18next**: Multi-language support

### Deployment
- **Docker**: Container support
- **Nginx**: Production web server
- **Docker Compose**: Local development

## Documentation

- **[SETUP.md](./SETUP.md)** - Development environment setup
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Docker & production deployment
- **[CODE_REVIEW_AND_IMPLEMENTATION_PLAN.md](./CODE_REVIEW_AND_IMPLEMENTATION_PLAN.md)** - Planned features & improvements
- **[CODE_CORRECTIONS_AND_FIXES.md](./CODE_CORRECTIONS_AND_FIXES.md)** - Issues and corrections

## API Documentation

The API follows OpenAPI 3.1.1 specification. See [v1.json](./v1.json) for complete documentation.

### Quick API Examples

```bash
# Get all items
curl https://your-api-url/api/items

# Create a voucher
curl -X POST https://your-api-url/api/vouchers \
  -H "Content-Type: application/json" \
  -d '{"isImporting":true,"voucherNumber":"V001","quantity":10,"price":100,...}'

# Export vouchers to Excel
curl -X POST https://your-api-url/api/vouchers/export/excel \
  -H "Content-Type: application/json" \
  -d '{"startDate":"2024-01-01T00:00:00Z","endDate":"2024-12-31T23:59:59Z"}'
```

## Troubleshooting

### API Connection Issues
```bash
# Verify API is accessible
curl -v https://your-api-url/api/items

# Check environment variable
cat .env.local | grep VITE_API_BASE_URL

# Update .env.local and restart npm run dev
```

### Port Already in Use
```bash
# Use different port
npm run dev -- --port 3000
```

### Docker Issues
```bash
# Rebuild without cache
docker-compose down
docker-compose up --build

# View logs
docker-compose logs -f
```

## Security Notes

- API base URL is configured via environment variables
- Development hint hidden in production builds
- HTTPS recommended for production
- Security headers configured in Nginx
- CORS headers respected for API calls

## Contributing

When contributing:
1. Create feature branch from `main`
2. Follow existing code patterns
3. Update documentation
4. Test with `npm run lint`
5. Submit pull request

## Performance

- **Build Size**: ~25-30 MB Docker image
- **Load Time**: <2 seconds
- **Bundle**: Optimized with code splitting
- **Caching**: Static assets cached (1 year)
- **Compression**: Gzip enabled in production

## License

[License information here]

## Support

For issues and questions:
1. Check [SETUP.md](./SETUP.md) for setup help
2. Review [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment
3. Check existing issues on GitHub
4. Contact the development team

## Version

- **Current Version**: 1.0.0
- **Last Updated**: April 21, 2026
- **Node Version**: 18+
- **React Version**: 19.2.5

---

**Happy Inventory Managing! 📦**

## Legacy Information

The following is the original template information

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
