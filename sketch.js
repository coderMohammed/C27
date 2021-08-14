const Engine = Matter.Engine;
const World= Matter.World;
const Bodies = Matter.Bodies;

var tower,ground,cannon,cannonBall;
var engine, world;
var balls=[];
var boats = [];
var boat;
var boatAnimation = [];
var brokenBoatAni = [];
var boatSpriteData,boatSpriteSheet;
var brokenBoatJSON,brokenBoatSpriteSheet

function preload(){
    bgd = loadImage("assets/background.gif");

    boatSpriteData =loadJSON("assets/boat/boat.json"); 
    boatSpriteSheet = loadImage("assets/boat/boat.png");

    brokenBoatJSON =loadJSON("assets/brokenboat/brokenboat.json"); 
    brokenBoatSpriteSheet = loadImage("assets/brokenboat/brokenboat.png");
}

function setup(){
    var canvas = createCanvas(1200,600);
    engine = Engine.create();
    world = engine.world;

    angle = -PI/4

    tower = new Tower(150, 350, 160, 310);
    ground = new Ground(600,580,1200,20)
    cannon = new Cannon(180, 110, 100, 50, angle);

    var boatFrames = boatSpriteData.frames;
    
    for(var i=0; i<boatFrames.length; i++){
        var pos = boatFrames[i].position;
        var img = boatSpriteSheet.get(pos.x,pos.y,pos.w,pos.h);
        boatAnimation.push(img);
    }
    
    var brokenBoatFrames = brokenBoatJSON.frames;
    
    for(var i = 0; i<brokenBoatFrames.length; i++){
        var pos = brokenBoatFrames[i].position;
        var img = brokenBoatSpriteSheet.get(pos.x,pos.y,pos.w,pos.h);
        brokenBoatAni.push(img);
    }
   
}

function draw(){
    background(220);
    imageMode(CENTER);
    image(bgd,600,300,1200,600);
    //image(boatAnimation,200,200,200,200);
    Engine.update(engine);
   
    tower.display();
    cannon.display();
    showBoats();

    for(var i=0; i< balls.length; i++){
        showCannonBalls(balls[i],i);
        for(var j=0 ; j<boats.length ; j++){
            if(balls[i]!== undefined && boats[i]!== undefined){
                var collision = Matter.SAT.collides(balls[i].body,boats[j].body);
                //console.log(collision);
                if(collision.collided){

                        boats[j].remove(j);
                        Matter.World.remove(world,balls[i].body);
                        balls.splice(i,1);
                        i--;
                    
                console.log("Inside If");
                }
            }
        }
    }
}

function keyReleased(){
    if(keyCode === DOWN_ARROW){
        balls[balls.length-1].shoot();
    }
   
}

function keyPressed(){
    if(keyCode === DOWN_ARROW){
        cannonBall = new CannonBall(cannon.x,cannon.y);
        balls.push(cannonBall);
    }
}

function showCannonBalls(ball,index){
    ball.display();
    if(ball.body.position.x >= width || ball.body.position.y>= height-150){
        World.remove(world,ball.body);
        balls.splice(index,1);
    }
}

function showBoats(){
    
    if(boats.length > 0){
        if(boats.length < 4 && boats[boats.length-1].body.position.x  < width-300){
            var positions = [-50,-20,-10,-40];
            var pos = random(positions);
            boat = new Boat(width,height-100,200,200,pos,boatAnimation);
            boats.push(boat);
        }
        for(var i = 0; i< boats.length; i++){
            boats[i].display();
            boats[i].animate();
            Matter.Body.setVelocity(boats[i].body, {x: -0.9,y:0});
        }    
    }
    else{
        
        boat = new Boat(width,height-100,200,200,-10,boatAnimation);
        boats.push(boat);
    }
}