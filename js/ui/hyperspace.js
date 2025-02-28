/**
 * Simplified Hyperspace Effect
 * Creates a minimal Star Wars-inspired lightspeed effect with just a few white shooting stars
 */
class HyperspaceEffect {
    constructor() {
        this.canvas = document.getElementById('hyperspace-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas dimensions
        this.resizeCanvas();
        
        // Star properties - significantly reduced count
        this.stars = [];
        this.starCount = 50; // Reduced from 400 to 50
        this.starSpeed = 1.5;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        
        // Initialize stars
        this.initStars();
        
        // Bind animation frame and resize event
        this.animate = this.animate.bind(this);
        window.addEventListener('resize', this.resizeCanvas.bind(this));
        
        // Start animation
        this.animationId = requestAnimationFrame(this.animate);
        
        // Ensure the canvas is behind everything else
        this.canvas.style.zIndex = '-1';
    }
    
    resizeCanvas() {
        // Set canvas to full window size
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Update center coordinates
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        
        // Reinitialize stars if needed
        if (this.stars && this.stars.length > 0) {
            this.initStars();
        }
    }
    
    initStars() {
        this.stars = [];
        
        for (let i = 0; i < this.starCount; i++) {
            // Start stars at random positions further from center to avoid initial glitch
            const angle = Math.random() * Math.PI * 2;
            const distance = 100 + Math.random() * 200; // Start further away from center
            
            // Simplified star properties - no colors
            const star = {
                x: this.centerX + Math.cos(angle) * distance,
                y: this.centerY + Math.sin(angle) * distance,
                size: 1 + Math.random(), // Slightly larger for better visibility
                angle: angle
            };
            
            this.stars.push(star);
        }
    }
    
    drawStar(star) {
        // Get distance from center
        const dx = star.x - this.centerX;
        const dy = star.y - this.centerY;
        const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
        
        // Calculate simplified streak length
        const streakLength = Math.min(3, distanceFromCenter / 30);
        
        // Draw simple white streak
        this.ctx.beginPath();
        this.ctx.moveTo(star.x, star.y);
        this.ctx.lineTo(
            this.centerX - (this.centerX - star.x) * streakLength,
            this.centerY - (this.centerY - star.y) * streakLength
        );
        this.ctx.strokeStyle = '#ffffff'; // Just white
        this.ctx.lineWidth = star.size;
        this.ctx.stroke();
        
        // Draw simple white star point
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ffffff'; // Just white
        this.ctx.fill();
    }
    
    updateStar(star) {
        // Move star outward from center
        const dx = star.x - this.centerX;
        const dy = star.y - this.centerY;
        
        // Simple distance calculation
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Simpler speed logic - less acceleration
        const speedFactor = 1 + distance / 500;
        
        // Update position
        star.x += (dx / distance) * this.starSpeed * speedFactor;
        star.y += (dy / distance) * this.starSpeed * speedFactor;
        
        // Reset star if it goes off screen
        if (
            star.x < 0 || 
            star.x > this.canvas.width || 
            star.y < 0 || 
            star.y > this.canvas.height
        ) {
            // Reset to near center
            const angle = Math.random() * Math.PI * 2;
            const newDistance = 50 + Math.random() * 100;
            
            star.x = this.centerX + Math.cos(angle) * newDistance;
            star.y = this.centerY + Math.sin(angle) * newDistance;
            star.size = 1 + Math.random();
            star.angle = angle;
        }
    }
    
    animate() {
        // Clear canvas with solid black (no trails)
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw stars
        this.stars.forEach(star => {
            this.updateStar(star);
            this.drawStar(star);
        });
        
        // Continue animation
        this.animationId = requestAnimationFrame(this.animate);
    }
    
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
            
            // Clear canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Hide canvas
            this.canvas.style.display = 'none';
        }
    }
}

// Initialize effect when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create hyperspace effect when character selection is shown
    const hyperspaceEffect = new HyperspaceEffect();
    
    // Stop effect when game starts
    document.getElementById('start-game').addEventListener('click', () => {
        hyperspaceEffect.stop();
        
        // Make sure action bar is visible
        setTimeout(() => {
            const actionBar = document.getElementById('action-bar');
            if (actionBar) {
                actionBar.style.display = 'flex';
                console.log('Action bar display set to flex');
            } else {
                console.error('Action bar element not found');
            }
        }, 500);
    });
}); 