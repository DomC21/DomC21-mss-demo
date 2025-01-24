# MSS AI Operational Efficiency Demo

This repository contains a demonstration of job assignment and customer communication modules for an MSS AI Operational Efficiency Software system.

## Features
- React frontend with:
  - Job request submission form
  - Active jobs dashboard with real-time updates
  - Notification system for job status updates
- FastAPI backend with:
  - Job request processing and contractor assignment
  - Automated customer communications
  - Simple chatbot for basic customer queries
- In-memory database for demo purposes

## Setup Instructions

### Backend Setup
```bash
cd backend
poetry install
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at http://localhost:5173 and the backend API at http://localhost:8000.

## Example Test Data

Test job submission:
```json
{
  "request": {
    "location": "New York",
    "complexity": "medium",
    "preferred_date": "2024-02-15T10:00:00Z",
    "description": "Test job description"
  },
  "customer_email": "test@example.com"
}
```

## API Endpoints

- `POST /jobs` - Submit a new job request
- `GET /jobs` - List all jobs
- `GET /jobs/{job_id}` - Get job details
- `POST /chat` - Send a message to the chatbot

## Development Notes

- The backend uses an in-memory database for demonstration purposes. Data will be lost when the server restarts.
- Email notifications are currently simulated (printed to console).
- The chatbot uses simple keyword matching for responses.
- Contractor assignment is based on location, availability, and job complexity.

## Available Contractors (Demo Data)

1. John Smith (New York)
   - Specialties: Low to Medium complexity jobs
2. Alice Johnson (Los Angeles)
   - Specialties: Medium to High complexity jobs
3. Bob Wilson (Chicago)
   - Specialties: All complexity levels
