/*--------------------------------------------------------*/
var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var kangaroo, kangaroo_running , kangaroo_collided;
var jungle, invisiblejungle;
var invisibleGround
var obstaclesGroup, obstacle1;

var score=0;

var gameOver, restart;

function preload(){
  kangaroo_running =   loadAnimation("assets/kangaroo1.png","assets/kangaroo2.png","assets/kangaroo3.png");
  kangaroo_collided = loadAnimation("assets/kangaroo1.png");
  jungleImage = loadImage("assets/bg.png");
  shrub1 = loadImage("assets/shrub1.png");
  shrub2 = loadImage("assets/shrub2.png");
  shrub3 = loadImage("assets/shrub3.png");
  obstacle1 = loadImage("assets/stone.png");
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
  jumpSound = loadSound("assets/jump.wav");
  collidedSound = loadSound("assets/collided.wav");
}

function setup() {
  createCanvas(800, 400);

  jungle = createSprite(400,100,400,20);
  jungle.addImage("jungle",jungleImage);
  jungle.scale=0.3
  jungle.x = width /2;


  /*Create a sprite for the kangaroo:
Apply Kangaroo_running and kangaroo_collided animation to it. Scale the kangaroo if required.
Set the collider of the kangaroo as a circle and the radius of the collider as 300
*/
   kangaroo = createSprite(200,200,40,40);
   kangaroo.addAnimation("running",kangaroo_running);
   kangaroo.addAnimation("collided",kangaroo_collided)
  // kangaroo.visible = false;
  kangaroo.debug = true;
  kangaroo.setCollider("circle",0,0,300)
  kangaroo.scale = 0.1;
  //jungle.depth = kangaroo.depth+1
  // kangaroo.addAnimation("Collide",kangaroo_collided);
   
//Create a sprite for Invisible ground and place it at the bottom side of the screen.
   invisibleGround = createSprite(200,380,800,100);
   invisibleGround.visible = false
  
  shrubsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;

}

function draw() {
  background(255);
  
//In function draw(), Set the x-Position of the kangaroo according to the camera    
  camera.position.x = kangaroo.positionX

  if (gameState===PLAY){

    jungle.velocityX=-3

    if(jungle.x<100)
    {
       jungle.x=400
    }
   console.log(kangaroo.y)
    if(keyDown("space")&& kangaroo.y>270) {
      jumpSound.play();
      kangaroo.velocityY = -16;
    }
  
    kangaroo.velocityY = kangaroo.velocityY + 0.8
    spawnShrubs();
    spawnObstacles();

    kangaroo.collide(invisibleGround);
    
    if(obstaclesGroup.isTouching(kangaroo)){
      collidedSound.play();
      gameState = END;
    }
    if(shrubsGroup.isTouching(kangaroo)){
      score+=1
      shrubsGroup.destroyEach();
    }
  }
  else if (gameState === END) {
    //set velcity of each game object to 0
    kangaroo.velocityY = 0;
    jungle.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    shrubsGroup.setVelocityXEach(0);

    //change the kangaroo animation
    kangaroo.changeAnimation("collided",kangaroo_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    shrubsGroup.setLifetimeEach(-1);
    
  }

  
  drawSprites();
  textSize(20);
  fill("red");
  text("Score: "+score,20,50);

}

function spawnShrubs() {
  //write code here to spawn the clouds
  if (frameCount % 150 === 0) {
  var shrub = createSprite(600,330,40,40);
//Set the x-position of the shrub according to the game camera.
    shrub.velocityX = -(6 + 3*score/10)
    shrub.scale = 0.6;

    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: shrub.addImage(shrub1);
              break;
      case 2: shrub.addImage(shrub2);
              break;
      case 3: shrub.addImage(shrub3);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the shrub           
    shrub.scale = 0.05;
     //assign lifetime to the variable
    shrub.lifetime = 400;
    shrub.depth = kangaroo.depth;
    shrub.debug = true;
    shrub.setCollider("rectangle",0,0,shrub.width/2,shrub.height/2)
    //add each cloud to the group
    shrubsGroup.add(shrub);
    
  }
  
}

function spawnObstacles() {
  if(frameCount % 120 === 0) {

    var obstacle = createSprite(600,330,40,40);
    obstacle.setCollider("rectangle",0,0,200,200)
    obstacle.addImage(obstacle1);
    obstacle.velocityX = -(6 + 3*score/10)
    obstacle.scale = 0.15;
    //assign scale and lifetime to the obstacle           
    obstacle.depth = kangaroo.depth;
    obstacle.lifetime = 400;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
    
  }
}
