/**
 * Main Game Class
 * Initializes and manages the game
 */
class Game {
    constructor() {
        // Initialize renderer
        this.renderer = new Renderer();
        
        // Initialize scene
        this.gameScene = new Scene();
        
        // Initialize camera controls
        this.controls = new Controls(this.gameScene.camera, this.renderer.canvas);
        
        // Initialize board
        this.board = new GameBoard(this.gameScene.scene, 'tatooine');
        
        // Initialize dice
        this.dice = new Dice();
        
        // Set up character selection
        this.setupCharacterSelection();
        
        // Set up special ability button
        this.specialAbilityButton = document.getElementById('use-special');
        this.specialAbilityButton.addEventListener('click', () => this.useSpecialAbility());
        this.specialAbilityButton.disabled = true; // Disabled until game starts
        
        // Start animation loop
        this.animate();
    }
    
    setupCharacterSelection() {
        // Character selection elements
        this.characterSelection = document.getElementById('character-selection');
        this.characterOptions = document.querySelectorAll('.character-option');
        this.startGameButton = document.getElementById('start-game');
        
        // Selected character type (default: jedi)
        this.selectedCharacterType = CONFIG.characters.types.JEDI;
        
        // Add click handlers to character options
        this.characterOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove selected class from all options
                this.characterOptions.forEach(opt => opt.classList.remove('selected'));
                
                // Add selected class to clicked option
                option.classList.add('selected');
                
                // Set selected character type
                this.selectedCharacterType = option.getAttribute('data-type');
            });
        });
        
        // Select Jedi by default
        this.characterOptions[0].classList.add('selected');
        
        // Start game button handler
        this.startGameButton.addEventListener('click', () => {
            this.startGame(this.selectedCharacterType);
        });
    }
    
    startGame(characterType) {
        // Hide character selection
        this.characterSelection.style.display = 'none';
        
        // Find start position
        const startTile = this.board.findTileByType(CONFIG.board.tileTypes.START);
        if (!startTile) {
            console.error('No start tile found on the map!');
            return;
        }
        
        // Initialize character with selected type
        this.character = new Character(
            this.gameScene.scene, 
            characterType, 
            { x: startTile.x * CONFIG.board.tileSize, z: startTile.z * CONFIG.board.tileSize }
        );
        
        // Update character type display
        document.getElementById('character-type-value').textContent = 
            characterType.charAt(0).toUpperCase() + characterType.slice(1);
        
        // Update ability description based on character type
        const abilityDescription = document.getElementById('ability-description');
        switch(characterType) {
            case 'jedi':
                abilityDescription.textContent = 'Move 2 spaces';
                break;
            case 'droid':
                abilityDescription.textContent = 'Repair 1 health';
                break;
            case 'clone':
                abilityDescription.textContent = 'Range attack';
                break;
        }
        
        // Initialize turn manager
        this.turnManager = new TurnManager(this.board, this.character, this.dice);
        
        // Initialize HUD
        this.hud = new HUD(this.character);
        
        // Enable special ability button
        this.specialAbilityButton.disabled = false;
        
        // Initialize raycaster for mouse picking
        this.setupRaycaster();
        
        // Ensure action bar is visible
        document.getElementById('action-bar').style.display = 'flex';
    }
    
    useSpecialAbility() {
        if (this.character && this.turnManager && this.turnManager.gameState === 'ready') {
            this.turnManager.handleSpecialAbility();
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Update controls
        this.controls.update();
        
        // Render the scene
        this.renderer.render(this.gameScene.scene, this.gameScene.camera);
    }
    
    setupRaycaster() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        // Add event listener for mouse clicks
        this.renderer.canvas.addEventListener('click', (event) => this.onMouseClick(event));
        
        // Add event listener for mouse moves (for hover effects)
        this.renderer.canvas.addEventListener('mousemove', (event) => this.onMouseMove(event));
    }
    
    onMouseClick(event) {
        // Calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Update the picking ray with the camera and mouse position
        this.raycaster.setFromCamera(this.mouse, this.gameScene.camera);
        
        // Calculate objects intersecting the picking ray
        const intersects = this.raycaster.intersectObjects(this.gameScene.scene.children, true);
        
        // Process the first intersected object (if any)
        if (intersects.length > 0) {
            const object = this.findClickableParent(intersects[0].object);
            
            if (object && object.userData.clickHandler) {
                object.userData.clickHandler();
            }
        }
    }
    
    onMouseMove(event) {
        // For future enhancement: Add hover effects
    }
    
    findClickableParent(object) {
        // Traverse up the parent chain to find the tile object
        // that has a click handler
        let current = object;
        
        while (current) {
            if (current.userData && current.userData.clickHandler) {
                return current;
            }
            current = current.parent;
        }
        
        return null;
    }
}

// Initialize the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create game instance
    const game = new Game();
    
    // Add game to window for debugging
    window.game = game;
}); 