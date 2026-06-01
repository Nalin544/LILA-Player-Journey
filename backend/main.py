from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from data_loader import load_all_data


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
print("Loading data...")
df = load_all_data()
print(f"Loaded {len(df)} rows")

@app.get("/")
def home():
    return {"status": "running"}

@app.get("/maps")
def maps():
    return list(df["map_id"].unique())

@app.get("/matches")
def matches():
    return list(df["match_id"].unique())

@app.get("/match/{match_id}")
def get_match(match_id: str):

    match_data = df[df["match_id"] == match_id]

    return match_data.to_dict(orient="records")

@app.get("/events")
def events():
    return list(df["event"].unique())

@app.get("/matches/{map_name}")
def matches_by_map(map_name: str):

    matches = df[df["map_id"] == map_name]

    return list(matches["match_id"].unique())

@app.get("/events")
def events():

    return list(df["event"].unique())

@app.get("/debug/{match_id}")
def debug_match(match_id: str):

    match_data = df[df["match_id"] == match_id]

    return {
        "rows": len(match_data),
        "unique_players": int(match_data["user_id"].nunique()),
        "players": list(match_data["user_id"].unique())[:20]
    }
    
@app.get("/dataset-summary")
def dataset_summary():

    return {
        "total_rows": len(df),
        "total_matches": int(df["match_id"].nunique()),
        "total_players": int(df["user_id"].nunique())
    }

@app.get("/player-count-distribution")
def player_count_distribution():

    counts = (
        df.groupby("match_id")["user_id"]
        .nunique()
        .value_counts()
        .sort_index()
    )

    return counts.to_dict() 
@app.get("/multiplayer-matches")
def multiplayer_matches():

    counts = (
        df.groupby("match_id")["user_id"]
        .nunique()
    )

    result = counts[counts > 1]

    return result.to_dict()

@app.get("/insights/top-maps")
def top_maps():
    return df["map_id"].value_counts().to_dict()

@app.get("/insights/event-counts")
def event_counts():
    return df["event"].value_counts().to_dict()

@app.get("/insights/player-counts")
def player_counts():
    return {
        "matches": int(df["match_id"].nunique()),
        "players": int(df["user_id"].nunique())
    }
    
@app.get("/events")
def events():

    return list(df["event"].unique())