# Tube Virality Platform

AI-powered YouTube analytics and virality forecasting platform.

## Features

- Real-time trending video analysis
- AI-powered insights using GPT-4o-mini
- Comprehensive analytics dashboard
- Virality score calculations
- Category filtering and search
- Interactive visualizations

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: FastAPI + Python
- **AI**: OpenAI GPT-4o-mini
- **Data**: YouTube Data API v3

## Quick Start

### Backend

```bash
cd backend_api
python app.py
```

Backend runs on: http://localhost:8001

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:5173

## Data Collection

Run the data collection scripts:

```bash
python src/collection/trending.py
python src/processing/trending_db.py
```

## License

See LICENSE file for details.

