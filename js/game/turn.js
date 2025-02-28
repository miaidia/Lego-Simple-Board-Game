/**
 * Turn Manager
 * Handles game turns and player actions
 */
class TurnManager {
    constructor(board, character, dice) {
        this.board = board;
        this.character = character;
        this.dice = dice;
        this.gameState = 'ready'; // ready, rolling, moving, fighting, specialAbility, gameOver
        this.messageDisplay = document.getElementById('game-messages');
        
        // Listen for dice roll events
        document.addEventListener('diceRolled', (e) => this.handleDiceRoll(e.detail.result));
        
        // Track game progress
        this.turnCount = 0;
        this.enemiesDefeated = 0;
        this.usedSpecialAbilities = {
            droid: false // Track if droid has used healing (once per game)
        };
        
        // Set initial state
        this.startTurn();
    }
    
    startTurn() {
        if (this.gameState === 'gameOver') return;
        
        this.turnCount++;
        this.gameState = 'ready';
        this.clearAllTileListeners();
        this.board.resetAllHighlights();
        
        // Reset character's action points at the start of turn
        if (this.turnCount > 1) { // Don't reset on first turn
            this.character.resetActionPoints();
        }
        
        this.showMessage(`Turn ${this.turnCount} - Roll dice or use special ability`);
        this.dice.setEnabled(true);
        
        // Enable/disable special ability button based on action points
        document.getElementById('use-special').disabled = this.character.actionPoints <= 0;
    }
    
    handleDiceRoll(result) {
        if (this.gameState !== 'ready') return;
        
        this.gameState = 'rolling';
        
        if (result === 'sword') {
            this.showMessage('You rolled a sword! You can attack an adjacent enemy.');
            this.handleSwordRoll();
        } else if (result === 'foot') {
            this.showMessage('You rolled a foot! You can move 1 space.');
            this.handleFootRoll();
        }
    }
    
    handleSwordRoll() {
        // Check for adjacent enemies
        const adjacentEnemies = this.findAdjacentEnemies();
        
        if (adjacentEnemies.length > 0) {
            // Highlight enemy tiles
            adjacentEnemies.forEach(enemy => {
                this.board.highlightTile(enemy.x, enemy.z, 0xff0000); // Red highlight
            });
            
            // Add click listeners for attacking
            this.setupAttackListeners(adjacentEnemies);
        } else {
            this.showMessage('No enemies nearby to attack. Turn ends.');
            setTimeout(() => this.endTurn(), 1500);
        }
    }
    
    handleFootRoll() {
        // Find valid movement tiles (adjacent, not obstacles)
        const movementTiles = this.findValidMovementTiles();
        
        if (movementTiles.length > 0) {
            // Highlight movement tiles
            movementTiles.forEach(tile => {
                this.board.highlightTile(tile.x, tile.z, 0x00ff00); // Green highlight
            });
            
            // Add click listeners for movement
            this.setupMovementListeners(movementTiles);
        } else {
            this.showMessage('No valid moves available. Turn ends.');
            setTimeout(() => this.endTurn(), 1500);
        }
    }
    
    findAdjacentEnemies() {
        const { x, z } = this.character.position;
        const gridX = Math.round(x / CONFIG.board.tileSize);
        const gridZ = Math.round(z / CONFIG.board.tileSize);
        
        const adjacentPositions = [
            { x: gridX+1, z: gridZ },
            { x: gridX-1, z: gridZ },
            { x: gridX, z: gridZ+1 },
            { x: gridX, z: gridZ-1 }
        ];
        
        // For Clone Trooper, allow ranged attacks when using special ability
        if (this.character.type === 'clone' && this.gameState === 'specialAbility') {
            // Add diagonal positions and extended range for clone special
            adjacentPositions.push(
                { x: gridX+1, z: gridZ+1 },
                { x: gridX+1, z: gridZ-1 },
                { x: gridX-1, z: gridZ+1 },
                { x: gridX-1, z: gridZ-1 },
                { x: gridX+2, z: gridZ },
                { x: gridX-2, z: gridZ },
                { x: gridX, z: gridZ+2 },
                { x: gridX, z: gridZ-2 }
            );
        }
        
        return adjacentPositions.filter(pos => {
            const tileType = this.board.getTile(pos.x, pos.z);
            return tileType === CONFIG.board.tileTypes.ENEMY;
        });
    }
    
    findValidMovementTiles() {
        const { x, z } = this.character.position;
        const gridX = Math.round(x / CONFIG.board.tileSize);
        const gridZ = Math.round(z / CONFIG.board.tileSize);
        
        const adjacentPositions = [
            { x: gridX+1, z: gridZ },
            { x: gridX-1, z: gridZ },
            { x: gridX, z: gridZ+1 },
            { x: gridX, z: gridZ-1 }
        ];
        
        // For Jedi using special ability, allow 2 spaces movement
        if (this.character.type === 'jedi' && this.gameState === 'specialAbility') {
            adjacentPositions.push(
                { x: gridX+2, z: gridZ },
                { x: gridX-2, z: gridZ },
                { x: gridX, z: gridZ+2 },
                { x: gridX, z: gridZ-2 },
                { x: gridX+1, z: gridZ+1 },
                { x: gridX+1, z: gridZ-1 },
                { x: gridX-1, z: gridZ+1 },
                { x: gridX-1, z: gridZ-1 }
            );
        }
        
        return adjacentPositions.filter(pos => {
            const tileType = this.board.getTile(pos.x, pos.z);
            // Can move to empty, start, goal, quicksand, or event tiles
            return tileType !== null && tileType !== CONFIG.board.tileTypes.OBSTACLE && tileType !== CONFIG.board.tileTypes.ENEMY;
        });
    }
    
    setupAttackListeners(enemies) {
        this.gameState = 'fighting';
        
        // Create one-time click handlers for each enemy tile
        enemies.forEach(enemy => {
            const tileObject = this.board.getTileObject(enemy.x, enemy.z);
            
            if (tileObject) {
                // Use userData to store the handler for later cleanup
                tileObject.userData.clickHandler = () => {
                    this.attackEnemy(enemy);
                    // Remove all click handlers
                    this.clearAllTileListeners();
                };
                
                // Add the click event
                tileObject.addEventListener('click', tileObject.userData.clickHandler);
            }
        });
    }
    
    setupMovementListeners(tiles) {
        this.gameState = 'moving';
        
        // Create one-time click handlers for each movement tile
        tiles.forEach(tile => {
            const tileObject = this.board.getTileObject(tile.x, tile.z);
            
            if (tileObject) {
                // Use userData to store the handler for later cleanup
                tileObject.userData.clickHandler = () => {
                    this.moveCharacter(tile);
                    // Remove all click handlers
                    this.clearAllTileListeners();
                };
                
                // Add the click event
                tileObject.addEventListener('click', tileObject.userData.clickHandler);
            }
        });
    }
    
    clearAllTileListeners() {
        // Remove all click event handlers from tiles
        for (let z = 0; z < this.board.tileObjects.length; z++) {
            for (let x = 0; x < this.board.tileObjects[z].length; x++) {
                const tileObject = this.board.tileObjects[z][x];
                if (tileObject && tileObject.userData.clickHandler) {
                    tileObject.removeEventListener('click', tileObject.userData.clickHandler);
                    tileObject.userData.clickHandler = null;
                }
            }
        }
    }
    
    attackEnemy(enemy) {
        this.showMessage(`Attacking enemy at (${enemy.x}, ${enemy.z})!`);
        
        // Check for Jedi evasion if this is a counterattack
        if (this.gameState === 'counterattack' && this.character.type === 'jedi') {
            // 50% chance to evade (simulates rolling the die again and getting a sword)
            if (Math.random() < 0.5) {
                this.showMessage('Jedi special: You evaded the counterattack!');
                setTimeout(() => this.endTurn(), 1500);
                return;
            }
        }
        
        // Simple implementation - enemies are defeated in one hit
        // Replace enemy with empty tile
        this.board.tiles[enemy.z][enemy.x] = CONFIG.board.tileTypes.EMPTY;
        
        // Remove enemy model and create new empty tile
        const oldTile = this.board.tileObjects[enemy.z][enemy.x];
        this.board.boardObject.remove(oldTile);
        
        const newTile = this.board.createTile(enemy.x, enemy.z, CONFIG.board.tileTypes.EMPTY);
        this.board.tileObjects[enemy.z][enemy.x] = newTile;
        this.board.boardObject.add(newTile);
        
        this.enemiesDefeated++;
        this.showMessage(`Enemy defeated! (${this.enemiesDefeated} total)`);
        
        // Check for victory (all enemies defeated or reached goal)
        if (this.checkForVictory()) {
            this.gameState = 'gameOver';
            this.showMessage('Victory! Mission accomplished!');
        } else {
            // End turn
            setTimeout(() => this.endTurn(), 1500);
        }
    }
    
    moveCharacter(tile) {
        this.showMessage(`Moving to (${tile.x}, ${tile.z})`);
        
        // Convert from grid to world coordinates
        const worldX = tile.x * CONFIG.board.tileSize;
        const worldZ = tile.z * CONFIG.board.tileSize;
        
        // Move character
        this.character.moveTo(worldX, worldZ);
        
        // Check for special tile interactions
        this.handleTileInteraction(tile);
    }
    
    handleTileInteraction(tile) {
        const tileType = this.board.getTile(tile.x, tile.z);
        
        switch (tileType) {
            case CONFIG.board.tileTypes.GOAL:
                this.showMessage('You reached the goal!');
                this.gameState = 'gameOver';
                setTimeout(() => {
                    this.showMessage('Victory! Mission accomplished!');
                }, 1000);
                break;
                
            case CONFIG.board.tileTypes.QUICKSAND:
                this.showMessage('You entered quicksand! Roll dice to escape...');
                // In a complete implementation, would require a foot roll to escape
                // For now, just apply a movement penalty
                this.dice.roll();
                break;
                
            case CONFIG.board.tileTypes.EVENT:
                this.triggerRandomEvent();
                break;
                
            default:
                // End turn after a delay for normal tiles
                setTimeout(() => this.endTurn(), 1500);
                break;
        }
    }
    
    triggerRandomEvent() {
        const events = [
            'A sandstorm approaches! Move back 1 space.',
            'You found supplies! Gain 1 health.',
            'Enemy ambush! Lose 1 health.',
            'You found a shortcut! Move forward 1 space.',
            'The force is with you! Gain 1 action point.',
            'Dangerous terrain! Skip your next turn.'
        ];
        
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        this.showMessage(`Event: ${randomEvent}`);
        
        // Handle event effects in a complete implementation
        setTimeout(() => this.endTurn(), 2000);
    }
    
    checkForVictory() {
        // Victory conditions:
        // 1. All enemies defeated, or
        // 2. Reached the goal tile
        
        // Check if player is on goal tile
        const { x, z } = this.character.position;
        const gridX = Math.round(x / CONFIG.board.tileSize);
        const gridZ = Math.round(z / CONFIG.board.tileSize);
        const currentTile = this.board.getTile(gridX, gridZ);
        
        if (currentTile === CONFIG.board.tileTypes.GOAL) {
            return true;
        }
        
        // Check if all enemies are defeated
        let enemyCount = 0;
        for (let z = 0; z < this.board.tiles.length; z++) {
            for (let x = 0; x < this.board.tiles[z].length; x++) {
                if (this.board.tiles[z][x] === CONFIG.board.tileTypes.ENEMY) {
                    enemyCount++;
                }
            }
        }
        
        return enemyCount === 0;
    }
    
    handleSpecialAbility() {
        if (this.character.actionPoints <= 0) {
            this.showMessage('Not enough action points!');
            return;
        }
        
        switch (this.character.type) {
            case 'jedi':
                this.handleJediSpecial();
                break;
                
            case 'droid':
                this.handleDroidSpecial();
                break;
                
            case 'clone':
                this.handleCloneSpecial();
                break;
        }
    }
    
    handleJediSpecial() {
        this.showMessage('Using Jedi movement ability! Move up to 2 spaces.');
        this.gameState = 'specialAbility';
        
        // Use an action point
        this.character.useActionPoint();
        
        // Find extended movement options
        const movementTiles = this.findValidMovementTiles();
        
        if (movementTiles.length > 0) {
            // Highlight movement tiles
            movementTiles.forEach(tile => {
                this.board.highlightTile(tile.x, tile.z, 0x00ffff); // Cyan highlight
            });
            
            // Add click listeners for movement
            this.setupMovementListeners(movementTiles);
        } else {
            this.showMessage('No valid moves available. Turn ends.');
            setTimeout(() => this.endTurn(), 1500);
        }
    }
    
    handleDroidSpecial() {
        // Droid can repair 1 health once per game
        if (this.usedSpecialAbilities.droid) {
            this.showMessage('Repair ability already used this game!');
            return;
        }
        
        if (this.character.health >= this.character.maxHealth) {
            this.showMessage('Already at full health!');
            return;
        }
        
        this.showMessage('Using Droid repair ability! Gaining 1 health.');
        
        // Use an action point
        this.character.useActionPoint();
        
        // Heal the character
        this.character.heal(1);
        
        // Mark ability as used
        this.usedSpecialAbilities.droid = true;
        
        // End turn after a delay
        setTimeout(() => this.endTurn(), 1500);
    }
    
    handleCloneSpecial() {
        this.showMessage('Using Clone ranged attack ability! Attack enemies up to 2 spaces away.');
        this.gameState = 'specialAbility';
        
        // Use an action point
        this.character.useActionPoint();
        
        // Find enemies within range
        const enemies = this.findAdjacentEnemies();
        
        if (enemies.length > 0) {
            // Highlight enemy tiles
            enemies.forEach(enemy => {
                this.board.highlightTile(enemy.x, enemy.z, 0xff0000); // Red highlight
            });
            
            // Add click listeners for attacking
            this.setupAttackListeners(enemies);
        } else {
            this.showMessage('No enemies within range. Turn ends.');
            setTimeout(() => this.endTurn(), 1500);
        }
    }
    
    endTurn() {
        if (this.gameState === 'gameOver') return;
        
        this.startTurn();
    }
    
    showMessage(text) {
        const messageElement = document.createElement('div');
        messageElement.textContent = text;
        
        // Add new message at the top
        this.messageDisplay.insertBefore(messageElement, this.messageDisplay.firstChild);
        
        // Limit message history
        while (this.messageDisplay.childNodes.length > 10) {
            this.messageDisplay.removeChild(this.messageDisplay.lastChild);
        }
    }
} 