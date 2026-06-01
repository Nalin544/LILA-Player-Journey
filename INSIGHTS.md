# Insights

## Insight 1: Combat Is Dominated by Bots

### What caught my eye

Almost all combat interactions in the dataset involve bots rather than human players.

### Evidence

Event counts:

* BotKill: 2,415
* BotKilled: 700
* Kill: 3
* Killed: 3

Bot-related combat events outnumber human-versus-human combat by a very large margin.

### Actionable Interpretation

Players appear to spend most of their time fighting AI-controlled opponents instead of other human players.

Possible actions:

* Review player density and matchmaking.
* Increase opportunities for player-to-player encounters.
* Adjust bot spawn rates in highly populated areas.

### Why a Level Designer Should Care

Combat drives player engagement. If most encounters are against bots, map layout and encounter design may not be creating enough opportunities for meaningful player-versus-player interactions.

---

## Insight 2: Loot Interaction Is One of the Most Frequent Player Activities

### What caught my eye

Loot-related events occur very frequently throughout the dataset.

### Evidence

Event counts:

* Loot: 12,885
* Position: 51,347
* BotPosition: 21,712

Loot events are the third most common event type after movement events, indicating that resource collection is a major part of player behavior.

### Actionable Interpretation

Players spend a significant amount of time exploring and interacting with loot locations.

Possible actions:

* Analyze heatmaps to identify overused and underused loot zones.
* Redistribute high-value loot to encourage movement into less-visited areas.
* Improve risk-versus-reward balance by placing valuable loot in contested locations.

### Why a Level Designer Should Care

Loot placement directly influences player movement. Understanding where players consistently collect loot can help designers create better map flow and encourage exploration of underutilized areas.

---

## Insight 3: Storm Eliminations Are Rare

### What caught my eye

Very few players are eliminated by the storm compared to combat-related eliminations.

### Evidence

Event counts:

* KilledByStorm: 39
* BotKill: 2,415
* BotKilled: 700

Storm deaths represent only a small fraction of total eliminations.

### Actionable Interpretation

Most players successfully rotate into safe zones before the storm becomes a major threat.

Possible actions:

* Increase storm pressure in later phases.
* Experiment with zone timing and movement speed.
* Create more terrain obstacles around safe-zone transitions.

### Why a Level Designer Should Care

The storm is intended to influence movement and create tension. If storm eliminations are extremely rare, the mechanic may not be significantly affecting player decision-making.

---

## Overall Summary

The dataset suggests three major gameplay patterns:

1. Combat is heavily bot-driven.
2. Loot collection is a core player activity and strongly influences movement.
3. Storm mechanics have relatively little impact on player eliminations compared to combat encounters.

These findings can help Level Designers improve player engagement, encounter frequency, map flow, and overall gameplay balance.
