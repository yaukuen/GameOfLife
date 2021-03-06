var AM = new AssetManager();
var gameEngine;
var WIDTH = 20;
var HEIGHT = 20;
var RADIUS = 10;
var COLUMN = 1360 / 20;
var ROW = 800 / 20;

var socket = io.connect("http://76.28.150.193:8888");

socket.on("load", function (data) {
    gameEngine.entities = [];
    var savedEntities = data.x;
    for (var i = 0; i < savedEntities.length; i++) {
        var x = savedEntities[i].x;
        var y = savedEntities[i].y;
        var s = savedEntities[i].s;
        var state = savedEntities[i].state;
        var cooldown = savedEntities[i].cooldown;
        var preState = savedEntities[i].preState;
        var cell = new Cell(gameEngine, x, y, s);
        cell.state = state;
        cell.cooldown = cooldown;
        cell.preState = preState;
        //gameEngine.entities.push(cell);
        gameEngine.addEntity(cell);
    }
    console.log(data.x);
});

// socket.emit("save", { studentname: "Yau Kuen Tsang", statename: "aState", x:5 });
// socket.emit("load", { studentname: "Yau Kuen Tsang", statename: "aState" });
//socket.emit("load", { studentname: "Yau Kuen Tsang", statename: "theState" });

function SaveCell(x, y, s) {
    this.x = x;
    this.y = y;
    this.state = s;
    this.cooldown = 0;
    this.preState = this.state;
}

function save() {
    var saveEntities = [];
    for (var i = 0; i < gameEngine.entities.length; i++) {
        var x = gameEngine.entities[i].x;
        var y = gameEngine.entities[i].y;
        var s = gameEngine.entities[i].s;
        var state = gameEngine.entities[i].state;
        var cooldown = gameEngine.entities[i].cooldown;
        var preState = gameEngine.entities[i].preState;
        var cell = new SaveCell(x, y, s);
        cell.state = state;
        cell.cooldown = cooldown;
        cell.preState = preState;
        saveEntities.push(cell);
    }

    socket.emit("save", { studentname: "Yau Kuen Tsang", statename: "aState", x:saveEntities});
}
function load() {
    socket.emit("load", { studentname: "Yau Kuen Tsang", statename: "aState" });
}

window.onload = function () {
//     console.log("starting up da sheild");
//     var messages = [];
//     var field = document.getElementById("field");
//     var username = document.getElementById("username");
//     var content = document.getElementById("content");
//
//     socket.on("ping", function (ping) {
//         console.log(ping);
//         socket.emit("pong");
//     });
//
//     socket.on("sync", function (data) {
//         messages = data;
//         var html = '';
//         for (var i = 0; i < messages.length; i++) {
//             html += '<b>' + (messages[i].username ? messages[i].username : "Server") + ": </b>";
//             html += messages[i].message + "<br />";
//         }
//         content.innerHTML = html;
//         content.scrollTop = content.scrollHeight;
//         console.log("sync " + html);
//     });
//
//     socket.on("message", function (data) {
//         if (data.message) {
//             messages.push(data);
//             var html = '';
//             for (var i = 0; i < messages.length; i++) {
//                 html += '<b>' + (messages[i].username ? messages[i].username : "Server") + ": </b>";
//                 html += messages[i].message + "<br />";
//             }
//             content.innerHTML = html;
//             content.scrollTop = content.scrollHeight;
//         } else {
//             console.log("No message.");
//         }
//
//     });
//
//     field.onkeydown = function (e) {
//         if (e.keyCode === 13) {
//             var text = field.value;
//             var name = username.value;
//             console.log("message sent " + text);
//             socket.emit("send", { message: text, username: name });
//             field.value = "";
//         }
//     };

    socket.on("connect", function () {
        console.log("Socket connected.")
    });
    socket.on("disconnect", function () {
        console.log("Socket disconnected.")
    });
    socket.on("reconnect", function () {
        console.log("Socket reconnected.")
    });

};



function mouseCLick(e) {

}
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


function Cell(game, x, y, s) {
    // this.animation = new Animation(spritesheet, 189, 230, 5, 0.10, 14, true, 1);
    this.x = x;
    this.y = y;
    this.game = game;
    this.ctx = game.ctx;
    this.state = s;
    this.cooldown = 0;
    // console.log(this.state);
    // this.color = "Red";
    this.preState = this.state;
    this.removeFromWorld = false;
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
    } else if (this.preState === 1 && this.state == 0) {
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.x, this.y, 20, 20);
    } else {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(this.x, this.y, 20, 20);
        this.ctx.strokeStyle = 'black';
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
    if (this.cooldown > 0) this.cooldown -= this.game.clockTick;
    if (this.cooldown < 0) this.cooldown = 0;
    if (this.cooldown === 0) {
        // this.cooldown = 0.5;
        this.preState = this.state;
    }
}

Cell.prototype.update = function () {
    /*if (this.cooldown > 0) this.cooldown -= this.game.clockTick;
    if (this.cooldown < 0) this.cooldown = 0;*/
    if (/*this.cooldown ===0 &&*/ this.game.click) {
        /*this.cooldown = 3;*/
        // console.log("yes and {"+ this.game.click.x+", "+this.game.click.y+"}");
        if (this.game.click.x * WIDTH === this.x && this.game.click.y * HEIGHT === this.y) {
            console.log("my x, y = {"+this.x+", "+this.y+"}");
            console.log("click xy= {"+this.game.click.x+", "+this.game.click.y+"}");
            for (var i = 0; i < 3; i++) {
                for (j = 0; j < 3; j++) {
                    if ((i === 0 && (j === 0 || j === 1)) ||
                        (i === 2 && j === 0) ||
                        (i === 1 && j === 1)) {
                        this.game.board[(this.x / WIDTH) + i][(this.y / HEIGHT) + j].state = 0;
                        // this.game.board[(this.x / WIDTH) + i][(this.y / HEIGHT) + j].preState = 0;
                    } else {
                        this.game.board[(this.x / WIDTH) + i][(this.y / HEIGHT) + j].state = 1
                        // this.game.board[(this.x / WIDTH) + i][(this.y / HEIGHT) + j].preState = 1;;
                    }
                }
            }
            // console.log("my x, y = {"+this.x+", "+this.y+"}");
            // console.log("click xy= {"+this.game.click.x+", "+this.game.click.y+"}");
            this.game.click = false;
        }
    }
}

Cell.prototype.updateState = function () {
    // if (this.cooldown > 0) this.cooldown -= this.game.clockTick;
    // if (this.cooldown < 0) this.cooldown = 0;
    if (this.cooldown ===0) {
        this.cooldown = 0.1;
        var neighbors = 0;
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                if (this.game.board[(this.x / WIDTH) + i] === undefined
                    || this.game.board[(this.x / WIDTH) + i][(this.y / HEIGHT) + j] === undefined) {
                    continue;
                }
                neighbors += this.game.board[(this.x / WIDTH) + i][(this.y / HEIGHT) + j].preState;
            }
        }
        neighbors -= this.preState;
        if ((this.state === 1) && (neighbors < 2)) {
            this.state = 0;
        } else if ((this.state === 1) && (neighbors > 3)) {
            this.state = 0;
        } else if ((this.state === 0) && (neighbors === 3)) {
            this.state = 1;
        }
    }
}

function RandomStart() {
    console.log("random mode");
    for (var i = 0; i < COLUMN; i++) {
        for (var j = 0; j < ROW; j++) {
            var s = Math.floor(Math.random() * 2);
            gameEngine.addEntity(new Cell(gameEngine, i * WIDTH, j * HEIGHT, s));
        }
    }
}

var EACH_PATTERN = 17;

function Pulsar_Period_3() {
    console.log("Pulsar mode");
    for (var i = 0; i < COLUMN; i++) {
        for (var j = 0; j < ROW; j++) {
            if (((i % EACH_PATTERN === 3 || i % EACH_PATTERN === 4 || i % EACH_PATTERN === 5 ||
                i % EACH_PATTERN === 9 || i % EACH_PATTERN === 10 || i % EACH_PATTERN === 11) && i !== 0)
                && (j % EACH_PATTERN === 1 || j % EACH_PATTERN === 6 ||
                j % EACH_PATTERN === 8 || j % EACH_PATTERN === 13) && j !== 0) {
                gameEngine.addEntity(new Cell(gameEngine, i * WIDTH, j * HEIGHT, 1));
            } else if (((i % EACH_PATTERN === 1 || i % EACH_PATTERN === 6 ||
                i % EACH_PATTERN === 8 || i % EACH_PATTERN === 13) && i !== 0)
                && (j % EACH_PATTERN === 3 || j % EACH_PATTERN === 4 || j % EACH_PATTERN === 5 ||
                j % EACH_PATTERN === 9 || j % EACH_PATTERN === 10 || j % EACH_PATTERN === 11) && j !== 0) {
                gameEngine.addEntity(new Cell(gameEngine, i * WIDTH, j * HEIGHT, 1));
            }
            else {
                gameEngine.addEntity(new Cell(gameEngine, i * WIDTH, j * HEIGHT, 0));
            }
        }
    }
}

function deadMode() {
    console.log("dead mode");
    gameEngine.entities = [];
    for (var i = 0; i < COLUMN; i++) {
        for (var j = 0; j < ROW; j++) {
            gameEngine.addEntity(new Cell(gameEngine, i * WIDTH, j * HEIGHT, 0));
        }
    }
    console.log("Entities size: " + gameEngine.entities.length);
}

function randomMode() {
    // for (var i = 0; gameEngine.entities.length; i++) {
    //     gameEngine.entities
    // }
    console.log("random mode");
    gameEngine.entities = [];
    RandomStart();
    console.log("Entities size: " + gameEngine.entities.length);
}

function pulsarMode() {
    gameEngine.entities = [];
    Pulsar_Period_3();
    console.log("Entities size: " + gameEngine.entities.length);
}

AM.queueDownload("./img/RobotUnicorn.png");
AM.queueDownload("./img/guy.jpg");
AM.queueDownload("./img/mushroomdude.png");
AM.queueDownload("./img/runningcat.png");
AM.queueDownload("./img/background.jpg");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    // gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/background.jpg")));
    // gameEngine.addEntity(new MushroomDude(gameEngine, AM.getAsset("./img/mushroomdude.png")));
    // gameEngine.addEntity(new Cheetah(gameEngine, AM.getAsset("./img/runningcat.png")));
    // gameEngine.addEntity(new Guy(gameEngine, AM.getAsset("./img/guy.jpg")));

    RandomStart(gameEngine);
    //Pulsar_Period_3();
    // Nothing(gameEngine);

    console.log("All Done!");
});