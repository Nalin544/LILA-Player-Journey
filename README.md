# LILA Player Journey Tool

## Live Demo

Frontend:
https://lila-player-journey-lake.vercel.app/

Backend API Docs:
https://lila-player-journey.onrender.com/docs

## Note

The backend is hosted on Render's free tier.

If the application has been inactive, the first request may take up to 60 seconds while the backend wakes up.

If the dashboard does not load immediately, please wait briefly and refresh once.

## Overview

The LILA Player Journey Tool is an interactive web application designed to help Level Designers analyze player behavior using gameplay telemetry data.

The tool visualizes player journeys on game minimaps and provides insights into movement patterns, combat hotspots, loot interactions, and player eliminations.

Users can explore matches through replay controls, event filtering, statistics, and heatmap visualizations.

## Features

### Journey Visualization

* Displays player movement paths on minimaps.
* Supports both human players and bots.
* Differentiates actors using distinct visual styles.

### Replay System

* Timeline slider for match playback.
* Play and pause controls.
* Reset functionality.

### Filters

* Map selection.
* Match selection.
* Event filtering:

  * All Events
  * Position Events
  * Loot Events
  * Kill Events
  * Death Events

### Heatmaps

* Traffic Heatmap
* Kill Heatmap
* Death Heatmap

### Analytics

* Human Players
* Bots
* Total Actors
* Kills
* Deaths
* Loot Events
* Storm Eliminations
* Total Events

## Tech Stack

### Frontend

* React
* Vite

### Backend

* FastAPI

### Data Processing

* Pandas
* PyArrow

### Visualization

* SVG Paths
* React Components

### Data Source

* Gameplay Telemetry Parquet Files


## Setup Instructions

### Backend Setup

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn main:app --reload
```

Backend will run at:

```text
http://https://lila-player-journey.onrender.com
```

Swagger documentation:

```text
https://lila-player-journey.onrender.com/docs
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend will run at:

```text
https://lila-player-journey-lake.vercel.app/
```

## Application Workflow

1. Load telemetry data from parquet files.
2. Process data using Pandas.
3. Serve telemetry through FastAPI endpoints.
4. Fetch match data in React.
5. Convert gameplay coordinates into minimap coordinates.
6. Render player journeys, events, statistics, and heatmaps.
7. Allow users to explore gameplay through filters and replay controls.

## Key Design Decisions

### Human vs Bot Detection

The visualization distinguishes human players and bots to help Level Designers understand encounter patterns and gameplay balance.

### Coordinate Mapping

World coordinates are transformed into minimap coordinates using map boundary information provided with the dataset.

### Replay-Based Exploration

A timeline slider and playback controls enable users to inspect player journeys progressively rather than viewing all events at once.

### Heatmap Analysis

Traffic, kill, and death heatmaps provide a high-level overview of player activity and engagement hotspots.

## Architecture

```text
Parquet Files
      ↓
Pandas Data Loader
      ↓
FastAPI Backend
      ↓
REST API Endpoints
      ↓
React Frontend
      ↓
Journey Visualization
      ↓
Heatmaps & Analytics
```

The system uses a FastAPI backend to expose telemetry data and a React frontend to provide interactive visualization and analysis tools for Level Designers.

## Insights Summary

Analysis of the telemetry dataset revealed several interesting gameplay patterns:

### 1. Combat Is Dominated by Bots

* BotKill: 2,415
* BotKilled: 700
* Kill: 3
* Killed: 3

Most combat encounters involve AI-controlled opponents rather than human players.

### 2. Loot Collection Is a Major Activity

* Loot Events: 12,885

Loot interactions are one of the most common gameplay activities and strongly influence player movement.

### 3. Storm Eliminations Are Rare

* KilledByStorm: 39

Most eliminations occur through combat rather than environmental pressure.

## Future Improvements

* Advanced heatmap rendering.
* Match comparison mode.
* Additional player behavior analytics.
* Session-level journey aggregation.
* Enhanced filtering options.
* Deployment monitoring and analytics.

## Deliverables

* Interactive Player Journey Tool
* Heatmap Visualization
* Replay Controls
* Match and Event Filtering
* Statistics Dashboard
* ARCHITECTURE.md
* INSIGHTS.md
* README.md

## Author

Nalin Kumar L

Developed as part of the LILA Player Journey Tool assessment.
