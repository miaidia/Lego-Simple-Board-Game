/**
 * Game Configuration
 * Contains all game settings and constants
 */
const CONFIG = {
    // Board settings
    board: {
        size: 9, // Updated from 8x8 to 9x9 grid
        tileSize: 1, // Size of each tile in 3D units
        tileTypes: {
            EMPTY: 0,
            START: 1,
            GOAL: 2,
            OBSTACLE: 3,
            ENEMY: 4,
            QUICKSAND: 5,
            EVENT: 6
        },
        tileColors: {
            0: 0xcccccc, // EMPTY - Light grey
            1: 0x00cc00, // START - Green
            2: 0x0000cc, // GOAL - Blue
            3: 0x666666, // OBSTACLE - Dark grey
            4: 0xcc0000, // ENEMY - Red
            5: 0xcccc00, // QUICKSAND - Yellow
            6: 0xff6600  // EVENT - Orange
        },
        // Initial tatooine rescue map layout (expanded to 9x9)
        maps: {
            tatooine: [
                [0, 0, 0, 3, 0, 0, 0, 0, 0],
                [1, 0, 0, 3, 0, 4, 0, 0, 0],
                [0, 0, 4, 0, 0, 0, 0, 0, 0],
                [0, 3, 3, 0, 5, 0, 0, 0, 0],
                [0, 0, 0, 0, 3, 0, 3, 0, 0],
                [0, 4, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 6, 0, 4, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 2, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]
        }
    },
    
    // Character settings
    characters: {
        types: {
            JEDI: 'jedi',
            DROID: 'droid',
            CLONE: 'clone'
        },
        stats: {
            jedi: {
                health: 3,
                actionPoints: 2,
                specialAbility: 'Move 2 spaces, can avoid an incoming attack'
            },
            droid: {
                health: 3,
                actionPoints: 2,
                specialAbility: 'Repair 1 lost health (once per game)'
            },
            clone: {
                health: 3,
                actionPoints: 2,
                specialAbility: 'Attack from a distance of 2 spaces'
            }
        },
        colors: {
            jedi: 0x7777ff,  // Blue
            droid: 0xffff77, // Yellow
            clone: 0xffffff  // White
        }
    },
    
    // Dice settings
    dice: {
        faces: ['sword', 'sword', 'sword', 'foot', 'foot', 'foot'],
        symbols: {
            sword: '🗡️',
            foot: '🦵'
        }
    },
    
    // Camera settings
    camera: {
        position: {
            x: 4,  // Center of the 9x9 grid
            y: 8,
            z: 13  // Looking from a distance
        },
        lookAt: {
            x: 4,  // Center of the 9x9 grid
            y: 0,
            z: 4   // Center of the 9x9 grid
        }
    }
}; 