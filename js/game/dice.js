/**
 * Game Dice
 * Handles dice rolling mechanics
 */
class Dice {
    constructor() {
        this.faces = CONFIG.dice.faces;
        this.symbols = CONFIG.dice.symbols;
        this.result = null;
        this.isRolling = false;
        
        // Set up UI elements
        this.rollButton = document.getElementById('roll-dice');
        this.resultDisplay = document.getElementById('dice-result');
        
        // Add event listener
        this.rollButton.addEventListener('click', () => this.roll());
    }
    
    roll() {
        if (this.isRolling) return;
        
        this.isRolling = true;
        this.rollButton.disabled = true;
        
        // Clear previous result
        this.resultDisplay.textContent = '';
        
        // Simulate rolling animation
        this.simulateRolling();
    }
    
    simulateRolling() {
        // Simple animation that changes the displayed value rapidly
        let counter = 0;
        const maxRolls = 10;
        const interval = 100; // ms
        
        const animate = () => {
            // Get random face
            const randomFace = this.faces[Math.floor(Math.random() * this.faces.length)];
            this.resultDisplay.textContent = this.symbols[randomFace];
            
            counter++;
            
            if (counter < maxRolls) {
                setTimeout(animate, interval);
            } else {
                // Final result
                this.finalizeRoll();
            }
        };
        
        animate();
    }
    
    finalizeRoll() {
        // Select the actual result
        const randomIndex = Math.floor(Math.random() * this.faces.length);
        this.result = this.faces[randomIndex];
        
        // Display final result
        this.resultDisplay.textContent = this.symbols[this.result];
        
        // Enable roll button
        this.rollButton.disabled = false;
        this.isRolling = false;
        
        // Dispatch event for game logic to handle
        this.dispatchRollResult();
    }
    
    dispatchRollResult() {
        // Create a custom event with the dice result
        const event = new CustomEvent('diceRolled', {
            detail: { result: this.result }
        });
        
        // Dispatch the event
        document.dispatchEvent(event);
    }
    
    getResult() {
        return this.result;
    }
    
    setEnabled(enabled) {
        this.rollButton.disabled = !enabled;
    }
} 