var AM = new AssetManager();
var WIDTH = 20;
var HEIGHT = 20;
var RADIUS = 10;
var COLUMN = 1360/20;
var ROW = 800/20;

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
        xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
        this.frameWidth, this.frameHeight,
        x, y,
        this.frameWidth * this.scale,
        this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
// function Background(game, spritesheet) {
//     this.x = 0;
//     this.y = 0;
//     this.spritesheet = spritesheet;
//     this.game = game;
//     this.ctx = game.ctx;
// };
//
// Background.prototype.draw = function () {
//     this.ctx.drawImage(this.spritesheet,
//         this.x, this.y);
// };
//
// Background.prototype.update = function () {
// };


function Cell(game, x, y) {
    // this.animation = new Animation(spritesheet, 189, 230, 5, 0.10, 14, true, 1);
    this.x = x;
    this.y = y;
    this.game = game;
    this.ctx = game.ctx;
    this.state = Math.floor(Math.random() * 2);
    // console.log(this.state);
    // this.color = "Red";
    this.preState = this.state;
    // Entity.call(this, game, 0, 250);
}
//
// Cell.prototype = new Entity();
// Cell.prototype.constructor = Cell;

Cell.prototype.draw = function () {
    // dead -> alive = blue
    // alive -> dead = red
    // stay alive = black
    // stay white = white
    // this.ctx.beginPath();
    // this.ctx.fillStyle = this.color;
    // this.ctx.arc(this.x + RADIUS, this.y + RADIUS, RADIUS, 0, Math.PI * 2, false);
    // this.ctx.fill();
    // this.ctx.closePath();

    // if (this.preState === 0 && this.state === 1) {
    //     this.ctx.strokeStyle = 'blue';
    // } else if (this.state === 1) {
    //     this.ctx.strokeStyle = 'black';
    // } else if (this.preState ===1 && this.state == 0) {
    //     this.ctx.strokeStyle = 'red';
    // } else {
    //     this.ctx.strokeStyle = 'white';
    // }
    // this.ctx.strokeRect(this.x, this.y, 20, 20);
    // if (this.ctx.fillStyle === 'white') {
    //     this.ctx.strokeStyle = 'black';
    //     this.ctx.strokeRect(this.x, this.y, 20, 20);
    // }
    /*if (this.preState === 0 && this.state === 1) {
        this.ctx.fillStyle = 'blue';
    } else if (this.state === 1) {
        this.ctx.fillStyle = 'black';
    } else if (this.preState ===1 && this.state == 0) {
        this.ctx.fillStyle = 'red';
    } else {
        this.ctx.fillStyle = 'white';
    }
    this.ctx.fillRect(this.x, this.y, 20, 20);*/
    if (this.preState === 0 && this.state === 1) {
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(this.x, this.y, 20, 20);
    } else if (this.state === 1) {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(this.x, this.y, 20, 20);
    } else if (this.preState ===1 && this.state == 0) {
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.x, this.y, 20, 20);
    } else {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(this.x, this.y, 20, 20);
        this.ctx.strokeStyle='black';
        this.ctx.strokeRect(this.x, this.y, 20, 20);
    }

}


Cell.prototype.updatePre = function () {
    // for (var i = 0; i<COLUMN; i++) {
    //     for (var j = 0; j <rows; j++) {
    //
    //     }
    // }
    // for (var i = 0; i < this.game.entities.length; i++) {
    //     var ent = this.game.entities[i];
    //     ent.preState = ent.state
    // }
    this.preState = this.state;
}

Cell.prototype.updateState = function () {
    var neighbors = 0;
    for(var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
            if (this.game.board[(this.x/WIDTH)+i] === undefined
            || this.game.board[(this.x/WIDTH)+i][(this.y/HEIGHT)+j] === undefined) {
                continue;
            }
            neighbors += this.game.board[(this.x/WIDTH)+i][(this.y/HEIGHT)+j].preState;
        }
    }
    neighbors -= this.preState;
    if ((this.state ===1)&& (neighbors < 2) ) {
        this.state = 0;
    } else if ((this.state === 1) && (neighbors > 3)) {
        this.state = 0;
    } else if ((this.state === 0) && (neighbors === 3)) {
        this.state = 1;
    }
}

function RandomStart(gameEngine) {
    for (var i = 0; i < COLUMN; i++) {
        for (var j = 0; j<ROW; j++) {
            gameEngine.addEntity(new Cell(gameEngine,i*WIDTH, j*HEIGHT));
        }
    }
}

AM.queueDownload("./img/RobotUnicorn.png");
AM.queueDownload("./img/guy.jpg");
AM.queueDownload("./img/mushroomdude.png");
AM.queueDownload("./img/runningcat.png");
AM.queueDownload("./img/background.jpg");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    // gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/background.jpg")));
    // gameEngine.addEntity(new MushroomDude(gameEngine, AM.getAsset("./img/mushroomdude.png")));
    // gameEngine.addEntity(new Cheetah(gameEngine, AM.getAsset("./img/runningcat.png")));
    // gameEngine.addEntity(new Guy(gameEngine, AM.getAsset("./img/guy.jpg")));

    RandomStart(gameEngine);

    console.log("All Done!");
});