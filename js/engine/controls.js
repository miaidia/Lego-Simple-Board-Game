/**
 * Camera Controls
 * Sets up and manages the OrbitControls for camera movement
 */
class Controls {
    constructor(camera, canvas) {
        this.camera = camera;
        this.canvas = canvas;
        
        // Set up OrbitControls
        this.controls = new THREE.OrbitControls(this.camera, this.canvas);
        
        // Set the target to the center of the board
        this.controls.target.set(4, 0, 4);
        
        // Configure controls
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        
        // Limit zoom
        this.controls.minDistance = 5;
        this.controls.maxDistance = 20;
        
        // Limit rotation
        this.controls.maxPolarAngle = Math.PI / 2 - 0.1; // Prevent camera from going below the ground
        
        // Disable pan for simplicity in the prototype
        this.controls.enablePan = false;
    }
    
    update() {
        this.controls.update();
    }
} 