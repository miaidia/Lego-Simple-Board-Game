/**
 * Game Board
 * Creates and manages the 3D game board with different tile types
 */
class GameBoard {
    constructor(scene, mapName = 'tatooine') {
        this.scene = scene;
        this.mapName = mapName;
        this.size = CONFIG.board.size;
        this.tileSize = CONFIG.board.tileSize;
        this.map = CONFIG.board.maps[mapName];
        this.tiles = [];
        this.tileObjects = [];
        
        // Load textures
        this.loadTextures();
        
        // Initialize the board
        this.createBoard();
    }
    
    loadTextures() {
        // Create a texture loader
        this.textureLoader = new THREE.TextureLoader();
        
        // Load map texture
        this.mapTexture = this.textureLoader.load('MAPS/map_A3_Tatooine.png');
        
        // Load grid texture (optional)
        this.gridTexture = this.textureLoader.load('MAPS/map_A3_Grid.png');
    }
    
    createBoard() {
        // Create a parent object for the entire board
        this.boardObject = new THREE.Object3D();
        this.boardObject.position.set(0, 0, 0);
        
        // Create a grid of tiles
        for (let z = 0; z < this.size; z++) {
            this.tiles[z] = [];
            this.tileObjects[z] = [];
            
            for (let x = 0; x < this.size; x++) {
                const tileType = this.map[z][x];
                const tile = this.createTile(x, z, tileType);
                
                this.tiles[z][x] = tileType;
                this.tileObjects[z][x] = tile;
                this.boardObject.add(tile);
            }
        }
        
        // Add board to scene
        this.scene.add(this.boardObject);
        
        // Add a floor underneath the board with the map texture
        this.addFloor();
    }
    
    createTile(x, z, type) {
        // Create a group for the tile
        const tileGroup = new THREE.Group();
        tileGroup.position.set(
            x * this.tileSize,
            0,
            z * this.tileSize
        );
        
        // Create a base for the tile (a slightly smaller cube)
        const baseGeometry = new THREE.BoxGeometry(
            this.tileSize * 0.9,
            this.tileSize * 0.05,
            this.tileSize * 0.9
        );
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: CONFIG.board.tileColors[type],
            roughness: 0.7,
            metalness: 0.2,
            transparent: true,
            opacity: 0.4 // Reduced from 0.7 to 0.4 to make tiles more transparent
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 0.025; // Slightly above the floor
        base.castShadow = false;
        base.receiveShadow = true;
        
        tileGroup.add(base);
        
        // Add special features based on tile type
        if (type === CONFIG.board.tileTypes.OBSTACLE) {
            // Add a block for obstacles
            const obstacleGeometry = new THREE.BoxGeometry(
                this.tileSize * 0.6,
                this.tileSize * 0.6,
                this.tileSize * 0.6
            );
            const obstacleMaterial = new THREE.MeshStandardMaterial({
                color: 0x444444,
                roughness: 0.8,
                metalness: 0.2,
                transparent: true,
                opacity: 0.8 // Make obstacles slightly transparent too
            });
            const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
            obstacle.position.y = this.tileSize * 0.3;
            obstacle.castShadow = true;
            obstacle.receiveShadow = true;
            
            tileGroup.add(obstacle);
        } else if (type === CONFIG.board.tileTypes.ENEMY) {
            // Add a simple enemy marker (red cylinder)
            const enemyGeometry = new THREE.CylinderGeometry(
                this.tileSize * 0.2,
                this.tileSize * 0.2,
                this.tileSize * 0.4,
                8
            );
            const enemyMaterial = new THREE.MeshStandardMaterial({
                color: 0xff0000,
                roughness: 0.5,
                metalness: 0.3
            });
            const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
            enemy.position.y = this.tileSize * 0.25;
            enemy.castShadow = true;
            enemy.receiveShadow = true;
            
            tileGroup.add(enemy);
        }
        
        // Store the tile position for easy reference
        tileGroup.userData = {
            boardX: x,
            boardZ: z,
            type: type
        };
        
        return tileGroup;
    }
    
    addFloor() {
        // Calculate map size and position to align perfectly with grid
        const mapSize = 9; // The map has a 9x9 grid
        const floorSize = mapSize * this.tileSize;
        
        // Create a large floor plane that uses the map texture
        const floorGeometry = new THREE.PlaneGeometry(floorSize, floorSize);
        
        // Create a material with the map texture - enhanced brightness
        const floorMaterial = new THREE.MeshStandardMaterial({
            map: this.mapTexture,
            roughness: 0.7,
            metalness: 0.2,
            emissive: 0x222222,  // Slight emissive to make it glow a bit
            emissiveIntensity: 0.2
        });
        
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        
        // Rotate and position the floor to align with the grid
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -0.05; // Slightly below the tiles
        floor.position.x = (mapSize * this.tileSize) / 2 - this.tileSize / 2;
        floor.position.z = (mapSize * this.tileSize) / 2 - this.tileSize / 2;
        
        floor.receiveShadow = true;
        
        this.scene.add(floor);
        
        // Add a grid overlay
        if (this.gridTexture) {
            const gridGeometry = new THREE.PlaneGeometry(floorSize, floorSize);
            const gridMaterial = new THREE.MeshBasicMaterial({
                map: this.gridTexture,
                transparent: true,
                opacity: 0.4, // Slightly reduced from 0.5 to balance with the more transparent tiles
                depthWrite: false
            });
            
            const grid = new THREE.Mesh(gridGeometry, gridMaterial);
            grid.rotation.x = -Math.PI / 2;
            grid.position.y = -0.04; // Slightly above the floor
            grid.position.x = floor.position.x;
            grid.position.z = floor.position.z;
            
            this.scene.add(grid);
        }
        
        // Add subtle glow edges around the map
        this.addMapGlowEffect(floorSize, floor.position.x, floor.position.z);
    }
    
    addMapGlowEffect(floorSize, centerX, centerZ) {
        // Create a slightly larger plane for the glow effect around the map
        const glowSize = floorSize + 1.5; // Slightly larger than the map
        const glowGeometry = new THREE.PlaneGeometry(glowSize, glowSize);
        
        // Create a gradient material that fades from blue to transparent
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x0033ff,
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending // Makes it glow more
        });
        
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        
        // Position just below the map
        glow.rotation.x = -Math.PI / 2;
        glow.position.y = -0.06; // Just below the floor
        glow.position.x = centerX;
        glow.position.z = centerZ;
        
        this.scene.add(glow);
        
        // Add a second outer glow with different color
        const outerGlowSize = floorSize + 3; // Even larger 
        const outerGlowGeometry = new THREE.PlaneGeometry(outerGlowSize, outerGlowSize);
        
        const outerGlowMaterial = new THREE.MeshBasicMaterial({
            color: 0x6600ff, // Purple
            transparent: true,
            opacity: 0.1,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });
        
        const outerGlow = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);
        
        outerGlow.rotation.x = -Math.PI / 2;
        outerGlow.position.y = -0.07;
        outerGlow.position.x = centerX;
        outerGlow.position.z = centerZ;
        
        this.scene.add(outerGlow);
    }
    
    getTile(x, z) {
        if (x >= 0 && x < this.size && z >= 0 && z < this.size) {
            return this.tiles[z][x];
        }
        return null;
    }
    
    getTileObject(x, z) {
        if (x >= 0 && x < this.size && z >= 0 && z < this.size) {
            return this.tileObjects[z][x];
        }
        return null;
    }
    
    highlightTile(x, z, color = 0xffff00) {
        const tileObject = this.getTileObject(x, z);
        if (tileObject) {
            // Create a highlight effect (a ring around the tile)
            const highlightGeometry = new THREE.RingGeometry(
                this.tileSize * 0.4,
                this.tileSize * 0.5,
                16
            );
            const highlightMaterial = new THREE.MeshBasicMaterial({
                color: color,
                side: THREE.DoubleSide
            });
            const highlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
            
            // Rotate and position the highlight
            highlight.rotation.x = -Math.PI / 2;
            highlight.position.y = 0.05;
            
            // Remove any existing highlight
            this.clearHighlight(x, z);
            
            // Add the highlight and store a reference
            tileObject.add(highlight);
            tileObject.userData.highlight = highlight;
            
            return highlight;
        }
        return null;
    }
    
    clearHighlight(x, z) {
        const tileObject = this.getTileObject(x, z);
        if (tileObject && tileObject.userData.highlight) {
            tileObject.remove(tileObject.userData.highlight);
            tileObject.userData.highlight = null;
        }
    }
    
    clearAllHighlights() {
        for (let z = 0; z < this.size; z++) {
            for (let x = 0; x < this.size; x++) {
                this.clearHighlight(x, z);
            }
        }
    }
    
    findTileByType(type) {
        for (let z = 0; z < this.size; z++) {
            for (let x = 0; x < this.size; x++) {
                if (this.tiles[z][x] === type) {
                    return { x, z };
                }
            }
        }
        return null;
    }
} 