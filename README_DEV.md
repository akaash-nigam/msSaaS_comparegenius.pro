# CompareGenius Pro - Development Guide

## Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Docker and Docker Compose (for databases)
- OpenAI API key (for AI features)

### 1. Clone and Install

```bash
cd /Users/aakashnigam/Axion/AxionApps/msSaaS/msSaaS_comparegenius.pro
npm install
```

### 2. Start Infrastructure

Start PostgreSQL, Elasticsearch, and Redis with Docker Compose:

```bash
docker-compose up -d
```

Verify services are running:
```bash
docker-compose ps
```

### 3. Configure Environment

Copy the example environment file and update with your keys:

```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=sk-your-actual-api-key-here
```

### 4. Start Development Servers

Start both frontend and backend:

```bash
npm run dev
```

Or run them separately:

```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend
npm run dev:client
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/health

## Project Structure

```
comparegenius.pro/
├── client/                # React frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── App.tsx       # Main app component
│   │   └── main.tsx      # Entry point
│   ├── package.json
│   └── vite.config.ts
│
├── server/                # Node.js backend
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── db/          # Database models & connection
│   │   ├── middleware/   # Express middleware
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic (AI, search, etc.)
│   │   ├── utils/        # Utilities
│   │   └── index.ts      # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml     # Development infrastructure
├── package.json          # Root package (workspace manager)
├── .env.example          # Environment variables template
└── README_DEV.md         # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile (requires auth)

### Products
- `GET /api/products` - List products
- `GET /api/products/:id` - Get product details
- `GET /api/products/:id/prices` - Get product prices across retailers
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Search
- `GET /api/search?q=query&category=&brand=&minPrice=&maxPrice=` - Search products

### Comparisons
- `POST /api/comparisons` - Compare products (requires productIds array)

## Development Workflow

### Making Database Changes

1. Modify models in `server/src/db/models/`
2. Restart server (auto-sync in development)
3. For production, create migrations

### Adding New Features

Follow the backlog in `PRODUCT_BACKLOG.md`:

1. **Backend**:
   - Add model (if needed) in `server/src/db/models/`
   - Create controller in `server/src/controllers/`
   - Define routes in `server/src/routes/`
   - Add business logic in `server/src/services/`

2. **Frontend**:
   - Create page in `client/src/pages/`
   - Create components in `client/src/components/`
   - Add route in `client/src/App.tsx`

### Testing APIs

Use curl or Postman:

```bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Search products
curl "http://localhost:5000/api/search?q=laptop"
```

## Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart a service
docker-compose restart postgres

# Reset everything (WARNING: deletes all data)
docker-compose down -v
```

## Common Issues

### Port Already in Use

If ports 3000, 5000, 5432, 9200, or 6379 are in use:

```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Database Connection Issues

1. Ensure Docker services are running:
   ```bash
   docker-compose ps
   ```

2. Check PostgreSQL logs:
   ```bash
   docker-compose logs postgres
   ```

3. Reset database:
   ```bash
   docker-compose down -v
   docker-compose up -d
   ```

### Elasticsearch Not Starting

Elasticsearch needs memory. If it fails:

```bash
# On macOS/Linux, increase Docker memory to 4GB+
# Or reduce Elasticsearch heap size in docker-compose.yml:
ES_JAVA_OPTS=-Xms256m -Xmx256m
```

## Next Steps

1. ✅ **Setup Complete** - You have a working full-stack app!

2. **Implement Features** - Follow the backlog:
   - Start with Sprint 0 tasks in `PRODUCT_BACKLOG.md`
   - Implement authentication UI
   - Build product search functionality
   - Add comparison features

3. **Add Sample Data** - Create seed script to populate database with test products

4. **Deploy** - When ready, deploy to:
   - Backend: Railway, Render, or AWS
   - Frontend: Vercel, Netlify, or AWS S3 + CloudFront
   - Database: AWS RDS, Supabase, or managed PostgreSQL

## Resources

- **React**: https://react.dev
- **React Router**: https://reactrouter.com
- **TanStack Query**: https://tanstack.com/query
- **Tailwind CSS**: https://tailwindcss.com
- **Express**: https://expressjs.com
- **Sequelize**: https://sequelize.org
- **OpenAI**: https://platform.openai.com/docs
- **Elasticsearch**: https://www.elastic.co/guide

## Support

For issues or questions, check:
- `PRODUCT_BACKLOG.md` - Feature roadmap
- `COMPETITIVE_ANALYSIS.md` - Market positioning
- `PRD.md` - Product requirements
