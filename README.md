# Multiplayer Tower Defense Game

A real-time multiplayer tower defense game inspired by "Sinh Tử Môn" from Zingplay. This is a personal project showcasing advanced algorithm implementations and real-time multiplayer game development.

## 🎯 Key Technical Highlights

This project features **sophisticated algorithm implementations** designed and built from scratch:
- **Modified Dijkstra's Algorithm** with custom Min Heap Priority Queue for dynamic longest path finding (provides strategic tower placement guidance)
- **BFS (Breadth-First Search)** for path validation and obstacle placement
- **Cell-based Spatial Partitioning** for optimized object queries (O(1) lookup)
- **Multi-criteria Target Selection** algorithms for intelligent tower targeting
- **Custom Data Structures** (Priority Queue, Queue, Stack) implemented without external dependencies
- **Dynamic Path Recalculation** system that updates longest path in real-time as game state changes

All algorithms are optimized for real-time performance with pre-computation and spatial optimization techniques.

## 🎮 Game Overview

**Multiplayer Tower Defense** is an online 2D strategy game designed for mobile platforms. Two players compete in real-time battles where they must strategically place towers, summon monsters, and cast spells to defend their base while attacking their opponent's base.

### Game Features

- **Real-time Multiplayer Battles**: 1v1 competitive matches with synchronized gameplay
- **Tower Defense Mechanics**: Strategic tower placement with various tower types (Attack, Buff, Support)
- **Card Collection System**: Collect, upgrade, and manage a deck of cards featuring towers, monsters, and spells
- **Monster Summoning**: Deploy monsters to attack your opponent's base
- **Spell System**: Cast powerful spells (Fire, Ice, Heal) to turn the tide of battle
- **Lobby System**: Complete lobby interface with card management, shop, chest opening, and inventory
- **Matching System**: Automated player matching for competitive gameplay
- **Dynamic Map Generation**: Procedurally generated battle maps with obstacles and terrain
- **Buff System**: Complex buff/debuff mechanics affecting towers, monsters, and players
- **Boss Battles**: Special boss monsters with unique abilities

### Game Genre
- **Type**: Tower Defense, Strategy, PvP
- **Graphics**: 2D
- **Perspective**: Top-down view
- **Platform**: Mobile (iOS/Android)

## 🎥 Demo Videos

### Lobby
https://github.com/phutruonnttn/Game_Multiplayer_Tower_Defense/assets/45969976/8c7c05b8-6568-4d1d-974b-4ab319ff4386

### In-Game Battle
https://github.com/phutruonnttn/Game_Multiplayer_Tower_Defense/assets/45969976/cd20aecd-189b-407a-b26e-3292970c10db

## 🛠️ Technology Stack

### Client-Side
- **Framework**: Cocos2d-x JavaScript (HTML5)
- **Language**: JavaScript (ES5)
- **Graphics**: 2D Sprite-based rendering
- **Networking**: Custom WebSocket client for real-time communication
- **Animation**: Atlas-based sprite animations and DragonBones

### Server-Side
- **Language**: Java
- **Framework**: BitZero Server (BZServer) - Game server framework
- **Architecture**: Event-driven, handler-based request processing
- **Data Storage**: Memcached for caching, database integration
- **Networking**: WebSocket server for client connections

## 📁 Project Structure

```
Game_Multiplayer_Tower_Defense/
├── client/                 # Client-side application (Cocos2d-x JS)
│   ├── src/               # Source code
│   │   ├── base/         # Base classes and utilities
│   │   ├── config/       # Game configuration files
│   │   ├── framework/    # Framework extensions and utilities
│   │   └── modules/      # Game modules
│   │       ├── battle/   # Battle system (logic & GUI)
│   │       ├── lobby/    # Lobby system
│   │       ├── login/    # Authentication
│   │       └── ...
│   ├── res/              # Game resources (sprites, sounds, configs)
│   └── frameworks/       # Cocos2d-x framework
│
├── server/                # Server-side application (Java)
│   ├── src/              # Source code
│   │   ├── battle/       # Battle logic and management
│   │   ├── cmd/          # Command handlers (request/response)
│   │   ├── config/       # Server configuration
│   │   ├── handler/      # Request handlers
│   │   ├── model/        # Data models
│   │   └── util/         # Utility classes
│   ├── conf/             # Server configuration files
│   └── lib/              # External libraries (JAR files)
│
├── config/                # Shared configuration files
│   ├── json/             # JSON game data (cards, monsters, towers)
│   └── *.xlsx            # Excel configuration files
│
└── docs/                  # Project documentation
    ├── Game Rules.docx
    ├── Battle Flow.docx
    └── ...
```

## 🏗️ Architecture

### Client Architecture
- **MVC Pattern**: Separation of logic (GameMgr, BattleMgr) and presentation (GUI, UI components)
- **Module System**: Modular design with separate managers for different game systems
- **Network Layer**: Custom networking layer with packet serialization/deserialization
- **Resource Management**: Centralized resource loading and sprite frame caching
- **State Management**: Screen-based navigation with state management

### Server Architecture
- **Handler-Based**: Request handlers for different command types (User, Battle, Matching)
- **Battle Loop**: Server-side game loop for battle synchronization
- **Action Queue**: Queue-based action system for battle actions
- **Synchronization**: Deterministic battle simulation with random seed synchronization
- **Data Persistence**: User data, cards, inventory, and progress management

### Key Systems

#### Battle System
- **Dual Game Managers**: Separate game managers for player and opponent
- **Synchronized Random**: Shared random seed for deterministic gameplay
- **Action Queue**: Queued action system for network synchronization
- **Turn-Based Monster Spawning**: Turn-based monster generation system
- **Real-time Combat**: Real-time tower attacks, bullet physics, and monster movement

#### Card System
- **Card Types**: Towers, Monsters, Spells (Potions)
- **Card Levels**: Upgradeable cards with stat progression
- **Deck Management**: Deck building and card collection
- **Card Skills**: Unique abilities per card type

#### Tower System
- **Tower Types**: 
  - Attack Towers (Bear, Bunny, Crow, Frog, Owl)
  - Buff Towers (Goat, Snake)
  - Support Towers
- **Tower Upgrades**: In-battle tower upgrades
- **Target Selection**: Priority-based target selection system

#### Monster System
- **Monster Types**: Various monster types with unique abilities
- **Boss Monsters**: Special bosses (Dark Giant, Ninja, Satyr) with abilities
- **Buff System**: Complex buff/debuff system affecting monsters
- **Pathfinding**: Monster pathfinding and movement

## 🧮 Core Algorithms & Data Structures

This project implements several sophisticated algorithms and data structures to handle complex game mechanics, particularly in the battle system. All algorithms were designed and implemented from scratch to optimize performance and ensure deterministic gameplay.

### Pathfinding Algorithms

#### 1. **Modified Dijkstra's Algorithm** (Dynamic Longest Path Finding for Strategic Guidance)
- **Purpose**: Calculate the **longest path** from every cell to the target point to provide strategic guidance to players on optimal tower placement
- **Core Gameplay Mechanic**: Longer paths = more time for towers to attack monsters = better strategic positioning
- **Implementation**: 
  - Custom Min Heap Priority Queue implementation
  - **Modified to find longest path** by reversing optimization logic (maximize path length instead of minimize)
  - Cost function that penalizes turns (straight movement vs. turning)
  - **Dynamic recalculation**: Path table recalculated whenever towers are placed or monsters move into cells
  - Pre-computed distance table (`stepCountFromTarget`) for O(1) path queries after recalculation
- **Location**: `MapLogic.getStepCountTableFromTarget()`
- **Complexity**: O(V log V + E) per recalculation, where V = number of cells, E = edges
- **Key Features**:
  - **Strategic path suggestion**: Provides longest path information to guide players on optimal tower placement
  - **Real-time updates**: Dynamically recalculates when game state changes (tower placement, monster movement)
  - Different costs for straight movement vs. turning (prevents zigzag paths)
  - Supports multiple parent nodes for path reconstruction
  - **Dynamic obstacle handling**: When a tower is placed, the algorithm recalculates to find the new longest path around obstacles
  - Used as foundation for both monster pathfinding and player strategic guidance

#### 2. **Breadth-First Search (BFS)** (Path Existence Validation)
- **Purpose**: Verify if a valid path exists from starting point to target after placing obstacles
- **Implementation**: 
  - Queue-based BFS traversal
  - Used when players place towers to ensure monsters can still reach the base
- **Location**: `MapLogic.isExistPathOfMonster()`
- **Complexity**: O(V + E) for grid-based graph
- **Use Case**: Prevents players from blocking the entire path to the base

#### 3. **Smart Pathfinding with Priority Direction**
- **Purpose**: Determine next movement point for monsters with direction priority
- **Implementation**:
  - Combines Dijkstra distance table with direction-based heuristics
  - Prioritizes maintaining current direction to reduce zigzag movement
  - Falls back to shortest path when priority direction is blocked
- **Location**: `MapLogic.getNextPointOfMonster()`
- **Key Features**:
  - Direction priority system (vertical/horizontal movement preference)
  - Smooth path following with minimal direction changes
  - Dynamic path recalculation when obstacles are placed

### Data Structures

#### 1. **Min Heap Priority Queue**
- **Purpose**: Efficient priority queue for Dijkstra's algorithm
- **Implementation**: 
  - Custom implementation from scratch (no external libraries)
  - Array-based binary heap
  - O(log n) insert and extract-min operations
- **Location**: `dsa/PriorityQueue.js` and `dsa/PriorityQueue.java`
- **Features**:
  - Heapify operations for maintaining heap property
  - Optimized for pathfinding use case
  - Dual implementation (client & server) for consistency

#### 2. **Queue (FIFO)**
- **Purpose**: BFS traversal and action queuing
- **Implementation**: Array-based queue with O(1) enqueue/dequeue
- **Location**: `dsa/Queue.js` and `dsa/Queue.java`
- **Use Cases**: 
  - BFS pathfinding
  - Battle action queuing
  - Network packet buffering

#### 3. **Stack (LIFO)**
- **Purpose**: State management and backtracking
- **Implementation**: Array-based stack
- **Location**: `dsa/Stack.js`
- **Use Cases**: UI state management, undo/redo operations

#### 4. **Cell-Based Spatial Partitioning**
- **Purpose**: Efficient monster/tower lookup by position
- **Implementation**: 
  - Hash table mapping cell coordinates to cell objects
  - Each cell maintains list of monsters/towers in that area
- **Location**: `GameMgr.cellTable`
- **Benefits**:
  - O(1) lookup for objects in a cell
  - Efficient range queries for tower target selection
  - Reduces collision detection complexity

### Target Selection Algorithms

#### 1. **Multi-Criteria Target Selection**
Towers implement multiple target selection strategies:

- **Furthest Target**: Selects monster farthest from base (maximize damage before reaching base)
  - Algorithm: Linear scan with distance comparison
  - Location: `TowerLogicAttack._findTargetFurthest()`
  
- **Nearest Target**: Selects closest monster (quick elimination)
  - Algorithm: Linear scan with minimum distance
  - Location: `TowerLogicAttack._findTargetNearest()`
  
- **Full HP Target**: Selects monster with highest HP (focus fire on tanks)
  - Algorithm: Linear scan with maximum HP comparison
  - Location: `TowerLogicAttack._findTargetFullHp()`
  
- **Low HP Target**: Selects monster with lowest HP (finish off weak enemies)
  - Algorithm: Linear scan with minimum HP comparison
  - Location: `TowerLogicAttack._findTargetLowHp()`

**Optimization**: Uses cell-based spatial partitioning to only check monsters in range, reducing complexity from O(n) to O(k) where k = monsters in range.

### Cost Function Design

The pathfinding system uses a sophisticated cost function:
- **Straight Movement Cost**: Base cost for moving in same direction
- **Turn Cost**: Additional penalty for changing direction
- **Formula**: `total_cost = straight_cost + (is_turning ? turn_penalty : 0)`
- **Result**: Monsters prefer straight paths, reducing zigzag movement

### Longest Path Finding Modification for Strategic Guidance

The Dijkstra algorithm was **modified to find the longest path** for a unique gameplay purpose: **providing strategic guidance to players on optimal tower placement**.

**Game Design Rationale**:
- **Longer path = More attack time**: When monsters take longer routes, towers have more time to attack them
- **Strategic positioning**: Players need to know where to place towers to maximize monster travel distance
- **Dynamic adaptation**: As towers are placed and monsters move, the optimal path changes continuously

**Traditional Dijkstra**: Finds shortest path by minimizing cost
- Uses Min Heap Priority Queue
- Relaxation: `if (new_distance < current_distance) update()`

**Modified Dijkstra for Longest Path**:
- **Key Modification**: Reversed optimization logic to maximize path length
- **Implementation Approach**:
  - Modified comparison operators (maximize instead of minimize)
  - Adjusted cost function to favor longer paths
  - Maintains same O(V log V + E) complexity per calculation
- **Dynamic Recalculation**:
  - Path table recalculated when towers are placed (obstacles added)
  - Path table recalculated when monsters enter new cells
  - Real-time updates ensure players always have current strategic information
- **Challenge**: Longest path problem in graphs is generally NP-hard, but in acyclic grid-based graphs (like tower defense maps), it can be solved efficiently with modified Dijkstra

**Technical Details**:
- The modification allows the algorithm to find paths that maximize distance/cost rather than minimize it
- **Dynamic obstacle integration**: When a tower is placed, the algorithm immediately recalculates to find the new longest path around the new obstacle
- This enables strategic path selection where players can see which tower placements will create the longest monster routes
- The same data structures (Priority Queue) are reused, but with inverted comparison logic
- **Performance optimization**: Despite frequent recalculations, the algorithm remains efficient due to grid-based structure and pre-computation techniques

### Algorithm Integration in Battle System

1. **Map Initialization**: 
   - Modified Dijkstra's algorithm pre-computes longest path distance table on map load
   - BFS validates path existence when obstacles are added

2. **Dynamic Path Recalculation**:
   - **When tower is placed**: Modified Dijkstra recalculates longest path table to reflect new obstacle
   - **When monster enters new cell**: Path table may be recalculated to update strategic guidance
   - **Real-time strategic updates**: Players always see current optimal tower placement suggestions based on longest path

3. **Monster Movement**:
   - Each frame, monsters query `getNextPointOfMonster()` 
   - Uses pre-computed distance table + direction priority
   - O(1) lookup for next movement point
   - Monsters follow the longest available path (strategic gameplay)

4. **Tower Target Selection**:
   - Cell-based spatial partitioning for range queries
   - Multi-criteria selection based on tower type
   - Optimized to only check monsters in range

5. **Obstacle Placement Validation**:
   - BFS validates path exists before allowing tower placement
   - Prevents players from blocking the entire path
   - After validation, modified Dijkstra recalculates to show new longest path

6. **Strategic Guidance System**:
   - Longest path information used to suggest optimal tower placement locations
   - Visual indicators show where towers should be placed for maximum monster travel time
   - Dynamic updates ensure suggestions remain accurate as game state changes

### Performance Optimizations

- **Pre-computation**: Distance tables computed once at map initialization
- **Efficient Recalculation**: Despite frequent dynamic recalculations (when towers placed/monsters move), algorithm remains efficient:
  - Grid-based structure enables fast updates
  - Only affected regions need recalculation in some cases
  - O(V log V + E) complexity acceptable for real-time gameplay
- **Spatial Partitioning**: Cell-based system reduces search space
- **Lazy Evaluation**: Target selection only when needed (frame-based delay)
- **Deterministic Random**: Synchronized random seeds for consistent behavior
- **Object Pooling**: Reuse of frequently created/destroyed objects
- **Smart Caching**: Path information cached until game state changes trigger recalculation

### Algorithm Complexity Summary

| Algorithm | Time Complexity | Space Complexity | Use Case |
|-----------|----------------|-------------------|----------|
| Modified Dijkstra's (Shortest) | O(V log V + E) | O(V) | Shortest path distance calculation |
| Modified Dijkstra's (Longest) | O(V log V + E) | O(V) | Longest path distance calculation |
| BFS | O(V + E) | O(V) | Path existence check |
| Target Selection | O(k) | O(1) | Tower targeting (k = monsters in range) |
| Cell Lookup | O(1) | O(V) | Spatial queries |
| Priority Queue | O(log n) | O(n) | Dijkstra support |

*V = vertices (cells), E = edges, k = objects in range, n = queue size*

## 🚀 Getting Started

### Prerequisites
- **Client**: Cocos2d-x JS framework, modern web browser or Cocos Creator
- **Server**: Java JDK 8+, BitZero Server framework
- **Database**: Memcached (for caching)
- **Build Tools**: Ant or Maven (for server), Cocos build tools (for client)

### Client Setup
1. Navigate to the `client/` directory
2. Ensure Cocos2d-x JS framework is properly configured
3. Configure server connection in `client/res/ipConfig.json`
4. Load the project in Cocos Creator or run via web server
5. The game will connect to the server on startup

### Server Setup
1. Navigate to the `server/` directory
2. Configure server settings in `server/config/`
3. Set up database connection and Memcached
4. Build the project using your Java build tool
5. Deploy the server extension
6. Start the BitZero Server with the extension loaded

### Configuration
- Game balance and data: Edit JSON files in `config/json/`
- Server settings: Modify `server/config/` files
- Client settings: Update `client/config.json` and resource files

## 🎯 Game Mechanics

### Battle Flow
1. **Matchmaking**: Players are matched based on skill/rank
2. **Deck Selection**: Players select their deck before battle
3. **Map Generation**: Procedurally generated maps for each player
4. **Battle Phase**: 
   - Players place towers on their map
   - Players summon monsters to attack opponent
   - Players cast spells for tactical advantage
   - Towers automatically attack monsters
   - First player to destroy opponent's base wins
5. **Rewards**: Victory rewards based on performance

### Card Mechanics
- **Energy System**: Cards cost energy to play
- **Card Rarity**: Different rarities affect card power
- **Upgrade System**: Cards can be upgraded using resources
- **Skill System**: Cards have unique active/passive skills

### Tower Mechanics
- **Placement**: Towers can be placed on specific cells
- **Target Priority**: Towers target based on priority (closest, strongest, etc.)
- **Upgrades**: Towers can be upgraded during battle
- **Buffs**: Towers can receive buffs from support towers

## 👥 Project

This project was developed by a **3-person team**.

**Project Lead**: Nguyen Phu Truong - Full project leadership and coordination

### Project Lead Responsibilities
- **Architecture Design**: Designed the overall system architecture and technical specifications
- **Algorithm Implementation**: Designed and implemented all core algorithms including:
  - Modified Dijkstra's algorithm for both shortest and longest path finding
  - BFS for path validation
  - Custom Priority Queue (Min Heap) from scratch
  - Cell-based spatial partitioning system
  - Multi-criteria target selection algorithms
- **Team Coordination**: Managed team workflow, code reviews, and integration
- **Feature Implementation**: Led implementation of critical game systems (battle logic, pathfinding, synchronization)
- **Project Delivery**: Ensured timely delivery and quality standards

*Note: This project was fully led and coordinated by the project lead, who was responsible for designing and implementing all core algorithms and data structures, as well as overseeing all aspects of development including architecture design, feature implementation, team coordination, and project delivery.*

## 📝 Development Notes

### Algorithm Implementation Highlights
- **Custom Data Structures**: All core data structures (Priority Queue, Queue, Stack) implemented from scratch without external dependencies
- **Modified Dijkstra Algorithm**: Extended Dijkstra's algorithm to find longest path (instead of shortest) by reversing optimization logic, enabling strategic tower placement guidance
- **Dynamic Path Recalculation**: System that recalculates longest path in real-time whenever towers are placed or monsters move, ensuring players always have current strategic information
- **Pathfinding System**: Sophisticated modified Dijkstra + BFS hybrid system for efficient monster pathfinding with O(1) lookup after pre-computation
- **Strategic Guidance**: Longest path algorithm provides real-time suggestions for optimal tower placement (longer paths = more attack time)
- **Spatial Optimization**: Cell-based spatial partitioning system for efficient object queries and collision detection
- **Deterministic Simulation**: Battle outcomes are deterministic using synchronized random seeds, ensuring fair multiplayer gameplay
- **Performance Optimization**: Despite frequent recalculations, the system remains efficient through grid-based structure optimization and smart caching

### Technical Achievements
- **Network Optimization**: Action queuing and batching for network efficiency
- **Performance**: Object pooling for frequently created/destroyed game objects
- **Localization**: Multi-language support system (Vietnamese/English)
- **Asset Management**: Efficient sprite frame caching and resource loading
- **Dual Implementation**: Critical algorithms implemented on both client and server for validation and consistency

## 📄 License

This is a personal project. Please refer to the license file for details.

## 🙏 Acknowledgments

- **Cocos2d-x** - Game engine framework
- **BitZero Server** - Server framework
- **Zingplay** - Original game inspiration (Sinh Tử Môn)

---

**Note**: This project demonstrates real-time multiplayer game development, client-server architecture, advanced algorithm implementations, and game system design.
