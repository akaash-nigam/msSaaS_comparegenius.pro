# Quick Start Instructions

## ✅ Completed Steps

1. ✅ Port configuration updated (Frontend: 3001, Backend: 5001)
2. ✅ Dependencies installed (710 packages)
3. ✅ Environment file (.env) created

## 🚦 Next Steps

### Option 1: Using Docker (Recommended)

**Step 1: Start Docker Desktop**
- Open Docker Desktop application on your Mac
- Wait for it to fully start (whale icon in menu bar should be stable)

**Step 2: Start Infrastructure**
```bash
cd /Users/aakashnigam/Axion/AxionApps/msSaaS/msSaaS_comparegenius.pro
docker-compose up -d
```

Wait ~30 seconds for services to initialize, then verify:
```bash
docker-compose ps
```

You should see 3 services running:
- `comparegenius-postgres` (port 5432)
- `comparegenius-elasticsearch` (ports 9200, 9300)
- `comparegenius-redis` (port 6379)

**Step 3: Start Development Servers**
```bash
npm run dev
```

**Step 4: Access the Application**
- Frontend: http://localhost:3001
- Backend API: http://localhost:5001/health

---

### Option 2: Without Docker (Install Services Locally)

If you don't want to use Docker, install these via Homebrew:

```bash
# Install services
brew install postgresql@15 redis

# Install Elasticsearch
brew tap elastic/tap
brew install elastic/elasticsearch-full

# Start services
brew services start postgresql@15
brew services start redis
brew services start elasticsearch-full

# Create database
createdb comparegenius

# Start dev servers
npm run dev
```

---

### Option 3: Frontend Only (No Backend)

If you just want to see the UI:

```bash
# Start only the frontend
npm run dev:client
```

Then visit http://localhost:3001

Note: API calls won't work, but you can see the UI design.

---

## Troubleshooting

### Docker not starting?
1. Check Docker Desktop is running: `docker ps`
2. Restart Docker Desktop
3. Check Docker has enough memory (Settings → Resources → Memory: 4GB+)

### Port conflicts?
```bash
# Check what's using a port
lsof -i :3001
lsof -i :5001

# Kill process if needed
kill -9 <PID>
```

### Services not healthy?
```bash
# Check logs
docker-compose logs postgres
docker-compose logs elasticsearch
docker-compose logs redis

# Restart services
docker-compose restart
```

### Need to reset everything?
```bash
# Stop and remove all data
docker-compose down -v

# Start fresh
docker-compose up -d
```

---

## Current Configuration

**Ports:**
- Frontend: 3001
- Backend: 5001
- PostgreSQL: 5432
- Elasticsearch: 9200, 9300
- Redis: 6379

**Environment:**
- Database: comparegenius
- User: postgres
- Password: password

**Status:**
- ✅ Dependencies installed
- ✅ Configuration ready
- ⏳ Waiting for Docker to start

---

## What's Next After Starting?

Once the app is running:

1. **Add OpenAI API Key** (optional but recommended):
   - Get key from: https://platform.openai.com/api-keys
   - Add to `.env`: `OPENAI_API_KEY=sk-your-key-here`
   - Restart backend: `npm run dev:server`

2. **Create Sample Data**:
   ```bash
   # Coming next: seed script to populate test products
   npm run db:seed
   ```

3. **Start Building Features**:
   - Search functionality
   - Product detail pages
   - Comparison tools
   - Authentication UI

Check `PRODUCT_BACKLOG.md` for the full feature list!
