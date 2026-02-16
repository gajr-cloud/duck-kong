// Duck Kong - Mobile Game
// Wait for DOM to be ready before initializing

document.addEventListener('DOMContentLoaded', function() {
    console.log('Duck Kong initializing...');
    
    // Get all DOM elements
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    
    if (!canvas || !ctx) {
        console.error('Canvas not found!');
        return;
    }
    
    // Game state
    let selectedCharacter = null;
    let gameStarted = false;
    
    // Character stats
    const characters = {
        mallard: {
            name: 'Mallard Mac',
            speed: 3,
            jumpPower: 12,
            maxHealth: 3,
            color: '#2E8B57',
            specialCooldown: 30,
            special: 'invincibility'
        },
        mandarin: {
            name: 'Mandarin Ming',
            speed: 3.5,
            jumpPower: 15,
            maxHealth: 2,
            color: '#FF6347',
            specialCooldown: 20,
            special: 'doubleJump'
        },
        wood: {
            name: 'Wood Duck Woody',
            speed: 2.5,
            jumpPower: 12,
            maxHealth: 3,
            color: '#8B4513',
            specialCooldown: 15,
            special: 'dash'
        },
        runner: {
            name: 'Runner Duck Rosie',
            speed: 5,
            jumpPower: 10,
            maxHealth: 3,
            color: '#DDA0DD',
            specialCooldown: 25,
            special: 'panicRun'
        },
        buff: {
            name: 'Buff Bertha',
            speed: 2,
            jumpPower: 9,
            maxHealth: 4,
            color: '#DAA520',
            specialCooldown: 20,
            special: 'smash'
        },
        magpie: {
            name: 'Magpie Max',
            speed: 3.5,
            jumpPower: 12,
            maxHealth: 3,
            color: '#000000',
            specialCooldown: 25,
            special: 'reveal'
        }
    };
    
    console.log('Characters loaded:', Object.keys(characters));
    
    // Character selection with touch support
    document.querySelectorAll('.character-btn').forEach(btn => {
        const selectCharacter = (e) => {
            if (e) e.preventDefault();
            document.querySelectorAll('.character-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedCharacter = btn.dataset.char;
            console.log('Selected character:', selectedCharacter);
        };
        
        btn.addEventListener('click', selectCharacter);
        btn.addEventListener('touchend', selectCharacter);
    });
    
    // Start button
    const startBtn = document.getElementById('startBtn');
    const startGame = (e) => {
        if (e) e.preventDefault();
        
        console.log('Start button clicked, selected character:', selectedCharacter);
        
        if (!selectedCharacter) {
            alert('Please select a duck first!');
            return;
        }
        
        console.log('Starting game with', selectedCharacter);
        
        // Hide character selection
        document.getElementById('characterSelect').style.display = 'none';
        
        // Show game
        document.getElementById('gameCanvas').style.display = 'block';
        document.getElementById('gameInfo').style.display = 'block';
        document.getElementById('touchControls').style.display = 'block';
        document.getElementById('pauseBtn').style.display = 'block';
        
        // Update character name
        const charNameEl = document.getElementById('charName');
        if (charNameEl) {
            charNameEl.textContent = characters[selectedCharacter].name;
        }
        
        // Simple test - draw something on canvas
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, 800, 600);
        ctx.fillStyle = '#000';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Duck Kong - Loading...', 400, 300);
        ctx.fillText('Touch controls ready!', 400, 350);
        
        console.log('Game initialized!');
        
        // TODO: Initialize full game here
        alert('Game starting! (Full game logic will be added)');
    };
    
    if (startBtn) {
        startBtn.addEventListener('click', startGame);
        startBtn.addEventListener('touchend', startGame);
        console.log('Start button event listeners added');
    } else {
        console.error('Start button not found!');
    }
    
    console.log('Duck Kong ready!');
});
