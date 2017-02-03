
// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;
    if (this.x > 505) {
        this.x = -100;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player Class
var Player = function() {
    this.score = 0;
    this.lives = 5;
    this.x = 200;
    this.y = 400;
    this.sprite = 'images/char-boy.png';
};

// Update the position of the player
Player.prototype.update = function() { 
    this.collide();
    this.check_win();
};

// To draw the player on the screen for each move
// draw player to the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Handle userinput
Player.prototype.handleInput = function(move) {
    switch(move) {
        case 'left':
            if (this.x < 100){
                break;
            }
            this.x -= 100;
            break;  
        case 'up':
            if (this.y < 0){
                break;
            }
            this.y -= 83;
            break;
        case 'right':
            if (this.x > 300){
                break;
            }
            this.x += 100;
            break;  
        case 'down':
            if (this.y > 399){
                break;
            }
            this.y += 83;
            break;                
    }
};

Player.prototype.collide = function() {
    var current = this;
    for (var i = 0; i < allEnemies.length; i++) {
        if (allEnemies[i].y == current.y) {
            if (allEnemies[i].x >= current.x - 40 && allEnemies[i].x <= current.x + 40) {
                current.loose();
                current.reset_player();
            }
        }
    };
    for (var i = 0; i < allHelpers.length; i++) {
        if (allHelpers[i].y == current.y) {
            if (allHelpers[i].x >= current.x - 40 && allHelpers[i].x <= current.x + 40) {
                if(allHelpers[i] instanceof Heart){  // if it's a heart
                    ++current.lives;
                    allHelpers.splice(i--, 1);
                }else{
                    allEnemies.pop();
                    allHelpers.splice(i--, 1);
                }
            }
        }
    };
    current.updateScore();
};



// Check if player has won 
Player.prototype.check_win = function() {
    if(this.y < 0){
        this.score++;
        this.reset_player();
        addObstacle(allEnemies, allHelpers);
        this.updateScore();
    }
}

// kill the player
Player.prototype.loose = function() {
    --this.lives;
    if (this.lives < 0) {
        this.reset_game();
    }else{
        this.updateScore();
    }
}

// reset the players position
Player.prototype.reset_player = function() {
    this.x = 200;
    this.y = 400;
};

// Reset the game
Player.prototype.reset_game = function() {
    var current = this;
    allEnemies = [];
    allHelpers = [];
    var list = allEnemies;
    var list2 = allHelpers
    $('#score').text(this.score);
    $('.modal').modal('show')
    $('.modal').on('hidden.bs.modal', function (a) {
        current.lives = 5;
        current.score = 0;
        current.updateScore();
        addObstacle(list, list2);
        current.reset_player();
    });  
};

// update score
Player.prototype.updateScore = function(){
    ctx.clearRect(0, 0 , 505 , 40);
    ctx.font = "30px Helvetica";
    ctx.fillText("Score: " + this.score, 0, 40);
    ctx.fillText("Lives: " + this.lives, 400, 40);
};


// Hearts our player can pick up
var Heart = function(x, y) {
    this.sprite = 'images/Heart.png';
    this.x = x;
    this.y = y;
    this.speed = 200;
};

// Update the Heart's position, required method for game
// Parameter: dt, a time delta between ticks
Heart.prototype.update = function(dt) {
    this.x += this.speed * dt;
    if (this.x > 505) { // make sure to re-enter the gameboard
        this.x = -100;
    }
};

// Draw the enemy on the screen, required method for game
Heart.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Keys our player can pick up
var Key = function(x, y) {
    this.sprite = 'images/Key.png';
    this.x = x;
    this.y = y;
    this.speed = 200;
};

// Update the Key's position, required method for game
// Parameter: dt, a time delta between ticks
Key.prototype.update = function(dt) {
    this.x += this.speed * dt;
    if (this.x > 505) { // make sure to re-enter the gameboard
        this.x = -100;
    }
};

// Draw the enemy on the screen, required method for game
Key.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Function to add an enemy to list
function addObstacle(list, list2) {
    var enemyRows = [
        68,
        151,
        234
    ];
    if (list.length == 0){
        list.push(new Enemy(-100,68,100));
    }else{
        list.push(new Enemy(-100, enemyRows[Math.floor(getRandomNumber(enemyRows.length, 0))], getRandomNumber(800, 100)));
        if (player.score > 3){
            list2.push(new Heart(-100, enemyRows[Math.floor(getRandomNumber(enemyRows.length,0))]));
        }
        if (player.score > 5){
            list2.push(new Key(-100, enemyRows[Math.floor(getRandomNumber(enemyRows.length,0))]));
        }
    }
}

function getRandomNumber(hi, min){
    return Math.random() * (hi - min) + min;
}

// Adds a heart to list of 'enemies'
function addHeart(list) {
    list.push(new Enemy(-100, randomRow, randomSpeed));
}

// ADds a Heart to list of 'enemies'
function addKey(list) {
    list.push(new Key(-100, randomRow, randomSpeed));
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});


// Instantiate all objects
var allEnemies = [
    new Enemy(-100,68,100)
];
var allHelpers = [];
var player = new Player();
