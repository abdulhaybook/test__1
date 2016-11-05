var canvas = document.getElementById("gameWindow");
var context = canvas.getContext("2d");
var game, snake, food;

// Setting responsive dimensions for the canvas
window.onload = function () {
  context.canvas.width = Math.floor(window.innerWidth )- 30;
  context.canvas.height = Math.floor(window.innerHeight * 0.9) - 30;
}

// Main wrapper object of the game
game = {

  score: 0,               // Score of the play
  level: 0,               // Level of the play
  fps: 60,                // TODO: current version works with fixed Frames Per Second, modify it to be actual FPS
  over: true,             // Game over flag
  paused: false,          // Pause flag
  countDown: 0,           // CountDown timer for gentle beggining of the game
  resuming: false,        // Flag set when snake lost life and beggining with new life
  message: 'START THE GAME', // Message to print on canvas

  start: function() {
    game.over = false;
    game.paused = false;
    game.level = 1;
    game.countDown = 0;
    game.resuming = true;
    game.message = null;
    game.score = 0;
    snake.init(3, null);
    food.set();
  },

  stop: function() {
    game.over = true;
    game.message = 'GAME OVER';
    game.checkScore();
  },

  pause: function() {
    game.message = 'PAUSED';
    game.paused = true;
  },

  drawCell: function(x, y, size, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, (size / 2), 0, 6.28); // 6.28 = 2 * Math.PI
    context.closePath();
    context.fill();
  },

  updateScore: function() {
    $('#score').text(game.score);
    $('#level').text(game.level);
    updateLives(snake.lives);
  },

  drawCount: function(now) {
    if (game.countDown == 0) {
      game.countDown = now + 3000;
    } else {
      context.fillStyle = '#999';
      context.font = (canvas.height) + 'px Arial, sans-serif';
      context.textAlign = 'center';
      context.fillText(Math.ceil((game.countDown - now)/1000), canvas.width / 2, canvas.height * 0.9);
      if (game.countDown - now < 100) {
        game.countDown = 0;
        game.resuming = false;
      }
    }
  },

  drawMessage: function() {
    if (game.message !== null) {
      context.fillStyle = '#337AB7';
      context.font = (canvas.height / 10) + 'px Arial, sans-serif';
      context.textAlign = 'center';
      context.fillText(game.message, canvas.width / 2, canvas.height / 2);
    }
  },

  resetCanvas: function() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  },

  checkScore: function() {
    var max = 0;
    var val = 0;
    for (var i = 0; i < localStorage.length; i++) {
          val = parseInt(localStorage.getItem(localStorage.key(i)));
          if (max < val) max = val;
          console.log(localStorage.key(i) + ' ' + localStorage.getItem(localStorage.key(i)));
    }

    if (game.score > max) {
      $('#highScore').find('#newScore').text(game.score);
      $('#highScore').modal('show');
    }
  }
};

// Instantiator of the snake object
snake = {

  size: null,           // Width of the snake
  lives: 3,
  velocity: null,
  color: '#5CB85C',
  direction: 'left',
  x: null,
  y: null,
  sections: [],         // Array of coordinates of circles building the snake

  init: function(lives, velocity) {
    snake.size = Math.floor(canvas.width * canvas.height / 12000);
    snake.lives = lives;
    snake.velocity = (velocity != null ? velocity : snake.size * 8);
    snake.direction = 'left';
    snake.x = canvas.width / 2;
    snake.y = canvas.height / 2;
    snake.sections = [];
    for (var i = 15; i >= 0; i--) {
      snake.sections.push([snake.x + Math.floor(snake.velocity/game.fps) * i, snake.y]);
    }
  },

  move: function() {
    switch (snake.direction) {
      case 'up':
        snake.y -= snake.velocity/game.fps;
        break;
      case 'down':
        snake.y += snake.velocity/game.fps;
        break;
      case 'left':
        snake.x -= snake.velocity/game.fps;
        break;
      case 'right':
        snake.x += snake.velocity/game.fps;
        break;
    }
    snake.sections.push([snake.x, snake.y]);
    snake.sections.shift();
    snake.checkCollision();
    snake.checkGrowth();
  },

  draw: function() {
    for (var i = 0; i < snake.sections.length; i++) {
      snake.drawSection(snake.sections[i]);
    }
  },

  drawSection: function(section) {
    game.drawCell(section[0], section[1], snake.size, snake.color);
  },

  checkCollision: function() {
    if (snake.isCollision(snake.x, snake.y) === true) {
      if (--snake.lives) {
        setTimeout(function(){snake.init(snake.lives, snake.velocity)}, 1000);
        game.resuming = true;
      } else {
        game.stop();
      }
    }
  },

  isCollision: function(x, y) {
    if (x < snake.size / 2 ||
      y < snake.size / 2 ||
      x > canvas.width - snake.size / 2 ||
      y > canvas.height - snake.size / 2) {
        return true;
      }
  },

  checkGrowth: function() {
    if (snake.x < food.x + snake.size * 3/4 &&
      snake.x > food.x - snake.size * 3/4 &&
      snake.y > food.y - snake.size * 3/4 &&
      snake.y < food.y + snake.size * 3/4)
    {
      game.score += 30;
      if (game.score % 50 == 0) {
        game.level++;
        if(game.level < 11) snake.velocity *= 1.1;
      }
      food.set();
      snake.sections.push([snake.x, snake.y]);
    }
  }
};

food = {

  size: null,           // Width of the food
  x: null,
  y: null,
  color: '#A94442',

  set: function() {
    food.size = snake.size;
    food.x = (Math.ceil(Math.random() * (canvas.width - snake.size))) + snake.size / 2;
    food.y = (Math.ceil(Math.random() * (canvas.height - snake.size))) + snake.size / 2;
  },

  draw: function() {
    game.drawCell(food.x, food.y, food.size, food.color);
  }

};

var inverseDirection = {
  'up': 'down',
  'left': 'right',
  'right': 'left',
  'down': 'up'
};

// Control keys: (wasd), (hjkl), arrow, spacebar and enter keys.
var keys = {
  up: [38, 75, 87],
  down: [40, 74, 83],
  left: [37, 65, 72],
  right: [39, 68, 76],
  start_stop: [13, 32]
};

function getKey(value){
  for (var key in keys){
    if (keys[key] instanceof Array && keys[key].indexOf(value) >= 0){
      return key;
    }
  }
  return null;
}

addEventListener("keydown", function (e) {
  var lastKey = getKey(e.keyCode);
  if (['up', 'down', 'left', 'right'].indexOf(lastKey) >= 0
    && lastKey != inverseDirection[snake.direction]) {
      snake.direction = lastKey;
    } else if (['start_stop'].indexOf(lastKey) >= 0 && game.over) {
      game.start();
    } else if (['start_stop'].indexOf(lastKey) >= 0 && game.paused) {
      game.paused = false;
      game.message = null;
    } else if (['start_stop'].indexOf(lastKey) >= 0 && !(game.paused || game.over)) {
      game.pause();
    }
}, false);

// Optimization for animation, support only for latest browsers.
// TODO: to support more browsers add better initialization of requestAnimationFrame
var requestAnimationFrame = window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      window.mozRequestAnimationFrame;

function loop(now) {
  game.drawMessage();
  game.updateScore();
  if (!game.over && !game.paused) {
    game.resetCanvas();

    if(game.resuming) {
      game.drawCount(now);
    } else {
      snake.move();
    }

    food.draw();
    snake.draw();
  }

  requestAnimationFrame(loop);
}

loop();