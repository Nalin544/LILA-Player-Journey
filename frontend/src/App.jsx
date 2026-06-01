import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [maps, setMaps] = useState([]);
  const [selectedMap, setSelectedMap] = useState("");

  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState("");

  const [matchData, setMatchData] = useState([]);

  const [playbackIndex, setPlaybackIndex] = useState(100);

  const [heatmapType, setHeatmapType] = useState("none");

  const [eventFilter, setEventFilter] = useState("All");

  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/maps")
      .then(res => {
        setMaps(res.data);
        setSelectedMap(res.data[0]);
      });

  }, []);

  useEffect(() => {

  if (!selectedMap) return;
  axios
    .get(`http://127.0.0.1:8000/matches/${selectedMap}`)
    .then((res) => {
      setMatches(res.data);
      if (res.data.length > 0) {
        setSelectedMatch(res.data[0]);
      }
    });
  }, [selectedMap]);

  useEffect(() => {
  if (!selectedMatch) return;
  axios
    .get(`http://127.0.0.1:8000/match/${selectedMatch}`)
    .then((res) => {
      setMatchData(res.data);
    });
  }, [selectedMatch]);

  useEffect(() => {

  if (!playing) return;

  const timer = setInterval(() => {

    setPlaybackIndex(prev => {

      if (prev >= matchData.length) {
        setPlaying(false);
        return prev;
      }

      return prev + 1;

    });

  }, 100);

  return () => clearInterval(timer);

}, [playing, matchData.length]);

  const getMapImage = () => {
    if (selectedMap === "AmbroseValley")
      return "/minimaps/AmbroseValley_Minimap.png";

    if (selectedMap === "GrandRift")
      return "/minimaps/GrandRift_Minimap.png";

    if (selectedMap === "Lockdown")
      return "/minimaps/Lockdown_Minimap.jpg";

    return "";
  };
  
  const convertCoordinates = (x, z, mapId) => {

  const configs = {
    AmbroseValley: {
      scale: 900,
      originX: -370,
      originZ: -473
    },
    GrandRift: {
      scale: 581,
      originX: -290,
      originZ: -290
    },
    Lockdown: {
      scale: 1000,
      originX: -500,
      originZ: -500
    }
  };

  const config = configs[mapId];

  if (!config) return { x: 0, y: 0 };

  const u = (x - config.originX) / config.scale;
  const v = (z - config.originZ) / config.scale;

    return {
      x: u * 1024,
      y: (1 - v) * 1024
    };
  };
  const getEventColor = (eventType) => {

    switch (eventType) {

      case "Kill":
        return "red";

      case "Killed":
        return "black";

      case "Loot":
        return "lime";

      case "KilledByStorm":
        return "purple";

      case "BotKill":
        return "orange";

      case "BotKilled":
        return "yellow";

      case "BotPosition":
        return "cyan";

      default:
        return "blue";
    }
  };

const positionEvents = matchData
  .slice(0, playbackIndex)
  .filter(
    event =>
      event.event === "Position" ||
      event.event === "BotPosition"
  )
  .sort(
    (a, b) =>
      new Date(a.ts) - new Date(b.ts)
  );
  
const playerPaths = {};

positionEvents.forEach(event => {

  if (!playerPaths[event.user_id]) {
    playerPaths[event.user_id] = [];
  }

  const pos = convertCoordinates(
    event.x,
    event.z,
    event.map_id
  );

  playerPaths[event.user_id].push({
    x: (pos.x / 1024) * 700,
    y: (pos.y / 1024) * 700,
    eventType: event.event
  });

});




const stats = {

  players: new Set(
    matchData
      .filter(e => !/^\d+$/.test(e.user_id))
      .map(e => e.user_id)
  ).size,

  bots: new Set(
    matchData
      .filter(e => /^\d+$/.test(e.user_id))
      .map(e => e.user_id)
  ).size,

  kills: matchData.filter(
    e => e.event === "Kill" ||
         e.event === "BotKill"
  ).length,

  loot: matchData.filter(
    e => e.event === "Loot"
  ).length,

  stormDeaths: matchData.filter(
    e => e.event === "KilledByStorm"
  ).length,

  deaths: matchData.filter(
   e =>
    e.event === "Killed" ||
    e.event === "BotKilled" ||
    e.event === "KilledByStorm"
  ).length

};

const heatmapPoints = matchData
  .slice(0, playbackIndex)
  .filter(
    event =>
      event.event === "Position" ||
      event.event === "BotPosition"
  )
  .map(event => {

    const pos = convertCoordinates(
      event.x,
      event.z,
      event.map_id
    );

    return {
      x: (pos.x / 1024) * 700,
      y: (pos.y / 1024) * 700
    };

  }); 
const killHeatmapPoints = matchData
  .filter(
    event =>
      event.event === "Kill" ||
      event.event === "BotKill"
  )
  .map(event => {

    const pos = convertCoordinates(
      event.x,
      event.z,
      event.map_id
    );

    return {
      x: (pos.x / 1024) * 700,
      y: (pos.y / 1024) * 700
    };

  });

const deathHeatmapPoints = matchData
  .filter(
    event =>
      event.event === "Killed" ||
      event.event === "BotKilled" ||
      event.event === "KilledByStorm"
  )
  .map(event => {

    const pos = convertCoordinates(
      event.x,
      event.z,
      event.map_id
    );

    return {
      x: (pos.x / 1024) * 700,
      y: (pos.y / 1024) * 700
    };

  });

const sortedEvents = [...matchData].sort(
  (a, b) => new Date(a.ts) - new Date(b.ts)
);

const filteredEvents = matchData
  .slice(0, playbackIndex)
  .filter((event) => {

    if (eventFilter === "All")
      return true;

    if (eventFilter === "Position")
      return (
        event.event === "Position" ||
        event.event === "BotPosition"
      );

    if (eventFilter === "Loot")
      return event.event === "Loot";

    if (eventFilter === "Kill")
      return (
        event.event === "Kill" ||
        event.event === "BotKill"
      );

    if (eventFilter === "Death")
      return (
        event.event === "Killed" ||
        event.event === "BotKilled" ||
        event.event === "KilledByStorm"
      );

    return true;

  });

    const cardStyle = {
    padding: "8px",
    minWidth: "90px",
    border: "1px solid #444",
    borderRadius: "8px",
    textAlign: "center",
    backgroundColor: "#1e1e1e",
    fontWeight: "bold"
    };

    const buttonStyle = {
      padding: "8px 16px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      fontWeight: "bold",
      backgroundColor: "#2563eb",
      color: "white"
    };

  
return (
  <div style={{ padding: "20px" }}>

    <h1>LILA Player Journey Tool</h1>


    
    <div
  style={{
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: "20px"
  }}
>

    <select
      value={selectedMap}
      onChange={(e) => setSelectedMap(e.target.value)}
    >
      {maps.map((map) => (
        <option key={map} value={map}>
          {map}
        </option>
      ))}
    </select>

    <select
      value={selectedMatch}
      onChange={(e) => setSelectedMatch(e.target.value)}
    >
      {matches.map((match) => (
        <option key={match} value={match}>
          {match}
        </option>
      ))}
    </select>

    <select
      value={eventFilter}
      onChange={(e) => setEventFilter(e.target.value)}
    >
      <option value="All">All Events</option>
      <option value="Position">Position</option>
      <option value="Loot">Loot</option>
      <option value="Kill">Kills</option>
      <option value="Death">Deaths</option>
    </select>

    <br />
    <br />

        <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "12px",
        marginBottom: "20px"
      }}
  >

     <div style={cardStyle}>
    <div>👤 Players</div>
    <div>{stats.players}</div>
  </div>

  <div style={cardStyle}>
    <div>🤖 Bots</div>
    <div>{stats.bots}</div>
  </div>

  <div style={cardStyle}>
    <div>🎯 Total Actors</div>
    <div>{stats.players + stats.bots}</div>
  </div>

  <div style={cardStyle}>
    <div>🔴 Kills</div>
    <div>{stats.kills}</div>
  </div>

  <div style={cardStyle}>
    <div>⚫ Deaths</div>
    <div>{stats.deaths}</div>
  </div>

  <div style={cardStyle}>
    <div>🟢 Loot</div>
    <div>{stats.loot}</div>
  </div>

  <div style={cardStyle}>
    <div>🟣 Storm</div>
    <div>{stats.stormDeaths}</div>
  </div>

  <div style={cardStyle}>
  <div>📊 Events</div>
  <div>{matchData.length}</div>
  </div>

  </div>

    

    <input
      type="range"
      min="1"
      max={matchData.length || 1}
      value={playbackIndex}
      onChange={(e) =>
        setPlaybackIndex(Number(e.target.value))
      }
      style={{ width: "500px" }}
    />

   <p>
      {playbackIndex} / {matchData.length} Events
   </p>

  <select
  value={heatmapType}
  onChange={(e) => setHeatmapType(e.target.value)}
>
  <option value="none">Normal View</option>
  <option value="traffic">Traffic Heatmap</option>
  <option value="kills">Kill Heatmap</option>
  <option value="deaths">Death Heatmap</option>

</select>

<button  style={buttonStyle}
onClick={() => setPlaying(!playing)}>
  {playing ? "Pause" : "Play"}
</button>

<button
   style={{
    ...buttonStyle,
    backgroundColor: "#dc2626"
  }}
  onClick={() => {
    setPlaybackIndex(1);
    setPlaying(false);
  }}
>
  Reset
</button>

</div>

    {/* Minimap Section */}
<div
  style={{
    marginBottom: "10px",
    color: "#aaa",
    textAlign: "center",
    fontSize: "14px"
  }}
>
  {heatmapType === "none" &&
    "Shows player journeys and event locations."}

  {heatmapType === "traffic" &&
    "Shows areas with the highest player activity."}

  {heatmapType === "kills" &&
    "Shows combat hotspots across the match."}

  {heatmapType === "deaths" &&
    "Shows locations where players died."}
</div>

<h3
  style={{
    marginBottom: "10px",
    textAlign: "center"
  }}
>
  {selectedMap}
</h3>

    <div
  style={{
    display: "inline-flex",
    gap: "25px",
    padding: "12px 20px",
    border: "1px solid #444",
    borderRadius: "10px",
    backgroundColor: "#1e1e1e",
    marginBottom: "20px"
  }}
>



  <div>🔵 Human</div>
  <div>🔴 Kill</div>
  <div>🟢 Loot</div>
  <div>🟣 Storm</div>
  <div>⚫ Death</div>
</div>


    <div
    style={{
      display: "flex",
      justifyContent: "center", 
      border: "1px solid #444",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 0 10px rgba(0,0,0,0.4)"

    }}
    >
    <div
      style={{
        position: "relative",
        width: "700px"
      }}
    >
    <img
      src={getMapImage()}
      alt="minimap"
      width="700"
    />  
  
    {heatmapType === "none" &&
      eventFilter === "All" && (
    <svg
    width="700"
    height="700"
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      pointerEvents: "none"
    }}  
>
  
  
  
  {Object.entries(playerPaths).map(
    ([userId, points]) => {

      const isBot = /^\d+$/.test(userId);

      return (
        <polyline
          key={userId}
          points={points
            .map(
              p => `${p.x},${p.y}`
            )
            .join(" ")
          }
          fill="none"
          stroke={
            isBot
              ? "orange"
              : "yellow"
          }
          strokeWidth="2"
        />
      );
    }
  )}

  </svg>
  
)}




{heatmapType === "traffic" &&
  heatmapPoints.map((point, index) => (
    <div
      key={`heat-${index}`}
      style={{
        position: "absolute",
        left: `${point.x}px`,
        top: `${point.y}px`,
        width: "20px",
        height: "20px",
        backgroundColor: "rgba(255,0,0,0.15)",
        borderRadius: "50%",
        transform: "translate(-50%, -50%)"
      }}
    />
  ))
}
{heatmapType === "kills" &&
  killHeatmapPoints.map((point, index) => (
    <div
      key={`kill-${index}`}
      style={{
        position: "absolute",
        left: `${point.x}px`,
        top: `${point.y}px`,
        width: "25px",
        height: "25px",
        backgroundColor: "rgba(255,255,0,0.25)",
        borderRadius: "50%",
        transform: "translate(-50%, -50%)"
      }}
    />
  ))
}

{heatmapType === "deaths" &&
  deathHeatmapPoints.map((point, index) => (
    <div
      key={`death-${index}`}
      style={{
        position: "absolute",
        left: `${point.x}px`,
        top: `${point.y}px`,
        width: "25px",
        height: "25px",
        backgroundColor: "rgba(0, 0, 0, 0.97)",
        borderRadius: "50%",
        transform: "translate(-50%, -50%)"
      }}
    />
  ))
}

    

  {heatmapType === "none" &&
  filteredEvents.map((event, index) => {

    const pos = convertCoordinates(
      event.x,
      event.z,
      event.map_id
    );

    return (
      <div
        key={index}
        style={{
          position: "absolute",
          left: `${(pos.x / 1024) * 700}px`,
          top: `${(pos.y / 1024) * 700}px`,
          width: "6px",
          height: "6px",
          backgroundColor: getEventColor(event.event),
          borderRadius: "50%"
        }}
      />
    );
  })
}   

    </div>

  </div>
  </div>
);
}


export default App;