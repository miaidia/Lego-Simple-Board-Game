/**
 * Heads-Up Display
 * Manages UI elements and displays
 */
class HUD {
    constructor(character) {
        this.character = character;
        this.healthDisplay = document.getElementById('health-value');
        this.actionPointsDisplay = document.getElementById('action-points-value');
        this.messageDisplay = document.getElementById('game-messages');
    }
    
    updateHealth(value) {
        this.healthDisplay.textContent = value;
        
        // Visual indication if health is low
        if (value <= 1) {
            this.healthDisplay.style.color = '#ff0000'; // Red
        } else {
            this.healthDisplay.style.color = '#ffd700'; // Gold
        }
    }
    
    updateActionPoints(value) {
        this.actionPointsDisplay.textContent = value;
    }
    
    showMessage(message, duration = 0) {
        this.messageDisplay.textContent = message;
        
        // Optionally clear the message after a duration
        if (duration > 0) {
            setTimeout(() => {
                this.clearMessage();
            }, duration);
        }
    }
    
    clearMessage() {
        this.messageDisplay.textContent = '';
    }
} 