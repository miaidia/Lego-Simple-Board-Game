/**
 * Game Renderer
 * Sets up and manages the Three.js renderer
 */
class Renderer {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0x000000);
        this.renderer.shadowMap.enabled = true;
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    onWindowResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        
        // Update renderer
        this.renderer.setSize(this.width, this.height);
    }
    
    render(scene, camera) {
        this.renderer.render(scene, camera);
    }
} 