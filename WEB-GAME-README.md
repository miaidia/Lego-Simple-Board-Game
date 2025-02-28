# LEGO Star Wars RPG - Web Implementation

This is a 3D web-based implementation of the LEGO Star Wars RPG board game for children. The game is built using Three.js and vanilla JavaScript.

## Features

- 3D game board with interactive tiles
- Character movement and combat mechanics
- Dice rolling system
- Turn-based gameplay
- Special tile interactions (quicksand, events, etc.)
- Simple enemy AI

## Getting Started

### Prerequisites

- Node.js and npm installed on your system
- A modern web browser (Chrome, Firefox, Edge, etc.)

### Installation

1. Clone this repository or download the source code
2. Navigate to the project directory in your terminal
3. Install the required dependencies:

```bash
npm install
```

### Running the Game

Start the development server:

```bash
npm run dev
```

This will start a local development server on port 8080 with caching disabled.

Or run the production server:

```bash
npm start
```

Then open your browser and navigate to:

```
http://localhost:8080
```

## How to Play

1. Roll the dice by clicking the "Roll Dice" button
2. Depending on the result:
   - **Sword**: Attack adjacent enemies
   - **Foot**: Move to an adjacent tile
3. Complete the mission by defeating all enemies or reaching the goal

## Controls

- **Mouse**: Rotate the camera by clicking and dragging
- **Mouse Wheel**: Zoom in and out
- **Click**: Select tiles to move to or attack

## Game Mechanics

The game follows the simplified rules for children as described in the original board game:

- Characters have health and action points
- Dice rolls determine movement and combat actions
- Special abilities can be used by spending action points
- Different tile types have unique interactions

## Project Structure

```
lego-star-wars-rpg/
├── index.html              # Main entry point
├── package.json            # NPM package configuration
├── styles/                 # CSS files
│   └── main.css            # Main stylesheet
├── js/                     # JavaScript source files
│   ├── main.js             # Application entry point
│   ├── config.js           # Game configuration
│   ├── engine/             # Core engine components
│   │   ├── renderer.js     # Three.js setup and rendering
│   │   ├── scene.js        # Scene management
│   │   └── controls.js     # Camera and input controls
│   ├── game/               # Game-specific logic
│   │   ├── board.js        # Game board generation and management
│   │   ├── character.js    # Character class and logic
│   │   ├── dice.js         # Dice rolling mechanics
│   │   └── turn.js         # Turn management
│   └── ui/                 # User interface
│       └── hud.js          # Heads-up display
```

## Future Enhancements

- More detailed LEGO-style models for characters and board tiles
- Additional character types with unique abilities
- Multiple game scenarios/maps
- Sound effects and music
- Animation improvements
- Saving game progress
- Multiplayer support

## Credits

This web implementation is based on the LEGO Star Wars RPG board game rules designed for children ages 3 and up.

## License

This project is released under the Creative Commons license. See the LICENSE file for details. 