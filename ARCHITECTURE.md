# Architecture

## Tech Stack

* Frontend: React + Vite
* Backend: FastAPI
* Data Processing: Pandas
* Data Format: Parquet
* Visualization: React Components and SVG

## System Architecture

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
Player Journey Visualization
```

### Data Flow

1. Gameplay telemetry is stored in parquet files.
2. Pandas loads and combines the data into a single dataframe.
3. FastAPI exposes endpoints for maps, matches, and match events.
4. React fetches data from the API using HTTP requests.
5. The frontend renders player journeys, events, statistics, and heatmaps on top of the minimap images.

```
```
## Coordinate Mapping

### Problem

Gameplay events contain world coordinates (`x`, `z`) that cannot be displayed directly on the minimap image.

### Approach

The minimap images and coordinate boundaries provided in the dataset README were used to convert world coordinates into minimap coordinates.

The conversion process:

1. Read the event world coordinates (`x`, `z`).
2. Apply map-specific coordinate boundaries.
3. Normalize the coordinates to the minimap coordinate system.
4. Scale the normalized coordinates to the displayed map size.
5. Render the resulting coordinates as markers and journey paths.

### Visualization Pipeline

```text
World Coordinates (x,z)
           ↓
Coordinate Mapper
           ↓
Minimap Coordinates
           ↓
Screen Coordinates
           ↓
React Visualization Layer
```

This approach ensures that player movement, loot events, kills, deaths, and storm events are rendered in the correct locations on the minimap.

## Assumptions

1. Bot and human actors were identified using the telemetry patterns present in the dataset.

2. Match playback is based on event ordering and timestamps available in the telemetry data.

3. Single-player telemetry streams were treated as valid match journeys because they are present in the source dataset.

4. Heatmaps are generated from event locations and represent relative activity density rather than exact gameplay intensity.

5. When event data contained coordinate information, those coordinates were treated as the source of truth for visualization.

## Tradeoffs

| Decision                | Reason                                                          |
| ----------------------- | --------------------------------------------------------------- |
| React + Vite            | Fast development and responsive UI                              |
| FastAPI                 | Lightweight backend with simple API creation                    |
| SVG for path rendering  | Easy visualization of player journeys                           |
| Client-side playback    | Reduced backend complexity                                      |
| Preloaded dataframe     | Faster query response for interactive exploration               |
| Simple heatmap overlays | Faster implementation while still providing actionable insights |

## Summary

The system was designed to help Level Designers explore player movement, combat activity, loot interactions, and death locations through an interactive web-based visualization tool. The architecture prioritizes simplicity, responsiveness, and accurate coordinate mapping while supporting replay, filtering, statistics, and heatmap analysis.

