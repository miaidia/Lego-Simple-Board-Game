/**
 * Game Scene
 * Sets up and manages the Three.js scene, camera, and lighting
 */
class Scene {
    constructor() {
        // Create scene
        this.scene = new THREE.Scene();
        
        // Add a deep space background
        this.scene.background = new THREE.Color(0x000022); // Slightly more blue for better visibility
        
        // Add subtle fog for depth perception (reduced distance for a more intimate space)
        this.scene.fog = new THREE.Fog(0x000022, 25, 40); // Dark blue-black fog
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            60, // Field of view
            window.innerWidth / window.innerHeight, // Aspect ratio
            0.1, // Near clipping plane
            1000 // Far clipping plane
        );
        
        // Set camera position and orientation based on config
        this.camera.position.set(
            CONFIG.camera.position.x,
            CONFIG.camera.position.y,
            CONFIG.camera.position.z
        );
        this.camera.lookAt(
            CONFIG.camera.lookAt.x,
            CONFIG.camera.lookAt.y,
            CONFIG.camera.lookAt.z
        );
        
        // Add stars to the background first (so they're behind everything)
        this.createGalaxyBackground();
        
        // Add lights after stars
        this.setupLights();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    setupLights() {
        // Ambient light for general illumination
        const ambientLight = new THREE.AmbientLight(0x333355, 0.6); // Increased ambient for better visibility
        this.scene.add(ambientLight);
        
        // Main directional light (distant sun)
        const sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
        sunLight.position.set(10, 20, 10);
        sunLight.castShadow = true;
        
        // Configure shadow properties
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 50;
        sunLight.shadow.camera.left = -15;
        sunLight.shadow.camera.right = 15;
        sunLight.shadow.camera.top = 15;
        sunLight.shadow.camera.bottom = -15;
        
        this.scene.add(sunLight);
        
        // Add a blue point light for space atmosphere
        const bluePointLight = new THREE.PointLight(0x3366ff, 0.6, 20);
        bluePointLight.position.set(-8, 5, -8);
        this.scene.add(bluePointLight);
        
        // Add a purple point light for more galactic feeling
        const purplePointLight = new THREE.PointLight(0x9933ff, 0.5, 15);
        purplePointLight.position.set(8, 3, 8);
        this.scene.add(purplePointLight);
        
        // Add a subtle red point light underneath
        const redPointLight = new THREE.PointLight(0xff3333, 0.3, 12);
        redPointLight.position.set(4, -5, 4); // Under the board center
        this.scene.add(redPointLight);
    }
    
    createGalaxyBackground() {
        // Create stars in the full sphere around the scene, including below the board
        this.createStarLayer(2000, 0.15, 15, 40); // Closer, larger stars
        this.createStarLayer(3000, 0.08, 30, 60); // More distant background stars
        this.createBrightStars(80); // Add more bright stars
        this.createNebulae(); // Add nebula effects
    }
    
    createStarLayer(count, size, minDist, maxDist) {
        // Create a particle system for stars
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: size,
            sizeAttenuation: true
        });
        
        // Generate random star positions in a full sphere around the scene
        const positions = new Float32Array(count * 3);
        
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            // Create stars all around, including below the board
            const radius = minDist + Math.random() * (maxDist - minDist);
            const theta = Math.random() * Math.PI * 2; // Around
            const phi = Math.random() * Math.PI * 2; // Full sphere (not just half)
            
            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.cos(phi);
            positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(stars);
    }
    
    createBrightStars(count) {
        // Add some brighter, colored stars for visual interest
        const colors = [0xffffff, 0xffffaa, 0xaaaaff, 0xffaaaa, 0xaaffaa];
        
        for (let i = 0; i < count; i++) {
            // Create a small sphere for each bright star
            const geometry = new THREE.SphereGeometry(0.05 + Math.random() * 0.15, 8, 8);
            const material = new THREE.MeshBasicMaterial({
                color: colors[Math.floor(Math.random() * colors.length)],
                emissive: 0xffffff,
                emissiveIntensity: 1
            });
            
            const star = new THREE.Mesh(geometry, material);
            
            // Position randomly in a complete sphere
            const radius = 10 + Math.random() * 20;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI * 2; // Full sphere
            
            star.position.x = radius * Math.sin(phi) * Math.cos(theta);
            star.position.y = radius * Math.cos(phi);
            star.position.z = radius * Math.sin(phi) * Math.sin(theta);
            
            this.scene.add(star);
        }
    }
    
    createNebulae() {
        // Create a few colorful nebula clouds using sprite particles
        this.createNebula(0x3355ff, 10, 4, -8, -7); // Blue nebula
        this.createNebula(0xff33aa, 8, -6, 4, -5);  // Magenta nebula
        this.createNebula(0x33aaff, 12, 10, -4, -8); // Cyan nebula
    }
    
    createNebula(color, size, x, y, z) {
        // Create a sprite material for the nebula
        const spriteMaterial = new THREE.SpriteMaterial({
            color: color,
            transparent: true,
            opacity: 0.2,
            blending: THREE.AdditiveBlending
        });
        
        // Create several sprites with the same material but different sizes and positions
        for (let i = 0; i < 5; i++) {
            const sprite = new THREE.Sprite(spriteMaterial);
            
            // Random size variations
            const scale = size * (0.5 + Math.random() * 0.5);
            sprite.scale.set(scale, scale, 1);
            
            // Random position variations around the center point
            sprite.position.set(
                x + (Math.random() * 6 - 3),
                y + (Math.random() * 6 - 3),
                z + (Math.random() * 6 - 3)
            );
            
            this.scene.add(sprite);
        }
    }
    
    onWindowResize() {
        // Update camera aspect ratio
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }
    
    add(object) {
        this.scene.add(object);
    }
    
    remove(object) {
        this.scene.remove(object);
    }
} 