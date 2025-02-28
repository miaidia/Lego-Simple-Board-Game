/**
 * Game Character
 * Represents a player character with health, action points, and special abilities
 */
class Character {
    constructor(scene, type, position) {
        this.scene = scene;
        this.type = type; // 'jedi', 'droid', or 'clone'
        this.position = position; // { x, z }
        
        // Set character stats from config
        const stats = CONFIG.characters.stats[type];
        this.health = stats.health;
        this.maxHealth = stats.health;
        this.actionPoints = stats.actionPoints;
        this.maxActionPoints = stats.actionPoints;
        this.specialAbility = stats.specialAbility;
        
        // Create 3D model
        this.createModel();
        
        // Update UI with initial stats
        this.updateUI();
    }
    
    createModel() {
        // Create a LEGO-style character model
        this.characterGroup = new THREE.Group();
        
        // LEGO character dimensions
        this.headRadius = 0.15;
        const bodyWidth = 0.3;
        const bodyHeight = 0.4;
        const bodyDepth = 0.2;
        const legHeight = 0.2;
        const legWidth = 0.1;
        const armWidth = 0.1;
        
        // Colors based on character type
        let bodyColor, headColor, legColor;
        
        switch(this.type) {
            case 'jedi':
                // Jedi like Obi-Wan with brown robes
                bodyColor = 0x8B4513; // Brown robes
                headColor = 0xF5DEB3; // Wheat skin tone
                legColor = 0x8B4513; // Brown pants
                break;
                
            case 'droid':
                // Gold and silver like C-3PO
                bodyColor = 0xFFD700; // Gold
                headColor = 0xFFD700; // Gold
                legColor = 0xFFD700; // Gold
                break;
                
            case 'clone':
                // White armor like Clone Troopers
                bodyColor = 0xFFFFFF; // White
                headColor = 0xFFFFFF; // White helmet
                legColor = 0xFFFFFF; // White armor
                break;
                
            default:
                bodyColor = CONFIG.characters.colors[this.type];
                headColor = CONFIG.characters.colors[this.type];
                legColor = CONFIG.characters.colors[this.type];
        }
        
        // Create head (sphere)
        const headGeometry = new THREE.SphereGeometry(this.headRadius, 16, 16);
        const headMaterial = new THREE.MeshStandardMaterial({
            color: headColor,
            roughness: 0.3,
            metalness: this.type === 'droid' ? 0.8 : 0.1
        });
        this.head = new THREE.Mesh(headGeometry, headMaterial);
        this.head.position.y = bodyHeight + this.headRadius - 0.05; // Slightly overlap body
        this.head.castShadow = true;
        
        // Create body (box)
        const bodyGeometry = new THREE.BoxGeometry(bodyWidth, bodyHeight, bodyDepth);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: bodyColor,
            roughness: 0.5,
            metalness: this.type === 'droid' ? 0.8 : 0.1
        });
        this.body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        this.body.position.y = legHeight + bodyHeight/2;
        this.body.castShadow = true;
        
        // Create legs
        const legGeometry = new THREE.BoxGeometry(legWidth, legHeight, bodyDepth);
        const legMaterial = new THREE.MeshStandardMaterial({
            color: legColor,
            roughness: 0.5,
            metalness: this.type === 'droid' ? 0.8 : 0.1
        });
        
        // Left leg
        this.leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        this.leftLeg.position.set(-bodyWidth/4, legHeight/2, 0);
        this.leftLeg.castShadow = true;
        
        // Right leg
        this.rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        this.rightLeg.position.set(bodyWidth/4, legHeight/2, 0);
        this.rightLeg.castShadow = true;
        
        // Create arms
        const armGeometry = new THREE.BoxGeometry(armWidth, bodyHeight * 0.8, armWidth);
        const armMaterial = new THREE.MeshStandardMaterial({
            color: bodyColor,
            roughness: 0.5,
            metalness: this.type === 'droid' ? 0.8 : 0.1
        });
        
        // Left arm
        this.leftArm = new THREE.Mesh(armGeometry, armMaterial);
        this.leftArm.position.set(-bodyWidth/2 - armWidth/2, legHeight + bodyHeight/2, 0);
        this.leftArm.castShadow = true;
        
        // Right arm
        this.rightArm = new THREE.Mesh(armGeometry, armMaterial);
        this.rightArm.position.set(bodyWidth/2 + armWidth/2, legHeight + bodyHeight/2, 0);
        this.rightArm.castShadow = true;
        
        // Add all parts to character group
        this.characterGroup.add(this.head);
        this.characterGroup.add(this.body);
        this.characterGroup.add(this.leftLeg);
        this.characterGroup.add(this.rightLeg);
        this.characterGroup.add(this.leftArm);
        this.characterGroup.add(this.rightArm);
        
        // Add character-specific details
        this.addCharacterDetails();
        
        // Position the character
        this.updatePosition();
        
        // Add to scene
        this.scene.add(this.characterGroup);
    }
    
    addCharacterDetails() {
        switch(this.type) {
            case 'jedi':
                // Add a lightsaber
                this.addLightsaber();
                break;
                
            case 'droid':
                // Add droid details (like C-3PO's wires or R2-D2's panels)
                this.addDroidDetails();
                break;
                
            case 'clone':
                // Add a blaster
                this.addBlaster();
                break;
        }
    }
    
    addLightsaber() {
        // Create a lightsaber handle
        const handleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.15, 8);
        const handleMaterial = new THREE.MeshStandardMaterial({
            color: 0x888888,
            roughness: 0.3,
            metalness: 0.8
        });
        const handle = new THREE.Mesh(handleGeometry, handleMaterial);
        
        // Create the blade
        const bladeGeometry = new THREE.CylinderGeometry(0.02, 0.01, 0.4, 8);
        const bladeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00, // Green lightsaber
            emissive: 0x00ff00,
            emissiveIntensity: 1
        });
        const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
        blade.position.y = 0.25; // Position blade above handle
        
        // Create lightsaber group
        const lightsaber = new THREE.Group();
        lightsaber.add(handle);
        lightsaber.add(blade);
        
        // Position at the right hand
        lightsaber.position.set(
            this.rightArm.position.x,
            this.rightArm.position.y + 0.1,
            this.rightArm.position.z + 0.15
        );
        lightsaber.rotation.x = -Math.PI / 4; // Angle the lightsaber
        
        this.characterGroup.add(lightsaber);
    }
    
    addDroidDetails() {
        // For a droid like C-3PO or R2-D2, add appropriate details
        if (this.type === 'droid') {
            // Add eye details
            const eyeGeometry = new THREE.SphereGeometry(0.03, 8, 8);
            const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x00FFFF }); // Cyan
            
            const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
            leftEye.position.set(0.07, this.head.position.y, this.headRadius - 0.02);
            
            const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
            rightEye.position.set(-0.07, this.head.position.y, this.headRadius - 0.02);
            
            this.characterGroup.add(leftEye);
            this.characterGroup.add(rightEye);
        }
    }
    
    addBlaster() {
        // Create a blaster
        const blasterGeometry = new THREE.BoxGeometry(0.05, 0.15, 0.05);
        const blasterMaterial = new THREE.MeshStandardMaterial({
            color: 0x444444,
            roughness: 0.3,
            metalness: 0.8
        });
        const blaster = new THREE.Mesh(blasterGeometry, blasterMaterial);
        
        // Position at the right hand
        blaster.position.set(
            this.rightArm.position.x,
            this.rightArm.position.y,
            this.rightArm.position.z + 0.15
        );
        
        this.characterGroup.add(blaster);
    }
    
    updatePosition() {
        // Position the character on the board
        this.characterGroup.position.set(
            this.position.x,
            0, // On the ground
            this.position.z
        );
    }
    
    moveTo(x, z) {
        // Update position
        this.position = { x, z };
        
        // Animate movement
        this.animateMovement();
    }
    
    animateMovement() {
        // For prototype we'll simply update position
        // In a more complete version, add smooth animation
        this.updatePosition();
    }
    
    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
        
        // Update UI
        this.updateUI();
        
        // Check if character has died
        if (this.health <= 0) {
            // Game over logic would go here
            document.dispatchEvent(new CustomEvent('gameOver', { detail: { reason: 'defeat' } }));
        }
        
        return this.health;
    }
    
    useActionPoint() {
        if (this.actionPoints <= 0) return false;
        
        this.actionPoints--;
        
        // Update UI
        this.updateUI();
        
        // Disable special ability button if no action points left
        if (this.actionPoints <= 0) {
            document.getElementById('use-special').disabled = true;
        }
        
        return true;
    }
    
    resetActionPoints() {
        this.actionPoints = this.maxActionPoints;
        
        // Update UI
        this.updateUI();
        
        // Enable special ability button
        document.getElementById('use-special').disabled = false;
    }
    
    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
        
        // Update UI
        this.updateUI();
        
        return this.health;
    }
    
    useSpecialAbility() {
        if (this.useActionPoint()) {
            // Each character type has different special abilities
            switch(this.type) {
                case 'jedi':
                    // Jedi can move 2 spaces
                    console.log('Jedi special ability used');
                    return 'move2';
                    
                case 'droid':
                    // Droid can repair 1 health
                    this.heal(1);
                    console.log('Droid repair ability used');
                    return 'heal';
                    
                case 'clone':
                    // Clone can attack from a distance
                    console.log('Clone ranged attack ability used');
                    return 'rangedAttack';
                    
                default:
                    return null;
            }
        }
        return null;
    }
    
    flashModel(color) {
        // Store original colors
        const originalBodyColor = this.body.material.color.clone();
        const originalHeadColor = this.head.material.color.clone();
        
        // Change to flash color
        this.body.material.color.set(color);
        this.head.material.color.set(color);
        this.leftLeg.material.color.set(color);
        this.rightLeg.material.color.set(color);
        this.leftArm.material.color.set(color);
        this.rightArm.material.color.set(color);
        
        // Reset after a short delay
        setTimeout(() => {
            this.body.material.color.set(originalBodyColor);
            this.head.material.color.set(originalHeadColor);
            this.leftLeg.material.color.set(originalBodyColor);
            this.rightLeg.material.color.set(originalBodyColor);
            this.leftArm.material.color.set(originalBodyColor);
            this.rightArm.material.color.set(originalBodyColor);
        }, 300);
    }
    
    updateUI() {
        // Update health and action points display
        document.getElementById('health-value').textContent = this.health;
        document.getElementById('action-points-value').textContent = this.actionPoints;
        document.getElementById('character-type-value').textContent = 
            this.type.charAt(0).toUpperCase() + this.type.slice(1);
    }
} 