








//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird

let birdHeight = 24;
let birdWidth = 34;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight,
};

let pipeArray = [];
let pipeWidth = 128;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//game physics
let velocityX = -2; // pipes moving to the left
let velocityY = 0; // bird jump speed
let gravity = 0.4;

//gameOver
let gameOver = false;

//score
let score=0;

window.onload = function () {
  board = document.getElementById("board");
  board.width = boardWidth;
  board.height = boardHeight;
  context = board.getContext("2d"); //drawing on the board

  //draw bird
  context.fillStyle = "green";
  context.fillRect(bird.x, bird.y, bird.width, bird.height);
  //laod images
  birdImg = new Image();
  birdImg.src = "angry-birds.png";
  birdImg.onload = function () {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  };

  topPipeImg = new Image();
  topPipeImg.src = "pillar.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "pillar.png";

  requestAnimationFrame(update);
  setInterval(placePipes, 2200); //every 1.5 seconds
  document.addEventListener("keydown", moveBird);
};

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }
  context.clearRect(0, 0, board.width, board.height);
  //bird
  velocityY += gravity;
  bird.y +=velocityY;
 // bird.y = Math.max(bird.y + gravity, 0);//apply gravity to current bird.y
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  if(bird.y >board.height){
    gameOver=true;
  }

  //pipe
  for (i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if (!pipe.passed && bird.x>pipe.x +pipe.width){
        score+=0.5;
        pipe.passed=true;
    }

    if (detectCollision(bird, pipe)) {
      gameOver = true;
    }
  }

  //clear pipe

  while(pipeArray.length > 0 && pipeArray[0].x<-pipeWidth){
    pipeArray.shift();
  }
  //drew score
  context.fillStyle='white';
  context.font="45px sans-serif";
  context.fillText(score,5,45)

  if(gameOver){
    context.fillText('GAME OVER !', 5, 90)
  }
}

function placePipes() {
  if (gameOver) {
    return;
  }
  let randomPipeY = pipeY - pipeHeight / 4 - Math.random() *( pipeHeight / 2);
  let openingSpace = board.height / 4;
  let topPipes = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };

  pipeArray.push(topPipes);

  let bottomPipes = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(bottomPipes);
}

function moveBird(e) {
  if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
    //jump
    velocityY = -8;
  }
  if(gameOver){
    bird.y=birdY;
    pipeArray=[];
    score=0;
    gameOver=false;
  }
}

function detectCollision(a,b) {
  return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
}
