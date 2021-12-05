// physics
const gravity = 0.01; // acceleration due to gravity

// raindrop / spawning
const dropInterval = 10; // time between raindrop spawn
const dropHeightRange = 300; // range of spawn heights above screen

// raindrop / appearance
const dropLength = 40; // length of each raindrop
const dropWidth = 3; // width of each raindrop

// environment (const, but can't use `color` until canvas is created)
var bgColor; // color of background
var floorColor; // color of floor

// splatter / animation
var splatterHeight;  // height at which raindrop turns into splatter (const, but depends on known height)
const splatterDuration = 500; // how long splatter animation lasts
const splatterRadius = 25; // radius that splatter grows to

// splatter / appearance
const splatterWidth = 1; // width of splatter ellipse line (strokeWeight)

// variables (non-const)
var raindrops = []; // stores all raindrops
var splatters = []; // stores all splatters
var lastDrop = 0; // timestamp of last raindrop
var lastFrame = -1; // timestamp of last frame


function createRaindrop(now) {
  let raindrop = {
    pos: createVector(random(width), -1*(10+random(dropHeightRange))),
    vel: createVector(0, 0),
    color: color(161, 198, 204) //random(100) + 140)
  }; 
  raindrops.push(raindrop);
  lastDrop = now; 
}

function createSplatter(now, pos, c) {
   let splatter = {
     pos: pos,
     startTime: now,
     color: c
   };
   splatters.push(splatter);
}

function setup() {
  createCanvas(1000, 600);
  
  // set up some constants
  bgColor = color(80, 90, 100);
  floorColor = color(40, 45, 50);
  splatterHeight = height - dropHeightRange/2;
  
  const d = new Date();
  lastFrame = d.getTime();
}

function draw() {
  // draw background
  background(bgColor);
  
  // draw floor
  strokeWeight(0);
  fill(floorColor);
  rect(0, 1.05*splatterHeight, width, height);
  
  // create a new raindrop every dropInterval milliseconds
  const d = new Date();
  let now = d.getTime();
  if (now - lastDrop > dropInterval) {
    createRaindrop(now);
  }
  
  strokeWeight(dropWidth);
  //strokeCap(ROUND); // already the default
  noFill();
  
  // raindrops
  for (let i=0; i<raindrops.length; i++) {
    let drop = raindrops[i];
    stroke(drop.color);
    
    // apply gravity
    drop.vel.y += gravity * ((now - lastFrame)/1000);
    drop.pos.y += drop.vel.y;
    
    // draw raindrops
    line(drop.pos.x, drop.pos.y, drop.pos.x, drop.pos.y+dropLength);
    
    // replace raindrop with splatter if hit floor
    if (drop.pos.y > splatterHeight) {
      let splatterPos = createVector(drop.pos.x, drop.pos.y + dropLength);
      createSplatter(now, splatterPos, drop.color);
      raindrops.splice(i, 1);
    }
    
    /*
    // remove raindrops that are off the screen
    if (raindrops[i].y > height) {
       raindrops.splice(i, 1);
    }*/
  }
  
  strokeWeight(splatterWidth);
  
  // splatters
  for (let i=0; i<splatters.length; i++) {
    let splatter = splatters[i];
    stroke(splatter.color);
    
    let splatterTime = now - splatter.startTime;
    
    // current splatter radius depends on lifespan
    let r = splatterRadius * (splatterTime/splatterDuration);
    ellipse(splatter.pos.x, splatter.pos.y, r, r*0.4);
    
    // remove splatters that are past duration
    if (splatterTime > splatterDuration) {
      splatters.splice(i, 1); 
    }
  }
}
