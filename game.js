// Duck Kong - Mobile Game with Touch Controls
// Combined game logic and mobile integration

// Mobile Touch Controls Integration

// Touch state
const touchState = {
    left: false,
    right: false,
    jump: false,
    special: false
};

// Get touch control elements
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
const jumpBtn = document.getElementById('jumpBtn');
const specialBtn = document.getElementById('specialBtn');
const pauseBtn = document.getElementById('pauseBtn');
const touchControls = document.getElementById('touchControls');

// Show/hide touch controls
function showTouchControls() {
    touchControls.style.display = 'block';
    pauseBtn.style.display = 'block';
}

function hideTouchControls() {
    touchControls.style.display = 'none';
    pauseBtn.style.display = 'none';
}

// Touch event handlers
function handleTouchStart(button, action) {
    return (e) => {
        e.preventDefault();
        touchState[action] = true;
        button.style.background = 'rgba(255, 215, 0, 0.9)';
    };
}

function handleTouchEnd(button, action) {
    return (e) => {
        e.preventDefault();
        touchState[action] = false;
        button.style.background = 'rgba(255, 228, 181, 0.9)';
    };
}

// Set up touch controls
if (leftBtn && rightBtn && jumpBtn && specialBtn) {
    leftBtn.addEventListener('touchstart', handleTouchStart(leftBtn, 'left'));
    leftBtn.addEventListener('touchend', handleTouchEnd(leftBtn, 'left'));
    leftBtn.addEventListener('touchcancel', handleTouchEnd(leftBtn, 'left'));
    
    rightBtn.addEventListener('touchstart', handleTouchStart(rightBtn, 'right'));
    rightBtn.addEventListener('touchend', handleTouchEnd(rightBtn, 'right'));
    rightBtn.addEventListener('touchcancel', handleTouchEnd(rightBtn, 'right'));
    
    jumpBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        touchState.jump = true;
        jumpBtn.style.background = 'rgba(255, 215, 0, 0.9)';
    });
    jumpBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        touchState.jump = false;
        jumpBtn.style.background = 'rgba(255, 228, 181, 0.9)';
    });
    
    specialBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        touchState.special = true;
        specialBtn.style.background = 'rgba(255, 215, 0, 0.9)';
    });
    specialBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        touchState.special = false;
        specialBtn.style.background = 'rgba(255, 228, 181, 0.9)';
    });
}

// Pause button
if (pauseBtn) {
    pauseBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (typeof showPauseMenu === 'function') {
            showPauseMenu();
        }
    });
}

// Integrate touch controls with keyboard controls
// This will be merged into the game's input system
function getTouchInput() {
    return {
        left: touchState.left,
        right: touchState.right,
        jump: touchState.jump,
        special: touchState.special
    };
}

// Detect if we're on mobile
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Auto-show controls on mobile
if (isMobileDevice()) {
    // Touch controls will be shown when game starts
    console.log('Mobile device detected - touch controls enabled');
}

    
        // Game state
        let selectedCharacter = null;
        let gameStarted = false;
        
        // Canvas setup
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        
        // Character selection
        document.querySelectorAll('.character-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.character-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selectedCharacter = btn.dataset.char;
            });
        });
        
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
        
        // Game variables
        let player, platforms, obstacles, score, lives, keys, gameLoop;
        let specialActive = false;
        let specialTimer = 0;
        let canDoubleJump = false;
        let hasDoubleJumped = false;
        let currentLevel = 1;
        let breadcrumbs = [];
        let extraLives = [];
        let isPaused = false;
        
        // Show pause menu
        function showPauseMenu() {
            isPaused = true;
            clearInterval(gameLoop);
            
            const pauseDiv = document.createElement('div');
            pauseDiv.id = 'pauseMenu';
            pauseDiv.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                z-index: 1500;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: white;
            `;
            
            const title = document.createElement('h2');
            title.textContent = 'PAUSED';
            title.style.cssText = 'font-size: 48px; color: #FFD700; margin-bottom: 40px;';
            
            const buttonStyle = `
                background: #4169E1;
                color: white;
                border: 3px solid #1E40AF;
                padding: 15px 40px;
                font-size: 20px;
                font-weight: bold;
                cursor: pointer;
                border-radius: 8px;
                margin: 10px;
                transition: all 0.3s;
            `;
            
            const resumeBtn = document.createElement('button');
            resumeBtn.textContent = 'Resume Game';
            resumeBtn.style.cssText = buttonStyle.replace('#4169E1', '#32CD32').replace('#1E40AF', '#228B22');
            resumeBtn.onclick = () => {
                document.body.removeChild(pauseDiv);
                isPaused = false;
                gameLoop = setInterval(update, 1000/60);
            };
            
            const restartBtn = document.createElement('button');
            restartBtn.textContent = 'Restart This Level';
            restartBtn.style.cssText = buttonStyle;
            restartBtn.onclick = () => {
                document.body.removeChild(pauseDiv);
                isPaused = false;
                player.health = characters[selectedCharacter].maxHealth;
                loadLevel(currentLevel);
                gameLoop = setInterval(update, 1000/60);
            };
            
            const changeDuckBtn = document.createElement('button');
            changeDuckBtn.textContent = 'Change Duck';
            changeDuckBtn.style.cssText = buttonStyle.replace('#4169E1', '#9370DB');
            changeDuckBtn.onclick = () => {
                document.body.removeChild(pauseDiv);
                showDuckSelector();
            };
            
            const quitBtn = document.createElement('button');
            quitBtn.textContent = 'Quit to Menu';
            quitBtn.style.cssText = buttonStyle.replace('#4169E1', '#DC143C').replace('#1E40AF', '#8B0000');
            quitBtn.onclick = () => {
                location.reload();
            };
            
            pauseDiv.appendChild(title);
            pauseDiv.appendChild(resumeBtn);
            pauseDiv.appendChild(restartBtn);
            pauseDiv.appendChild(changeDuckBtn);
            pauseDiv.appendChild(quitBtn);
            
            document.body.appendChild(pauseDiv);
        }
        
        // Show duck selector mid-game
        function showDuckSelector() {
            const selectorDiv = document.createElement('div');
            selectorDiv.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
                z-index: 1500;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 40px;
                overflow-y: auto;
            `;
            
            const title = document.createElement('h2');
            title.textContent = 'Choose Your Duck';
            title.style.cssText = 'font-size: 36px; color: #FFD700; margin-bottom: 30px;';
            
            const grid = document.createElement('div');
            grid.style.cssText = 'display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 30px;';
            
            const ducks = [
                { char: 'mallard', name: 'Mallard Mac', desc: 'Balanced Hero' },
                { char: 'mandarin', name: 'Mandarin Ming', desc: 'High Jumper' },
                { char: 'wood', name: 'Wood Duck Woody', desc: 'Speed Burst' },
                { char: 'runner', name: 'Runner Duck Rosie', desc: 'Fastest Runner' },
                { char: 'buff', name: 'Buff Bertha', desc: 'Tank/Strong' },
                { char: 'magpie', name: 'Magpie Max', desc: 'Trickster' }
            ];
            
            ducks.forEach(duck => {
                const btn = document.createElement('button');
                btn.innerHTML = `🦆 ${duck.name}<br><small>${duck.desc}</small>`;
                btn.style.cssText = `
                    background: #FFE4B5;
                    border: 3px solid #8B4513;
                    padding: 15px;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: bold;
                    border-radius: 8px;
                    transition: all 0.2s;
                `;
                btn.onmouseover = () => {
                    btn.style.background = '#FFD700';
                    btn.style.transform = 'scale(1.05)';
                };
                btn.onmouseout = () => {
                    btn.style.background = '#FFE4B5';
                    btn.style.transform = 'scale(1)';
                };
                btn.onclick = () => {
                    selectedCharacter = duck.char;
                    document.getElementById('charName').textContent = characters[selectedCharacter].name;
                    document.body.removeChild(selectorDiv);
                    
                    // Reinitialize player with new character
                    const char = characters[selectedCharacter];
                    const currentHealth = player.health;
                    player.speed = char.speed;
                    player.jumpPower = char.jumpPower;
                    player.color = char.color;
                    player.special = char.special;
                    player.specialCooldown = char.specialCooldown;
                    player.maxHealth = char.maxHealth;
                    player.health = Math.min(currentHealth, char.maxHealth);
                    
                    isPaused = false;
                    gameLoop = setInterval(update, 1000/60);
                };
                grid.appendChild(btn);
            });
            
            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = 'Cancel';
            cancelBtn.style.cssText = `
                background: #DC143C;
                color: white;
                border: 3px solid #8B0000;
                padding: 15px 40px;
                font-size: 20px;
                font-weight: bold;
                cursor: pointer;
                border-radius: 8px;
            `;
            cancelBtn.onclick = () => {
                document.body.removeChild(selectorDiv);
                showPauseMenu();
            };
            
            selectorDiv.appendChild(title);
            selectorDiv.appendChild(grid);
            selectorDiv.appendChild(cancelBtn);
            
            document.body.appendChild(selectorDiv);
        }
        
        // Story data
        const storyScenes = {
            intro: {
                title: "The Trouble at Feather Farm",
                text: [
                    "Life was peaceful at Feather Farm... until HE arrived.",
                    "Gustav, the enormous Toulouse goose, waddled into town with one goal: to become the KING OF THE POND.",
                    "In a brazen display of audacity, he's stolen the Golden Breadcrumb Trophy - the farm's most prized possession!",
                    "The trophy, awarded annually at the County Fair, represents everything the duck community holds dear.",
                    "Gustav has taken it to the top of the farm's tallest structures, daring anyone to try and stop him.",
                    "Six brave ducks step forward. Each has their own reason to face Gustav...",
                    "", // Will be replaced with character-specific text
                    "The journey ahead is dangerous. But you're ready.",
                    "Will YOU be the hero who saves Feather Farm?"
                ],
                image: "🏆"
            },
            level1Complete: {
                title: "The Barnyard - Cleared!",
                text: [
                    "You've conquered the barnyard, dodging Gustav's rolling eggs with grace!",
                    "But Gustav merely honks with laughter from above.",
                    '"You think that was hard?" he taunts. "Try climbing my GRAIN SILO!"',
                    "He flies off toward the towering metal structure, leaving a trail of feathers.",
                    "The silo looms ahead - tall, industrial, and filled with moving platforms.",
                    "You take a deep breath. The journey continues..."
                ],
                image: "🌾"
            },
            level2Complete: {
                title: "The Grain Silo - Conquered!",
                text: [
                    "The moving platforms were no match for your determination!",
                    "Gustav's confidence wavers for the first time. His eyes narrow.",
                    '"Impressive... but can you handle the WATER?" he sneers.',
                    "He takes flight toward the old pond dock, a treacherous maze of slippery wood over murky water.",
                    "You've made him nervous. He's throwing everything he has at you now.",
                    "To the dock you go - carefully, because one wrong step means a cold swim..."
                ],
                image: "🏭"
            },
            level3Complete: {
                title: "The Pond Dock - Mastered!",
                text: [
                    "Even the slippery dock platforms couldn't slow you down!",
                    "Gustav is visibly shaken now. This wasn't supposed to happen.",
                    '"NO! This is MY pond! MY farm!" he shrieks into the darkening sky.',
                    "Storm clouds gather as Gustav retreats to the farmhouse roof - his final stronghold.",
                    "Rain begins to fall. Lightning crackles across the sky.",
                    "This is it. One more obstacle between you and Gustav's lair..."
                ],
                image: "🌊"
            },
            level4Complete: {
                title: "The Farm House Roof - Defeated!",
                text: [
                    "Through rain and lightning, you've climbed to the highest point of Feather Farm!",
                    "Gustav stands before you now, the Golden Breadcrumb Trophy clutched in his wings.",
                    "His guard geese have failed. His obstacles have crumbled. He's alone.",
                    '"You... you actually made it..." he stammers, backing away.',
                    '"Fine! If you want this trophy so badly, you\'ll have to TAKE IT FROM ME!"',
                    "Gustav spreads his massive wings. The final battle begins!",
                    "Show him what this duck can do!"
                ],
                image: "⛈️"
            }
        };
        
        const characterMotivations = {
            mallard: "🦆 MALLARD MAC steps forward. The classic hero, he won't stand by while a bully terrorizes his home. \"Someone has to stand up to him,\" Mac declares with quiet determination.",
            mandarin: "🦆 MANDARIN MING volunteers with a flourish. The most colorful duck in the pond, he won't let Gustav steal the spotlight. \"That trophy deserves to be seen by all - not hoarded by a pompous goose!\" Ming proclaims dramatically.",
            wood: "🦆 WOOD DUCK WOODY cracks his wings. Small but scrappy, he's tired of being underestimated. \"Time to show that oversized chicken what a real duck can do,\" Woody mutters with fierce determination.",
            runner: "🦆 RUNNER DUCK ROSIE nervously steps up. Fast and anxious, but her heart is brave. \"I-I may be scared, but I'm also FAST. Gustav won't even see me coming!\" she says, building her confidence.",
            buff: "🦆 BUFF BERTHA rises to her full, impressive stature. The eldest and strongest, she's protected this farm for years. \"That goose picked the wrong pond to mess with,\" Bertha says calmly. \"I'll bring him down myself.\"",
            magpie: "🦆 MAGPIE MAX grins with mischief in his eyes. Black and white and clever all over, he loves a good challenge. \"Gustav thinks he's so smart? Let's see how he handles a REAL trickster,\" Max quips, already planning his approach."
        };
        
        function showStory(sceneKey, callback) {
            const scene = storyScenes[sceneKey];
            
            // For intro, add character-specific motivation
            let textToShow = [...scene.text];
            if (sceneKey === 'intro' && selectedCharacter) {
                textToShow[6] = characterMotivations[selectedCharacter];
            }
            
            const storyDiv = document.createElement('div');
            storyDiv.id = 'storyScene';
            storyDiv.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
                z-index: 2000;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: white;
                padding: 40px;
                overflow-y: auto;
            `;
            
            const icon = document.createElement('div');
            icon.style.cssText = 'font-size: 80px; margin-bottom: 20px;';
            icon.textContent = scene.image;
            
            const title = document.createElement('h1');
            title.style.cssText = 'font-size: 42px; color: #FFD700; margin-bottom: 30px; text-align: center; text-shadow: 3px 3px #000;';
            title.textContent = scene.title;
            
            const textContainer = document.createElement('div');
            textContainer.style.cssText = 'max-width: 700px; font-size: 20px; line-height: 1.8; text-align: center; margin-bottom: 40px;';
            
            let currentLine = 0;
            const lineDelay = 1500; // 1.5 seconds per line
            
            function showNextLine() {
                if (currentLine < textToShow.length) {
                    const p = document.createElement('p');
                    p.style.cssText = 'margin: 15px 0; opacity: 0; transition: opacity 0.5s;';
                    p.textContent = textToShow[currentLine];
                    textContainer.appendChild(p);
                    
                    setTimeout(() => {
                        p.style.opacity = '1';
                    }, 50);
                    
                    currentLine++;
                    
                    if (currentLine < textToShow.length) {
                        setTimeout(showNextLine, lineDelay);
                    } else {
                        setTimeout(() => {
                            continueBtn.style.display = 'block';
                            continueBtn.style.opacity = '0';
                            setTimeout(() => {
                                continueBtn.style.opacity = '1';
                            }, 50);
                        }, 1000);
                    }
                }
            }
            
            const continueBtn = document.createElement('button');
            continueBtn.textContent = sceneKey === 'intro' ? 'BEGIN YOUR QUEST' : 'CONTINUE';
            continueBtn.style.cssText = `
                background: #32CD32;
                color: white;
                border: 3px solid #228B22;
                padding: 15px 40px;
                font-size: 22px;
                font-weight: bold;
                cursor: pointer;
                border-radius: 8px;
                display: none;
                opacity: 0;
                transition: all 0.3s;
                box-shadow: 0 4px 8px rgba(0,0,0,0.5);
            `;
            continueBtn.onmouseover = () => {
                continueBtn.style.background = '#228B22';
                continueBtn.style.transform = 'scale(1.05)';
            };
            continueBtn.onmouseout = () => {
                continueBtn.style.background = '#32CD32';
                continueBtn.style.transform = 'scale(1)';
            };
            continueBtn.onclick = () => {
                document.body.removeChild(storyDiv);
                if (callback) callback();
            };
            
            const skipBtn = document.createElement('button');
            skipBtn.textContent = 'Skip Story';
            skipBtn.style.cssText = `
                background: transparent;
                color: #888;
                border: 2px solid #888;
                padding: 10px 20px;
                font-size: 14px;
                cursor: pointer;
                border-radius: 5px;
                margin-top: 20px;
                transition: all 0.3s;
            `;
            skipBtn.onmouseover = () => {
                skipBtn.style.color = '#FFF';
                skipBtn.style.borderColor = '#FFF';
            };
            skipBtn.onmouseout = () => {
                skipBtn.style.color = '#888';
                skipBtn.style.borderColor = '#888';
            };
            skipBtn.onclick = () => {
                document.body.removeChild(storyDiv);
                if (callback) callback();
            };
            
            storyDiv.appendChild(icon);
            storyDiv.appendChild(title);
            storyDiv.appendChild(textContainer);
            storyDiv.appendChild(continueBtn);
            storyDiv.appendChild(skipBtn);
            
            document.body.appendChild(storyDiv);
            
            setTimeout(showNextLine, 500);
        }
        
        // Start game
        document.getElementById('startBtn').addEventListener('click', () => {
            if (!selectedCharacter) {
                alert('Please select a character first!');
                return;
            }
            
            document.getElementById('characterSelect').style.display = 'none';
            document.getElementById('charName').textContent = characters[selectedCharacter].name;
            
            // Show intro story, then start game
            showStory('intro', () => {
                document.getElementById('gameCanvas').style.display = 'block';
                document.getElementById('gameInfo').style.display = 'block';
                initGame();
                gameLoop = setInterval(update, 1000/60);
            });
        });
        
        function initGame() {
            const char = characters[selectedCharacter];
            
            player = {
                x: 50,
                y: 500,
                width: 30,
                height: 30,
                vx: 0,
                vy: 0,
                speed: char.speed,
                jumpPower: char.jumpPower,
                color: char.color,
                onGround: false,
                health: char.maxHealth,
                maxHealth: char.maxHealth,
                special: char.special,
                specialCooldown: char.specialCooldown,
                specialTimer: 0
            };
            
            score = 0;
            lives = 3;
            keys = {};
            currentLevel = 1;
            
            loadLevel(currentLevel);
        }
        
        function loadLevel(levelNum) {
            currentLevel = levelNum;
            document.getElementById('level').textContent = levelNum;
            
            // Reset player position
            player.x = 50;
            player.y = 500;
            player.vx = 0;
            player.vy = 0;
            
            switch(levelNum) {
                case 1:
                    loadLevel1();
                    break;
                case 2:
                    loadLevel2();
                    break;
                case 3:
                    loadLevel3();
                    break;
                case 4:
                    loadLevel4();
                    break;
                case 5:
                    loadLevel5();
                    showBossTutorial();
                    break;
            }
        }
        
        function showBossTutorial() {
            isPaused = true;
            
            const tutorialDiv = document.createElement('div');
            tutorialDiv.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.95);
                color: white;
                padding: 40px;
                border: 5px solid #FFD700;
                border-radius: 15px;
                z-index: 2000;
                max-width: 600px;
                text-align: center;
            `;
            
            tutorialDiv.innerHTML = `
                <h2 style="color: #FFD700; font-size: 36px; margin-bottom: 20px;">⚔️ BOSS BATTLE! ⚔️</h2>
                <h3 style="color: #FF6347; font-size: 24px; margin-bottom: 20px;">How to Defeat Gustav:</h3>
                <p style="font-size: 18px; margin: 15px 0; line-height: 1.6;">
                    🎯 <strong>Jump on Gustav's head</strong> to damage him (green box shows the hit zone)
                </p>
                <p style="font-size: 18px; margin: 15px 0; line-height: 1.6;">
                    ⚠️ <strong>Don't touch him from the side</strong> or you'll take damage!
                </p>
                <p style="font-size: 18px; margin: 15px 0; line-height: 1.6;">
                    🥚 <strong>Dodge his falling eggs</strong> - he throws more as he gets weaker!
                </p>
                <p style="font-size: 18px; margin: 15px 0; line-height: 1.6;">
                    💖 <strong>Collect the extra lives</strong> on the side platforms if needed!
                </p>
                <p style="font-size: 20px; margin: 25px 0; color: #FFD700;">
                    <strong>Hit him 10 times to win!</strong>
                </p>
                <button onclick="this.parentElement.remove(); isPaused = false;" 
                        style="background: #32CD32; color: white; border: 3px solid #228B22; 
                               padding: 15px 40px; font-size: 22px; font-weight: bold; 
                               cursor: pointer; border-radius: 8px; margin-top: 20px;">
                    LET'S GO!
                </button>
            `;
            
            document.body.appendChild(tutorialDiv);
        }
        
        function loadLevel1() {
            // Level 1: The Barnyard
            platforms = [
                { x: 0, y: 570, width: 800, height: 30, type: 'ground' },
                { x: 100, y: 480, width: 600, height: 20, type: 'platform' },
                { x: 50, y: 390, width: 650, height: 20, type: 'platform' },
                { x: 150, y: 300, width: 550, height: 20, type: 'platform' },
                { x: 100, y: 210, width: 600, height: 20, type: 'platform' },
                { x: 50, y: 120, width: 700, height: 20, type: 'platform' },
                { x: 300, y: 50, width: 200, height: 20, type: 'goal' }
            ];
            
            obstacles = [
                { x: 650, y: 450, vx: -2, radius: 15, type: 'egg' },
                { x: 200, y: 360, vx: 2, radius: 15, type: 'egg' },
                { x: 500, y: 270, vx: -2.5, radius: 15, type: 'egg' },
                { x: 150, y: 180, vx: 2, radius: 15, type: 'egg' }
            ];
            
            breadcrumbs = [
                { x: 400, y: 450, collected: false },
                { x: 350, y: 360, collected: false },
                { x: 450, y: 270, collected: false },
                { x: 300, y: 180, collected: false },
                { x: 400, y: 90, collected: false }
            ];
            
            extraLives = [
                { x: 600, y: 350, collected: false },
                { x: 250, y: 100, collected: false }
            ];
        }
        
        function loadLevel2() {
            // Level 2: The Grain Silo - vertical climb with moving platforms
            platforms = [
                { x: 0, y: 570, width: 800, height: 30, type: 'ground' },
                { x: 150, y: 490, width: 150, height: 20, type: 'platform', moving: true, startX: 150, endX: 500, vx: 2 },
                { x: 500, y: 400, width: 150, height: 20, type: 'platform', moving: true, startX: 150, endX: 500, vx: -2 },
                { x: 150, y: 310, width: 150, height: 20, type: 'platform', moving: true, startX: 150, endX: 500, vx: 2 },
                { x: 500, y: 220, width: 150, height: 20, type: 'platform', moving: true, startX: 150, endX: 500, vx: -2 },
                { x: 250, y: 130, width: 300, height: 20, type: 'platform' },
                { x: 325, y: 50, width: 150, height: 20, type: 'goal' }
            ];
            
            obstacles = [
                { x: 300, y: 450, vx: 0, vy: 3, radius: 18, type: 'grain', bounceY: 450, maxY: 550 },
                { x: 450, y: 350, vx: 0, vy: 3, radius: 18, type: 'grain', bounceY: 350, maxY: 450 },
                { x: 250, y: 260, vx: 0, vy: 3, radius: 18, type: 'grain', bounceY: 260, maxY: 360 },
                { x: 550, y: 170, vx: 0, vy: 3, radius: 18, type: 'grain', bounceY: 170, maxY: 270 }
            ];
            
            breadcrumbs = [
                { x: 300, y: 460, collected: false },
                { x: 320, y: 370, collected: false },
                { x: 350, y: 280, collected: false },
                { x: 320, y: 190, collected: false },
                { x: 400, y: 100, collected: false }
            ];
            
            extraLives = [
                { x: 400, y: 450, collected: false },
                { x: 180, y: 280, collected: false }
            ];
        }
        
        function loadLevel3() {
            // Level 3: The Pond Dock - slippery platforms over water
            platforms = [
                { x: 0, y: 570, width: 200, height: 30, type: 'ground' },
                { x: 600, y: 570, width: 200, height: 30, type: 'ground' },
                { x: 150, y: 490, width: 120, height: 15, type: 'platform', slippery: true },
                { x: 450, y: 490, width: 120, height: 15, type: 'platform', slippery: true },
                { x: 80, y: 400, width: 140, height: 15, type: 'platform', slippery: true },
                { x: 580, y: 400, width: 140, height: 15, type: 'platform', slippery: true },
                { x: 300, y: 320, width: 200, height: 15, type: 'platform', slippery: true },
                { x: 150, y: 230, width: 150, height: 15, type: 'platform', slippery: true },
                { x: 500, y: 230, width: 150, height: 15, type: 'platform', slippery: true },
                { x: 250, y: 140, width: 300, height: 15, type: 'platform' },
                { x: 325, y: 60, width: 150, height: 20, type: 'goal' }
            ];
            
            obstacles = [
                { x: 400, y: 550, vx: 3, radius: 12, type: 'fish', jumpTimer: 0 },
                { x: 200, y: 550, vx: -2.5, radius: 12, type: 'fish', jumpTimer: 60 },
                { x: 500, y: 550, vx: 2, radius: 12, type: 'fish', jumpTimer: 120 }
            ];
            
            breadcrumbs = [
                { x: 200, y: 460, collected: false },
                { x: 150, y: 370, collected: false },
                { x: 400, y: 290, collected: false },
                { x: 300, y: 200, collected: false },
                { x: 400, y: 110, collected: false }
            ];
            
            extraLives = [
                { x: 650, y: 460, collected: false },
                { x: 400, y: 290, collected: false }
            ];
        }
        
        function loadLevel4() {
            // Level 4: Farm House Roof - steep angles and weather
            platforms = [
                { x: 0, y: 570, width: 800, height: 30, type: 'ground' },
                // Angled roof platforms
                { x: 50, y: 500, width: 200, height: 20, type: 'platform' },
                { x: 550, y: 500, width: 200, height: 20, type: 'platform' },
                { x: 120, y: 420, width: 180, height: 20, type: 'platform' },
                { x: 500, y: 420, width: 180, height: 20, type: 'platform' },
                { x: 200, y: 340, width: 150, height: 20, type: 'platform' },
                { x: 450, y: 340, width: 150, height: 20, type: 'platform' },
                { x: 280, y: 260, width: 240, height: 20, type: 'platform' },
                { x: 300, y: 180, width: 200, height: 20, type: 'platform' },
                { x: 350, y: 100, width: 100, height: 20, type: 'platform' },
                { x: 360, y: 40, width: 80, height: 20, type: 'goal' }
            ];
            
            obstacles = [
                { x: 150, y: 470, vx: 0, vy: 0, radius: 12, type: 'goose', patrolStart: 50, patrolEnd: 250, vx: 1.5 },
                { x: 650, y: 470, vx: 0, vy: 0, radius: 12, type: 'goose', patrolStart: 550, patrolEnd: 750, vx: -1.5 },
                { x: 250, y: 310, vx: 0, vy: 0, radius: 12, type: 'goose', patrolStart: 200, patrolEnd: 350, vx: 1 },
                { x: 550, y: 310, vx: 0, vy: 0, radius: 12, type: 'goose', patrolStart: 450, patrolEnd: 600, vx: -1 }
            ];
            
            breadcrumbs = [
                { x: 150, y: 470, collected: false },
                { x: 600, y: 470, collected: false },
                { x: 275, y: 390, collected: false },
                { x: 400, y: 230, collected: false },
                { x: 400, y: 150, collected: false },
                { x: 400, y: 70, collected: false }
            ];
            
            extraLives = [
                { x: 360, y: 230, collected: false },
                { x: 520, y: 390, collected: false }
            ];
        }
        
        function loadLevel5() {
            // Level 5: Boss Battle - circular arena with Gustav
            platforms = [
                { x: 0, y: 570, width: 800, height: 30, type: 'ground' },
                { x: 100, y: 450, width: 150, height: 20, type: 'platform' },
                { x: 550, y: 450, width: 150, height: 20, type: 'platform' },
                { x: 200, y: 350, width: 120, height: 20, type: 'platform' },
                { x: 480, y: 350, width: 120, height: 20, type: 'platform' },
                { x: 300, y: 280, width: 200, height: 20, type: 'platform' }
            ];
            
            obstacles = [];
            
            // Boss Gustav
            obstacles.push({
                x: 400,
                y: 150,
                vx: 0,
                vy: 0,
                radius: 30,
                type: 'boss',
                health: 10,
                maxHealth: 10,
                phase: 1,
                attackTimer: 0,
                moveTimer: 0
            });
            
            breadcrumbs = [];
            
            extraLives = [
                { x: 175, y: 420, collected: false },
                { x: 625, y: 420, collected: false }
            ];
        }
        
        // Input handling
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Escape' && !isPaused) {
                showPauseMenu();
                return;
            }
            
            keys[e.code] = true;
            
            if (e.code === 'Space' && player.onGround) {
                player.vy = -player.jumpPower;
                player.onGround = false;
            }
            
            if (e.code === 'Space' && !player.onGround && player.special === 'doubleJump' && !hasDoubleJumped) {
                player.vy = -player.jumpPower;
                hasDoubleJumped = true;
            }
            
            if (e.code === 'ShiftLeft' && player.specialTimer <= 0) {
                activateSpecial();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            keys[e.code] = false;
        });
        
        function activateSpecial() {
            switch(player.special) {
                case 'invincibility':
                    specialActive = true;
                    specialTimer = 180; // 3 seconds
                    player.specialTimer = player.specialCooldown * 60;
                    break;
                case 'dash':
                    player.vx = keys['ArrowLeft'] ? -15 : 15;
                    player.specialTimer = player.specialCooldown * 60;
                    break;
                case 'panicRun':
                    player.speed = 8;
                    specialTimer = 120; // 2 seconds
                    player.specialTimer = player.specialCooldown * 60;
                    break;
                case 'smash':
                    // Smash nearby obstacles
                    obstacles = obstacles.filter(obs => {
                        const dist = Math.sqrt((obs.x - player.x)**2 + (obs.y - player.y)**2);
                        return dist > 100;
                    });
                    player.specialTimer = player.specialCooldown * 60;
                    break;
                case 'reveal':
                    // Visual effect - show hidden items (simplified)
                    score += 100;
                    player.specialTimer = player.specialCooldown * 60;
                    break;
            }
        }
        
        function update() {
            // Player movement
            if (keys['ArrowLeft']) {
                player.vx = -player.speed;
            } else if (keys['ArrowRight']) {
                player.vx = player.speed;
            } else {
                player.vx = 0;
            }
            
            // Gravity
            player.vy += 0.5;
            
            // Apply velocity
            player.x += player.vx;
            player.y += player.vy;
            
            // Boundary checking
            if (player.x < 0) player.x = 0;
            if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;
            
            // Platform collision
            player.onGround = false;
            platforms.forEach(plat => {
                if (player.x + player.width > plat.x &&
                    player.x < plat.x + plat.width &&
                    player.y + player.height > plat.y &&
                    player.y + player.height < plat.y + 20 &&
                    player.vy >= 0) {
                    
                    player.y = plat.y - player.height;
                    player.vy = 0;
                    player.onGround = true;
                    hasDoubleJumped = false;
                    
                    // Goal check
                    if (plat.type === 'goal') {
                        winLevel();
                    }
                }
            });
            
            // Fall death
            if (player.y > canvas.height) {
                loseLife();
            }
            
            // Obstacle movement and collision
            obstacles.forEach((obs, index) => {
                if (obs.type === 'egg') {
                    // Rolling eggs
                    obs.x += obs.vx;
                    if (obs.x < obs.radius || obs.x > canvas.width - obs.radius) {
                        obs.vx *= -1;
                    }
                } else if (obs.type === 'grain') {
                    // Bouncing grain sacks
                    obs.y += obs.vy;
                    if (obs.y >= obs.maxY) {
                        obs.vy = -3;
                    } else if (obs.y <= obs.bounceY) {
                        obs.vy = 3;
                    }
                } else if (obs.type === 'fish') {
                    // Jumping fish
                    obs.x += obs.vx;
                    if (obs.x < obs.radius || obs.x > canvas.width - obs.radius) {
                        obs.vx *= -1;
                    }
                    obs.jumpTimer++;
                    if (obs.jumpTimer > 120) {
                        obs.y = 450 - Math.abs(Math.sin(obs.jumpTimer / 10) * 100);
                        if (obs.jumpTimer > 180) obs.jumpTimer = 0;
                    } else {
                        obs.y = 550;
                    }
                } else if (obs.type === 'goose') {
                    // Patrolling geese
                    obs.x += obs.vx;
                    if (obs.x <= obs.patrolStart || obs.x >= obs.patrolEnd) {
                        obs.vx *= -1;
                    }
                } else if (obs.type === 'boss') {
                    // Boss Gustav behavior
                    obs.attackTimer++;
                    obs.moveTimer++;
                    
                    // Movement pattern - hover and move side to side
                    if (obs.moveTimer < 180) {
                        obs.x += Math.sin(obs.moveTimer / 20) * 3;
                        obs.y = 150 + Math.sin(obs.moveTimer / 30) * 20; // Bob up and down
                    } else {
                        // Dive attack pattern
                        if (obs.moveTimer < 240) {
                            obs.y += 2; // Dive down
                        } else {
                            obs.y = Math.max(150, obs.y - 3); // Return to position
                            if (obs.y <= 150) {
                                obs.moveTimer = 0;
                            }
                        }
                    }
                    
                    // Keep boss in bounds
                    if (obs.x < 100) obs.x = 100;
                    if (obs.x > 700) obs.x = 700;
                    
                    // Attack - spawn eggs at different speeds based on health
                    const attackSpeed = obs.health > 5 ? 90 : 60; // Faster when damaged
                    if (obs.attackTimer > attackSpeed) {
                        const numEggs = obs.health <= 3 ? 2 : 1; // Spawn more eggs when low health
                        for (let i = 0; i < numEggs; i++) {
                            obstacles.push({
                                x: obs.x + (i - 0.5) * 40,
                                y: obs.y + 40,
                                vx: (Math.random() - 0.5) * 4,
                                vy: 2,
                                radius: 12,
                                type: 'boss_egg'
                            });
                        }
                        obs.attackTimer = 0;
                    }
                } else if (obs.type === 'boss_egg') {
                    // Boss eggs fall down
                    obs.x += obs.vx;
                    obs.y += obs.vy;
                    obs.vy += 0.3;
                    
                    // Remove if off screen
                    if (obs.y > canvas.height) {
                        obstacles.splice(index, 1);
                    }
                }
                
                // Check collision with player
                if (!specialActive && obs.type !== 'boss') {
                    const dist = Math.sqrt((obs.x - (player.x + player.width/2))**2 + 
                                         (obs.y - (player.y + player.height/2))**2);
                    if (dist < obs.radius + player.width/2) {
                        loseLife();
                    }
                }
                
                // Boss collision and damage
                if (obs.type === 'boss') {
                    const dist = Math.sqrt((obs.x - (player.x + player.width/2))**2 + 
                                         (obs.y - (player.y + player.height/2))**2);
                    
                    // Check if player is jumping on boss's head
                    if (player.y + player.height < obs.y + 10 && 
                        player.vy > 0 &&
                        player.x + player.width > obs.x - 30 &&
                        player.x < obs.x + 30 &&
                        player.y + player.height > obs.y - 40 &&
                        player.y + player.height < obs.y + 10) {
                        // Successfully jumped on boss!
                        obs.health--;
                        player.vy = -15; // Big bounce
                        score += 500;
                        document.getElementById('score').textContent = score;
                        
                        // Visual feedback
                        obs.damaged = true;
                        setTimeout(() => obs.damaged = false, 200);
                        
                        if (obs.health <= 0) {
                            winGame();
                        }
                    } 
                    // Check if player hit boss from side (take damage)
                    else if (dist < obs.radius + player.width/2 + 10 && !specialActive) {
                        loseLife();
                    }
                }
            });
            
            // Breadcrumb collection
            breadcrumbs.forEach(crumb => {
                if (!crumb.collected) {
                    const dist = Math.sqrt((crumb.x - (player.x + player.width/2))**2 + 
                                         (crumb.y - (player.y + player.height/2))**2);
                    if (dist < 20) {
                        crumb.collected = true;
                        score += 100;
                        document.getElementById('score').textContent = score;
                    }
                }
            });
            
            // Extra life collection
            extraLives.forEach(life => {
                if (!life.collected) {
                    const dist = Math.sqrt((life.x - (player.x + player.width/2))**2 + 
                                         (life.y - (player.y + player.height/2))**2);
                    if (dist < 25) {
                        life.collected = true;
                        player.health = Math.min(player.health + 1, player.maxHealth + 2); // Can go up to 2 extra lives
                        player.maxHealth = Math.max(player.maxHealth, player.health);
                        document.getElementById('lives').textContent = player.health;
                        score += 500;
                        document.getElementById('score').textContent = score;
                    }
                }
            });
            
            // Moving platforms
            platforms.forEach(plat => {
                if (plat.moving) {
                    plat.x += plat.vx;
                    if (plat.x <= plat.startX || plat.x >= plat.endX) {
                        plat.vx *= -1;
                    }
                    
                    // Move player with platform
                    if (player.onGround && 
                        player.x + player.width > plat.x &&
                        player.x < plat.x + plat.width &&
                        Math.abs(player.y + player.height - plat.y) < 5) {
                        player.x += plat.vx;
                    }
                }
                
                // Slippery platforms
                if (plat.slippery && player.onGround &&
                    player.x + player.width > plat.x &&
                    player.x < plat.x + plat.width &&
                    Math.abs(player.y + player.height - plat.y) < 5) {
                    // Add momentum on slippery surfaces
                    if (keys['ArrowLeft'] || keys['ArrowRight']) {
                        player.vx *= 1.1; // Slippery acceleration
                    }
                }
            });
            
            // Special ability timers
            if (specialTimer > 0) {
                specialTimer--;
                if (specialTimer === 0) {
                    specialActive = false;
                    if (player.special === 'panicRun') {
                        player.speed = characters[selectedCharacter].speed;
                    }
                }
            }
            
            if (player.specialTimer > 0) {
                player.specialTimer--;
            }
            
            // Score for height
            const heightScore = Math.floor((600 - player.y) / 10);
            if (heightScore > score) {
                score = heightScore;
                document.getElementById('score').textContent = score;
            }
            
            draw();
        }
        
        function drawDuck(x, y, character) {
            const size = 30;
            
            ctx.save();
            
            // Special effect glow
            if (specialActive) {
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#FFD700';
            }
            
            // Duck body based on character
            switch(character) {
                case 'mallard':
                    // Mallard Mac - Classic green head, brown body
                    // Body
                    ctx.fillStyle = '#8B7355';
                    ctx.beginPath();
                    ctx.ellipse(x + 15, y + 20, 12, 10, 0, 0, Math.PI * 2);
                    ctx.fill();
                    // Head
                    ctx.fillStyle = '#2F4F2F';
                    ctx.beginPath();
                    ctx.arc(x + 18, y + 10, 8, 0, Math.PI * 2);
                    ctx.fill();
                    // White neck ring
                    ctx.strokeStyle = '#FFFFFF';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(x + 18, y + 15, 6, 0, Math.PI);
                    ctx.stroke();
                    break;
                    
                case 'mandarin':
                    // Mandarin Ming - Colorful and ornate
                    // Body
                    ctx.fillStyle = '#CD853F';
                    ctx.beginPath();
                    ctx.ellipse(x + 15, y + 20, 12, 10, 0, 0, Math.PI * 2);
                    ctx.fill();
                    // Head with crest
                    ctx.fillStyle = '#FF6347';
                    ctx.beginPath();
                    ctx.arc(x + 18, y + 10, 8, 0, Math.PI * 2);
                    ctx.fill();
                    // Crest feathers
                    ctx.fillStyle = '#FFD700';
                    ctx.beginPath();
                    ctx.moveTo(x + 18, y + 5);
                    ctx.lineTo(x + 22, y + 2);
                    ctx.lineTo(x + 20, y + 8);
                    ctx.fill();
                    // Orange cheek patches
                    ctx.fillStyle = '#FFA500';
                    ctx.beginPath();
                    ctx.arc(x + 22, y + 12, 3, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                    
                case 'wood':
                    // Wood Duck Woody - Multicolored, scrappy
                    // Body
                    ctx.fillStyle = '#654321';
                    ctx.beginPath();
                    ctx.ellipse(x + 15, y + 20, 12, 10, 0, 0, Math.PI * 2);
                    ctx.fill();
                    // Head
                    ctx.fillStyle = '#4B0082';
                    ctx.beginPath();
                    ctx.arc(x + 18, y + 10, 8, 0, Math.PI * 2);
                    ctx.fill();
                    // White stripes
                    ctx.strokeStyle = '#FFFFFF';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(x + 22, y + 8);
                    ctx.lineTo(x + 26, y + 10);
                    ctx.stroke();
                    break;
                    
                case 'runner':
                    // Runner Duck Rosie - Tall, upright stance
                    // Body (more vertical)
                    ctx.fillStyle = '#DDA0DD';
                    ctx.beginPath();
                    ctx.ellipse(x + 15, y + 18, 10, 12, 0, 0, Math.PI * 2);
                    ctx.fill();
                    // Long neck
                    ctx.fillStyle = '#DDA0DD';
                    ctx.fillRect(x + 13, y + 8, 4, 10);
                    // Head
                    ctx.fillStyle = '#BA55D3';
                    ctx.beginPath();
                    ctx.arc(x + 15, y + 8, 6, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                    
                case 'buff':
                    // Buff Bertha - Large, buff/tan colored, sturdy
                    // Larger body
                    ctx.fillStyle = '#DAA520';
                    ctx.beginPath();
                    ctx.ellipse(x + 15, y + 20, 14, 12, 0, 0, Math.PI * 2);
                    ctx.fill();
                    // Head
                    ctx.fillStyle = '#B8860B';
                    ctx.beginPath();
                    ctx.arc(x + 18, y + 10, 9, 0, Math.PI * 2);
                    ctx.fill();
                    // Strong build indicator
                    ctx.fillStyle = '#CD853F';
                    ctx.fillRect(x + 10, y + 22, 4, 6);
                    ctx.fillRect(x + 16, y + 22, 4, 6);
                    break;
                    
                case 'magpie':
                    // Magpie Max - Black and white pattern
                    // Body - white
                    ctx.fillStyle = '#FFFFFF';
                    ctx.beginPath();
                    ctx.ellipse(x + 15, y + 20, 12, 10, 0, 0, Math.PI * 2);
                    ctx.fill();
                    // Black patches
                    ctx.fillStyle = '#000000';
                    ctx.beginPath();
                    ctx.arc(x + 10, y + 18, 5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(x + 20, y + 22, 5, 0, Math.PI * 2);
                    ctx.fill();
                    // Black head
                    ctx.fillStyle = '#000000';
                    ctx.beginPath();
                    ctx.arc(x + 18, y + 10, 8, 0, Math.PI * 2);
                    ctx.fill();
                    // White cheek
                    ctx.fillStyle = '#FFFFFF';
                    ctx.beginPath();
                    ctx.arc(x + 22, y + 12, 3, 0, Math.PI * 2);
                    ctx.fill();
                    break;
            }
            
            // Eyes (all ducks)
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(x + 20, y + 9, 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Beak (all ducks)
            ctx.fillStyle = '#FFA500';
            ctx.beginPath();
            ctx.moveTo(x + 23, y + 10);
            ctx.lineTo(x + 28, y + 11);
            ctx.lineTo(x + 23, y + 12);
            ctx.closePath();
            ctx.fill();
            
            // Feet
            ctx.strokeStyle = '#FFA500';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x + 12, y + 28);
            ctx.lineTo(x + 12, y + 30);
            ctx.moveTo(x + 18, y + 28);
            ctx.lineTo(x + 18, y + 30);
            ctx.stroke();
            
            ctx.restore();
        }
        
        function drawGoose(x, y) {
            // Gustav the Toulouse Goose - large and intimidating
            ctx.save();
            
            // Large body - grey
            ctx.fillStyle = '#A9A9A9';
            ctx.beginPath();
            ctx.ellipse(x, y + 15, 25, 18, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Long neck
            ctx.fillStyle = '#B0B0B0';
            ctx.fillRect(x - 3, y - 10, 6, 25);
            
            // Head
            ctx.fillStyle = '#C0C0C0';
            ctx.beginPath();
            ctx.arc(x, y - 10, 12, 0, Math.PI * 2);
            ctx.fill();
            
            // Knob on forehead (Toulouse feature)
            ctx.fillStyle = '#8B0000';
            ctx.beginPath();
            ctx.arc(x, y - 15, 4, 0, Math.PI * 2);
            ctx.fill();
            
            // Mean eye
            ctx.fillStyle = '#FF0000';
            ctx.beginPath();
            ctx.arc(x + 5, y - 12, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(x + 5, y - 12, 1.5, 0, Math.PI * 2);
            ctx.fill();
            
            // Large orange beak
            ctx.fillStyle = '#FF8C00';
            ctx.beginPath();
            ctx.moveTo(x + 8, y - 10);
            ctx.lineTo(x + 16, y - 9);
            ctx.lineTo(x + 8, y - 8);
            ctx.closePath();
            ctx.fill();
            
            // Crown (to show he's "King of the Pond")
            ctx.strokeStyle = '#FFD700';
            ctx.fillStyle = '#FFD700';
            ctx.lineWidth = 2;
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(x - 8 + i * 8, y - 18);
                ctx.lineTo(x - 6 + i * 8, y - 24);
                ctx.lineTo(x - 4 + i * 8, y - 18);
                ctx.fill();
            }
            
            ctx.restore();
        }
        
        function draw() {
            // Clear canvas
            ctx.fillStyle = '#87CEEB';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw level-specific backgrounds
            if (currentLevel === 1) {
                drawLevel1Background();
            } else if (currentLevel === 2) {
                drawLevel2Background();
            } else if (currentLevel === 3) {
                drawLevel3Background();
            } else if (currentLevel === 4) {
                drawLevel4Background();
            } else if (currentLevel === 5) {
                drawLevel5Background();
            }
            
            // Draw platforms
            platforms.forEach(plat => {
                if (plat.type === 'goal') {
                    ctx.fillStyle = '#FFD700';
                } else if (plat.type === 'ground') {
                    ctx.fillStyle = '#654321';
                } else if (plat.slippery) {
                    ctx.fillStyle = '#4682B4';
                } else {
                    ctx.fillStyle = '#8B4513';
                }
                ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
                
                // Platform texture
                ctx.strokeStyle = plat.slippery ? '#5F9EA0' : '#654321';
                ctx.lineWidth = 2;
                for (let i = 0; i < plat.width; i += 20) {
                    ctx.beginPath();
                    ctx.moveTo(plat.x + i, plat.y);
                    ctx.lineTo(plat.x + i, plat.y + plat.height);
                    ctx.stroke();
                }
            });
            
            // Draw Gustav at top for levels 1-4
            if (currentLevel < 5) {
                drawGoose(400, 30);
            }
            
            // Draw obstacles
            obstacles.forEach(obs => {
                if (obs.type === 'egg' || obs.type === 'boss_egg') {
                    ctx.fillStyle = '#F5F5DC';
                    ctx.beginPath();
                    ctx.arc(obs.x, obs.y, obs.radius, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = '#D2B48C';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    // Egg speckles
                    ctx.fillStyle = '#C9A579';
                    ctx.beginPath();
                    ctx.arc(obs.x - 3, obs.y - 2, 2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(obs.x + 4, obs.y + 3, 1.5, 0, Math.PI * 2);
                    ctx.fill();
                } else if (obs.type === 'grain') {
                    ctx.fillStyle = '#DEB887';
                    ctx.fillRect(obs.x - obs.radius, obs.y - obs.radius, obs.radius * 2, obs.radius * 2);
                    ctx.strokeStyle = '#8B7355';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(obs.x - obs.radius, obs.y - obs.radius, obs.radius * 2, obs.radius * 2);
                } else if (obs.type === 'fish') {
                    ctx.fillStyle = '#FF6347';
                    ctx.beginPath();
                    ctx.ellipse(obs.x, obs.y, obs.radius, obs.radius * 0.6, 0, 0, Math.PI * 2);
                    ctx.fill();
                    // Fish tail
                    ctx.beginPath();
                    ctx.moveTo(obs.x - obs.radius, obs.y);
                    ctx.lineTo(obs.x - obs.radius - 5, obs.y - 5);
                    ctx.lineTo(obs.x - obs.radius - 5, obs.y + 5);
                    ctx.closePath();
                    ctx.fill();
                } else if (obs.type === 'goose') {
                    // Small guard geese
                    ctx.fillStyle = '#D3D3D3';
                    ctx.beginPath();
                    ctx.arc(obs.x, obs.y, obs.radius, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#000';
                    ctx.beginPath();
                    ctx.arc(obs.x + 5, obs.y - 3, 2, 0, Math.PI * 2);
                    ctx.fill();
                } else if (obs.type === 'boss') {
                    // Boss Gustav - larger
                    ctx.save();
                    
                    // Flash red when damaged
                    if (obs.damaged) {
                        ctx.globalAlpha = 0.5;
                    }
                    
                    drawGoose(obs.x, obs.y);
                    ctx.restore();
                    
                    // Health bar
                    ctx.fillStyle = '#000000';
                    ctx.fillRect(obs.x - 42, obs.y - 52, 84, 12);
                    ctx.fillStyle = '#FF0000';
                    ctx.fillRect(obs.x - 40, obs.y - 50, 80, 8);
                    ctx.fillStyle = '#00FF00';
                    ctx.fillRect(obs.x - 40, obs.y - 50, 80 * (obs.health / obs.maxHealth), 8);
                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(obs.x - 40, obs.y - 50, 80, 8);
                    
                    // Health text
                    ctx.fillStyle = '#FFFFFF';
                    ctx.font = 'bold 10px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(`${obs.health}/${obs.maxHealth}`, obs.x, obs.y - 42);
                    
                    // Show jump zone indicator
                    ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
                    ctx.lineWidth = 2;
                    ctx.setLineDash([5, 5]);
                    ctx.strokeRect(obs.x - 30, obs.y - 40, 60, 10);
                    ctx.setLineDash([]);
                    
                    // Instructions
                    ctx.fillStyle = '#FFD700';
                    ctx.font = 'bold 14px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('Jump on head to damage!', obs.x, obs.y - 70);
                }
            });
            
            // Draw breadcrumbs
            breadcrumbs.forEach(crumb => {
                if (!crumb.collected) {
                    ctx.fillStyle = '#FFD700';
                    ctx.beginPath();
                    ctx.arc(crumb.x, crumb.y, 5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = '#DAA520';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
            });
            
            // Draw extra lives (heart icons)
            extraLives.forEach(life => {
                if (!life.collected) {
                    ctx.save();
                    ctx.fillStyle = '#FF1493';
                    ctx.strokeStyle = '#C71585';
                    ctx.lineWidth = 2;
                    
                    // Draw heart shape
                    ctx.beginPath();
                    ctx.moveTo(life.x, life.y + 5);
                    ctx.bezierCurveTo(life.x, life.y, life.x - 8, life.y - 6, life.x - 8, life.y - 2);
                    ctx.bezierCurveTo(life.x - 8, life.y + 2, life.x, life.y + 8, life.x, life.y + 12);
                    ctx.bezierCurveTo(life.x, life.y + 8, life.x + 8, life.y + 2, life.x + 8, life.y - 2);
                    ctx.bezierCurveTo(life.x + 8, life.y - 6, life.x, life.y, life.x, life.y + 5);
                    ctx.fill();
                    ctx.stroke();
                    
                    // Pulsing glow effect
                    const pulse = Math.sin(Date.now() / 200) * 0.3 + 0.7;
                    ctx.shadowBlur = 15 * pulse;
                    ctx.shadowColor = '#FF1493';
                    ctx.fill();
                    
                    ctx.restore();
                }
            });
            
            // Draw player duck
            drawDuck(player.x, player.y, selectedCharacter);
            
            // Draw health
            ctx.fillStyle = '#FF0000';
            for (let i = 0; i < player.maxHealth; i++) {
                if (i < player.health) {
                    ctx.fillRect(10 + i * 25, 10, 20, 20);
                } else {
                    ctx.strokeStyle = '#FF0000';
                    ctx.strokeRect(10 + i * 25, 10, 20, 20);
                }
            }
            
            // Draw special ability cooldown
            if (player.specialTimer > 0) {
                const cooldownPercent = player.specialTimer / (player.specialCooldown * 60);
                ctx.fillStyle = '#4169E1';
                ctx.fillRect(10, 40, 100 * (1 - cooldownPercent), 10);
                ctx.strokeStyle = '#000';
                ctx.strokeRect(10, 40, 100, 10);
            } else {
                ctx.fillStyle = '#32CD32';
                ctx.fillRect(10, 40, 100, 10);
                ctx.strokeStyle = '#000';
                ctx.strokeRect(10, 40, 100, 10);
                ctx.fillStyle = '#000';
                ctx.font = '8px Arial';
                ctx.fillText('READY!', 35, 48);
            }
        }
        
        function drawLevel1Background() {
            // The Barnyard
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(20, 60, 100, 520);
            ctx.fillRect(680, 60, 100, 520);
            
            // Hay bales
            ctx.fillStyle = '#DAA520';
            for (let i = 0; i < 5; i++) {
                ctx.fillRect(30 + i * 150, 540, 40, 30);
            }
        }
        
        function drawLevel2Background() {
            // The Grain Silo - industrial look
            ctx.fillStyle = '#708090';
            ctx.fillRect(350, 0, 100, 600);
            
            // Silo rings
            ctx.strokeStyle = '#556B2F';
            ctx.lineWidth = 3;
            for (let i = 0; i < 10; i++) {
                ctx.beginPath();
                ctx.arc(400, i * 60, 50, 0, Math.PI * 2);
                ctx.stroke();
            }
            
            // Conveyor belts
            ctx.fillStyle = '#2F4F4F';
            ctx.fillRect(0, 300, 150, 10);
            ctx.fillRect(650, 400, 150, 10);
        }
        
        function drawLevel3Background() {
            // The Pond Dock - water and wooden dock
            // Water
            ctx.fillStyle = '#4682B4';
            ctx.fillRect(200, 500, 400, 100);
            
            // Water ripples
            ctx.strokeStyle = '#5F9EA0';
            ctx.lineWidth = 2;
            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                ctx.arc(250 + i * 80, 530 + Math.sin(Date.now() / 200 + i) * 5, 20, 0, Math.PI);
                ctx.stroke();
            }
            
            // Cattails
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(50, 500, 5, 50);
            ctx.fillRect(740, 480, 5, 70);
            ctx.fillStyle = '#654321';
            ctx.beginPath();
            ctx.ellipse(52, 495, 8, 15, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(742, 475, 8, 15, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        
        function drawLevel4Background() {
            // Farm House Roof - nighttime with storm
            ctx.fillStyle = '#1C1C1C';
            ctx.fillRect(0, 0, 800, 600);
            
            // Rain
            ctx.strokeStyle = 'rgba(173, 216, 230, 0.5)';
            ctx.lineWidth = 1;
            for (let i = 0; i < 30; i++) {
                let x = Math.random() * 800;
                let y = (Date.now() / 10 + i * 20) % 600;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + 2, y + 10);
                ctx.stroke();
            }
            
            // House silhouette
            ctx.fillStyle = '#3C3C3C';
            ctx.fillRect(0, 450, 200, 150);
            ctx.fillRect(600, 400, 200, 200);
            
            // Lightning flash (occasional)
            if (Math.random() > 0.98) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.fillRect(0, 0, 800, 600);
            }
        }
        
        function drawLevel5Background() {
            // Boss Arena - dramatic
            ctx.fillStyle = '#2F4F4F';
            ctx.fillRect(0, 0, 800, 600);
            
            // Arena circle
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.arc(400, 300, 280, 0, Math.PI * 2);
            ctx.stroke();
            
            // Dramatic lighting
            const gradient = ctx.createRadialGradient(400, 150, 50, 400, 300, 300);
            gradient.addColorStop(0, 'rgba(255, 215, 0, 0.3)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 800, 600);
        }
        
        function loseLife() {
            player.health--;
            document.getElementById('lives').textContent = player.health;
            
            if (player.health <= 0) {
                endGame(false);
            } else {
                // Reset position
                player.x = 50;
                player.y = 500;
                player.vx = 0;
                player.vy = 0;
            }
        }
        
        function winLevel() {
            score += 1000;
            document.getElementById('score').textContent = score;
            
            // Pause the game
            clearInterval(gameLoop);
            
            if (currentLevel < 5) {
                // Determine which story to show
                let storyKey;
                if (currentLevel === 1) storyKey = 'level1Complete';
                else if (currentLevel === 2) storyKey = 'level2Complete';
                else if (currentLevel === 3) storyKey = 'level3Complete';
                else if (currentLevel === 4) storyKey = 'level4Complete';
                
                // Show story, then load next level
                showStory(storyKey, () => {
                    loadLevel(currentLevel + 1);
                    gameLoop = setInterval(update, 1000/60);
                });
            } else {
                winGame();
            }
        }
        
        function winGame() {
            clearInterval(gameLoop);
            
            // Show victory cutscene
            showVictoryCutscene();
        }
        
        // Character-specific victory scenes
        const victoryScenes = {
            mallard: {
                phases: [
                    {
                        icon: '💥',
                        title: 'CRITICAL HIT!',
                        text: 'Mallard Mac lands the final blow with perfect timing and grace!',
                        delay: 2000
                    },
                    {
                        icon: '😵',
                        title: 'Gustav is Defeated!',
                        text: '"That\'s what you get for messing with our pond," Mac says calmly as Gustav\'s crown tumbles to the ground.',
                        delay: 3000
                    },
                    {
                        icon: '🏆',
                        title: 'The Trophy is Reclaimed!',
                        text: 'Mac picks up the Golden Breadcrumb Trophy with steady wings. "This belongs to all of us, not just one bully."',
                        delay: 3000
                    },
                    {
                        icon: '🦆',
                        title: 'The Hero We Needed!',
                        text: 'The other ducks gather around their steadfast hero. "You did it, Mac!" they cheer. Gustav waddles away, defeated.',
                        delay: 3000
                    }
                ],
                quote: '"Sometimes all it takes is someone willing to do the right thing."'
            },
            mandarin: {
                phases: [
                    {
                        icon: '💥',
                        title: 'SPECTACULAR FINISH!',
                        text: 'With an acrobatic flourish, Mandarin Ming delivers the final jump with style!',
                        delay: 2000
                    },
                    {
                        icon: '😵',
                        title: 'Gustav is Defeated!',
                        text: '"Did everyone see that? That was BEAUTIFUL!" Ming strikes a pose as Gustav collapses in defeat.',
                        delay: 3000
                    },
                    {
                        icon: '🏆',
                        title: 'The Trophy Returns to Glory!',
                        text: 'Ming holds the trophy high, turning so everyone can see. "A beautiful trophy deserves to be SEEN, not hidden!"',
                        delay: 3000
                    },
                    {
                        icon: '🦆',
                        title: 'The Most Dazzling Hero!',
                        text: 'The ducks applaud as Ming takes a theatrical bow. "Thank you, thank you! I couldn\'t have done it without... well, mostly me!"',
                        delay: 3000
                    }
                ],
                quote: '"Style isn\'t everything... but it sure helps!"'
            },
            wood: {
                phases: [
                    {
                        icon: '💥',
                        title: 'SURPRISE ATTACK!',
                        text: 'Wood Duck Woody dashes in with scrappy determination and lands the winning hit!',
                        delay: 2000
                    },
                    {
                        icon: '😵',
                        title: 'Gustav is Defeated!',
                        text: '"Not so tough now, are ya?" Woody grins as the big goose stumbles backward. "Size isn\'t everything!"',
                        delay: 3000
                    },
                    {
                        icon: '🏆',
                        title: 'Victory for the Underdog!',
                        text: 'Woody grabs the trophy with fierce pride. "Told everyone I could do it. Maybe now they\'ll believe me!"',
                        delay: 3000
                    },
                    {
                        icon: '🦆',
                        title: 'Small Duck, BIG Heart!',
                        text: 'The farm erupts in cheers. "Who\'s the little duck NOW?" Woody shouts triumphantly as Gustav slinks away.',
                        delay: 3000
                    }
                ],
                quote: '"Never underestimate the scrappy ones!"'
            },
            runner: {
                phases: [
                    {
                        icon: '💥',
                        title: 'LIGHTNING FAST!',
                        text: 'Runner Duck Rosie speeds in with incredible velocity and strikes before Gustav can react!',
                        delay: 2000
                    },
                    {
                        icon: '😵',
                        title: 'Gustav is Defeated!',
                        text: '"I-I did it! I actually did it!" Rosie can barely believe it as Gustav collapses. "I was so scared but I kept going!"',
                        delay: 3000
                    },
                    {
                        icon: '🏆',
                        title: 'Courage Conquers Fear!',
                        text: 'With trembling but proud wings, Rosie lifts the trophy. "Being brave doesn\'t mean not being scared... it means doing it anyway!"',
                        delay: 3000
                    },
                    {
                        icon: '🦆',
                        title: 'The Bravest Duck!',
                        text: 'The other ducks surround Rosie with cheers and hugs. She smiles, no longer nervous. "I found my courage today!"',
                        delay: 3000
                    }
                ],
                quote: '"The fastest duck... with the biggest heart!"'
            },
            buff: {
                phases: [
                    {
                        icon: '💥',
                        title: 'UNSTOPPABLE FORCE!',
                        text: 'Buff Bertha slams down on Gustav with the full weight of her determination!',
                        delay: 2000
                    },
                    {
                        icon: '😵',
                        title: 'Gustav is Defeated!',
                        text: '"I\'ve been protecting this farm for years," Bertha says firmly. "You picked the wrong pond, Gustav."',
                        delay: 3000
                    },
                    {
                        icon: '🏆',
                        title: 'The Guardian Prevails!',
                        text: 'Bertha gently cradles the trophy. "This belongs to our family. ALL of our family. Not to bullies."',
                        delay: 3000
                    },
                    {
                        icon: '🦆',
                        title: 'Mama Bertha Saves the Day!',
                        text: 'The younger ducks flock around Bertha, who smiles warmly. "That\'s what family does - we protect each other."',
                        delay: 3000
                    }
                ],
                quote: '"Strength isn\'t just physical - it\'s protecting those you love."'
            },
            magpie: {
                phases: [
                    {
                        icon: '💥',
                        title: 'PERFECTLY CALCULATED!',
                        text: 'Magpie Max times the jump with trickster precision - just as planned!',
                        delay: 2000
                    },
                    {
                        icon: '😵',
                        title: 'Gustav is Defeated!',
                        text: '"You really should\'ve seen that coming," Max quips as Gustav\'s crown rolls away. "I certainly did. Three moves ago, actually."',
                        delay: 3000
                    },
                    {
                        icon: '🏆',
                        title: 'The Smartest Duck Wins!',
                        text: 'Max retrieves the trophy with a satisfied grin. "Brains over brawn, every time. Well, brains AND a bit of flair."',
                        delay: 3000
                    },
                    {
                        icon: '🦆',
                        title: 'Clever Max Triumphs!',
                        text: 'The ducks celebrate their cunning hero. "All according to plan!" Max declares with a wink. (Was it really? Who knows!)',
                        delay: 3000
                    }
                ],
                quote: '"Outsmarted by a duck. How embarrassing for you, Gustav!"'
            }
        };
        
        function showVictoryCutscene() {
            const cutsceneDiv = document.createElement('div');
            cutsceneDiv.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(to bottom, #1a1a2e 0%, #16213e 100%);
                z-index: 3000;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: white;
                overflow-y: auto;
                padding: 40px;
            `;
            
            const characterScene = victoryScenes[selectedCharacter];
            let phase = 0;
            
            function showPhase(phaseNum) {
                cutsceneDiv.innerHTML = '';
                
                // Regular story phases
                if (phaseNum < characterScene.phases.length) {
                    const currentPhase = characterScene.phases[phaseNum];
                    
                    // Icon
                    const icon = document.createElement('div');
                    icon.style.cssText = 'font-size: 100px; margin-bottom: 30px; animation: bounce 1s infinite;';
                    icon.textContent = currentPhase.icon;
                    
                    // Title
                    const title = document.createElement('h1');
                    title.style.cssText = `
                        font-size: 48px;
                        color: #FFD700;
                        margin-bottom: 30px;
                        text-align: center;
                        text-shadow: 3px 3px #000;
                        animation: glow 2s ease-in-out infinite;
                    `;
                    title.textContent = currentPhase.title;
                    
                    // Text
                    const text = document.createElement('p');
                    text.style.cssText = `
                        font-size: 24px;
                        max-width: 700px;
                        text-align: center;
                        line-height: 1.6;
                        margin-bottom: 40px;
                        color: #E0E0E0;
                    `;
                    text.textContent = currentPhase.text;
                    
                    cutsceneDiv.appendChild(icon);
                    cutsceneDiv.appendChild(title);
                    cutsceneDiv.appendChild(text);
                    
                    // Auto-advance
                    setTimeout(() => {
                        showPhase(phaseNum + 1);
                    }, currentPhase.delay);
                    
                    // Skip button
                    const skipText = document.createElement('p');
                    skipText.style.cssText = 'color: #888; font-size: 14px; margin-top: 20px; cursor: pointer;';
                    skipText.textContent = 'Click anywhere to skip...';
                    skipText.onclick = () => showPhase(characterScene.phases.length);
                    cutsceneDiv.onclick = () => showPhase(characterScene.phases.length);
                    cutsceneDiv.appendChild(skipText);
                }
                // Duck close-up and wink phase
                else if (phaseNum === characterScene.phases.length) {
                    showDuckCloseup();
                }
                // Final stats phase
                else {
                    showFinalStats();
                }
            }
            
            function showDuckCloseup() {
                cutsceneDiv.innerHTML = '';
                cutsceneDiv.onclick = null;
                
                const canvas = document.createElement('canvas');
                canvas.width = 400;
                canvas.height = 400;
                canvas.style.cssText = 'border: 5px solid #FFD700; border-radius: 50%; margin-bottom: 30px; animation: zoomIn 2s ease-out;';
                
                const ctx = canvas.getContext('2d');
                
                // Draw large close-up of duck face
                ctx.fillStyle = '#1a1a2e';
                ctx.fillRect(0, 0, 400, 400);
                
                // Scale up the duck drawing
                ctx.save();
                ctx.translate(200, 200);
                ctx.scale(8, 8);
                
                // Draw the duck's face (centered)
                drawDuckFace(ctx, 0, 0, selectedCharacter);
                
                ctx.restore();
                
                // Title
                const title = document.createElement('h1');
                title.style.cssText = `
                    font-size: 42px;
                    color: #FFD700;
                    margin-bottom: 20px;
                    text-align: center;
                    animation: glow 2s ease-in-out infinite;
                `;
                title.textContent = `${characters[selectedCharacter].name}`;
                
                // Character quote
                const quote = document.createElement('p');
                quote.style.cssText = `
                    font-size: 22px;
                    font-style: italic;
                    color: #87CEEB;
                    max-width: 600px;
                    text-align: center;
                    margin-bottom: 30px;
                `;
                quote.textContent = characterScene.quote;
                
                cutsceneDiv.appendChild(canvas);
                cutsceneDiv.appendChild(title);
                cutsceneDiv.appendChild(quote);
                
                // Wink animation
                let winkCount = 0;
                const winkInterval = setInterval(() => {
                    // Redraw duck
                    ctx.fillStyle = '#1a1a2e';
                    ctx.fillRect(0, 0, 400, 400);
                    ctx.save();
                    ctx.translate(200, 200);
                    ctx.scale(8, 8);
                    drawDuckFace(ctx, 0, 0, selectedCharacter, true); // winking = true
                    ctx.restore();
                    
                    winkCount++;
                    if (winkCount >= 3) {
                        clearInterval(winkInterval);
                        setTimeout(() => showPhase(characterScene.phases.length + 1), 1500);
                    } else {
                        // Open eye again
                        setTimeout(() => {
                            ctx.fillStyle = '#1a1a2e';
                            ctx.fillRect(0, 0, 400, 400);
                            ctx.save();
                            ctx.translate(200, 200);
                            ctx.scale(8, 8);
                            drawDuckFace(ctx, 0, 0, selectedCharacter, false);
                            ctx.restore();
                        }, 200);
                    }
                }, 800);
            }
            
            function showFinalStats() {
                cutsceneDiv.innerHTML = '';
                
                const title = document.createElement('h1');
                title.style.cssText = 'font-size: 60px; color: #FFD700; margin-bottom: 40px; animation: glow 2s ease-in-out infinite;';
                title.textContent = '🎉 VICTORY! 🎉';
                
                const statsDiv = document.createElement('div');
                statsDiv.style.cssText = `
                    background: rgba(255, 215, 0, 0.1);
                    border: 3px solid #FFD700;
                    border-radius: 15px;
                    padding: 30px;
                    margin: 20px 0;
                    max-width: 500px;
                `;
                statsDiv.innerHTML = `
                    <h3 style="color: #FFD700; font-size: 28px; margin-bottom: 20px;">Final Stats</h3>
                    <p style="font-size: 20px; margin: 10px 0;">🏆 Final Score: <strong style="color: #FFD700;">${score}</strong></p>
                    <p style="font-size: 20px; margin: 10px 0;">🦆 Hero: <strong style="color: #FFD700;">${characters[selectedCharacter].name}</strong></p>
                    <p style="font-size: 20px; margin: 10px 0;">❤️ Lives Remaining: <strong style="color: #FFD700;">${player.health}</strong></p>
                    <p style="font-size: 20px; margin: 10px 0;">⭐ Levels Conquered: <strong style="color: #FFD700;">5/5</strong></p>
                `;
                
                const playAgainBtn = document.createElement('button');
                playAgainBtn.textContent = 'PLAY AGAIN';
                playAgainBtn.style.cssText = `
                    background: #32CD32;
                    color: white;
                    border: 3px solid #228B22;
                    padding: 20px 50px;
                    font-size: 24px;
                    font-weight: bold;
                    cursor: pointer;
                    border-radius: 10px;
                    margin: 20px 10px;
                    box-shadow: 0 6px 12px rgba(0,0,0,0.5);
                    transition: all 0.3s;
                `;
                playAgainBtn.onmouseover = () => {
                    playAgainBtn.style.background = '#228B22';
                    playAgainBtn.style.transform = 'scale(1.05)';
                };
                playAgainBtn.onmouseout = () => {
                    playAgainBtn.style.background = '#32CD32';
                    playAgainBtn.style.transform = 'scale(1)';
                };
                playAgainBtn.onclick = () => location.reload();
                
                cutsceneDiv.appendChild(title);
                cutsceneDiv.appendChild(statsDiv);
                cutsceneDiv.appendChild(playAgainBtn);
            }
            
            // Add CSS animations
            const style = document.createElement('style');
            style.textContent = `
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes glow {
                    0%, 100% { text-shadow: 3px 3px #000, 0 0 20px #FFD700; }
                    50% { text-shadow: 3px 3px #000, 0 0 40px #FFD700, 0 0 60px #FFD700; }
                }
                @keyframes zoomIn {
                    0% { transform: scale(0.5); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
            
            document.body.appendChild(cutsceneDiv);
            showPhase(0);
        }
        
        // Draw duck face for close-up (simplified, centered version)
        function drawDuckFace(ctx, x, y, character, winking = false) {
            ctx.save();
            
            // Head color based on character
            let headColor, accentColor;
            switch(character) {
                case 'mallard':
                    headColor = '#2F4F2F';
                    accentColor = '#FFFFFF';
                    break;
                case 'mandarin':
                    headColor = '#FF6347';
                    accentColor = '#FFD700';
                    break;
                case 'wood':
                    headColor = '#4B0082';
                    accentColor = '#FFFFFF';
                    break;
                case 'runner':
                    headColor = '#BA55D3';
                    accentColor = '#DDA0DD';
                    break;
                case 'buff':
                    headColor = '#B8860B';
                    accentColor = '#DAA520';
                    break;
                case 'magpie':
                    headColor = '#000000';
                    accentColor = '#FFFFFF';
                    break;
            }
            
            // Head
            ctx.fillStyle = headColor;
            ctx.beginPath();
            ctx.arc(x, y, 8, 0, Math.PI * 2);
            ctx.fill();
            
            // Accent (like crest or cheek patch)
            ctx.fillStyle = accentColor;
            ctx.beginPath();
            ctx.arc(x + 3, y - 1, 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Eyes
            if (winking) {
                // Winking - one eye closed
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(x + 2, y + 1);
                ctx.lineTo(x + 4, y + 1);
                ctx.stroke();
                
                // Other eye open
                ctx.fillStyle = '#000000';
                ctx.beginPath();
                ctx.arc(x - 2, y + 1, 1, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Both eyes open
                ctx.fillStyle = '#000000';
                ctx.beginPath();
                ctx.arc(x + 3, y + 1, 1, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(x - 2, y + 1, 1, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Beak
            ctx.fillStyle = '#FFA500';
            ctx.beginPath();
            ctx.moveTo(x + 4, y + 2);
            ctx.lineTo(x + 7, y + 3);
            ctx.lineTo(x + 4, y + 4);
            ctx.closePath();
            ctx.fill();
            
            ctx.restore();
        }
        
        function endGame(won) {
            clearInterval(gameLoop);
            const gameOver = document.getElementById('gameOver');
            const gameOverText = document.getElementById('gameOverText');
            const finalScore = document.getElementById('finalScore');
            
            if (won) {
                gameOverText.textContent = '🎉 LEVEL COMPLETE! 🎉';
                gameOverText.style.color = '#FFD700';
                finalScore.textContent = `Score: ${score} | You saved the day!`;
            } else {
                gameOverText.textContent = 'GAME OVER';
                gameOverText.style.color = '#FF6347';
                finalScore.textContent = `Final Score: ${score} | Try again!`;
            }
            
            gameOver.style.display = 'block';
        }
    
</body>
</html>
// ========================================
// MOBILE INTEGRATION PATCHES
// ========================================

// Override the original input handling to support both keyboard and touch
const originalKeyCheck = keys;

// Unified input checker that combines keyboard and touch
function isPressed(action) {
    const touch = getTouchInput();
    
    switch(action) {
        case 'left':
            return keys['ArrowLeft'] || touch.left;
        case 'right':
            return keys['ArrowRight'] || touch.right;
        case 'jump':
            return keys['Space'] || touch.jump;
        case 'special':
            return keys['ShiftLeft'] || touch.special;
        case 'pause':
            return keys['Escape'];
        default:
            return false;
    }
}

// Show touch controls when game starts (mobile only)
const originalStartGame = typeof initGame !== 'undefined' ? initGame : null;
if (originalStartGame) {
    const oldInitGame = initGame;
    initGame = function() {
        oldInitGame();
        if (isMobileDevice()) {
            showTouchControls();
        }
    };
}

// Responsive canvas sizing for mobile
function resizeCanvas() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    
    const maxWidth = window.innerWidth - 20;
    const maxHeight = window.innerHeight * 0.6;
    
    const scale = Math.min(maxWidth / 800, maxHeight / 600);
    
    canvas.style.width = (800 * scale) + 'px';
    canvas.style.height = (600 * scale) + 'px';
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', resizeCanvas);

// Initial resize
setTimeout(resizeCanvas, 100);

console.log('Duck Kong Mobile - Ready to play!');
