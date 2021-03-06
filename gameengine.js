window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (/* function */ callback, /* DOMElement */ element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

function GameEngine() {
    this.entities = [];
    this.board = new Array(COLUMN);
    // var x = new Array(10);
    // for (var i = 0; i < 10; i++) {
    //     x[i] = new Array(20);
    // }
    for (var i = 0; i < COLUMN; i++) {
        this.board[i] = new Array(ROW);
    }
    this.preStateEntities = [];
    this.ctx = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
}

GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.timer = new Timer();
    this.startInput();
    console.log('game initialized');
}

GameEngine.prototype.start = function () {
    console.log("starting game");
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

GameEngine.prototype.startInput = function () {
    console.log('Starting input');

    var getXandY = function (e) {
        var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
        var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;

        // if (x < 1024) {
        //     x = Math.floor(x / 32);
        //     y = Math.floor(y / 32);
        // }
        if (x < 1360 && y < 800) {
            x = Math.floor(x / 20);
            y = Math.floor(y / 20);
        }

        return {x: x, y: y};
    }

    var that = this;

    // event listeners are added here

    this.ctx.canvas.addEventListener("click", function (e) {
        that.click = getXandY(e);
        // console.log(e);
        // console.log("Left Click Event - X,Y " + e.clientX + ", " + e.clientY);
    }, false);

    this.ctx.canvas.addEventListener("contextmenu", function (e) {
        that.click = getXandY(e);
        // console.log(e);
        // console.log("Right Click Event - X,Y " + e.clientX + ", " + e.clientY);
        e.preventDefault();
    }, false);

    this.ctx.canvas.addEventListener("mousemove", function (e) {
        //console.log(e);
        that.mouse = getXandY(e);
    }, false);

    this.ctx.canvas.addEventListener("mousewheel", function (e) {
        //console.log(e);
        that.wheel = e;
        //console.log("Click Event - X,Y " + e.clientX + ", " + e.clientY + " Delta " + e.deltaY);
    }, false);

    this.ctx.canvas.addEventListener("keydown", function (e) {
        //console.log(e);
        //console.log("Key Down Event - Char " + e.code + " Code " + e.keyCode);
    }, false);

    this.ctx.canvas.addEventListener("keypress", function (e) {
        if (e.code === "KeyD") that.d = true;
        that.chars[e.code] = true;
        //console.log(e);
        //console.log("Key Pressed Event - Char " + e.charCode + " Code " + e.keyCode);
    }, false);

    this.ctx.canvas.addEventListener("keyup", function (e) {
        //console.log(e);
        //console.log("Key Up Event - Char " + e.code + " Code " + e.keyCode);
    }, false);

    //console.log('Input started');
}

GameEngine.prototype.addEntity = function (entity) {
    //console.log('added entity');
    this.entities.push(entity);
    // console.log("ent {"+entity.x+","+entity.y+"}");
    this.board[entity.x / WIDTH][entity.y / HEIGHT] = entity;
    // console.log("{"+this.board[entity.x/WIDTH][entity.y/HEIGHT].x
    // +","+this.board[entity.x/WIDTH][entity.y/HEIGHT].y+"}");
}

GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
    this.ctx.save();
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(this.ctx);
    }
    // This two for loop will draw a grid line on the canvas
    for (var i = 20; i < 1360; i += 20) {
        this.ctx.beginPath();
        this.ctx.moveTo(i, 0);
        this.ctx.lineTo(i, 800);
        this.ctx.stroke();
    }
    for (var j = 20; j < 800; j += 20) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, j);
        this.ctx.lineTo(1360, j);
        this.ctx.stroke();
    }
    // this.ctx.fillRect(25, 25, 100, 100);
    // this.ctx.clearRect(45, 45, 60, 60);
    // this.ctx.strokeRect(50, 50, 50, 50);
    // this.ctx.beginPath();
    // this.ctx.arc(75, 50, 5, 0, Math.PI * 2, false);
    // this.ctx.arc(100, 75, 5, 0, Math.PI * 2, false);
    // this.ctx.arc(100, 25, 5, 0, Math.PI * 2, false);
    // this.ctx.moveTo(75, 50);
    // this.ctx.lineTo(100, 75);
    // this.ctx.lineTo(100, 25);
    // this.ctx.fill();
    // this.ctx.stroke();

    this.ctx.restore();
}

GameEngine.prototype.update = function () {
    var entitiesCount = this.entities.length;

    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];
        entity.update();
    }

    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];
        entity.updatePre();
    }

    /*for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];
        entity.update();
    }*/
    // for (var column = 1; column < (1360 / 20) - 1; column++) {
    //     for (var row = 1; row < (800 / 20) - 1; row++) {
    //          //
    //          // for (var i = 0; i < entitiesCount; i++) {
    //          //     var entity = this.entities[i];
    //          //     entity.update();
    //          // }
    //     }
    // }

    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];
        entity.updateState();
    }

}

GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick();
    this.update();
    this.draw();
}

function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}

// function Entity(game, x, y) {
//     this.game = game;
//     this.x = x;
//     this.y = y;
//     this.removeFromWorld = false;
// }
//
// Entity.prototype.update = function () {
// }
//
// Entity.prototype.draw = function (ctx) {
//     if (this.game.showOutlines && this.radius) {
//         this.game.ctx.beginPath();
//         this.game.ctx.strokeStyle = "green";
//         this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
//         this.game.ctx.stroke();
//         this.game.ctx.closePath();
//     }
// }
//
// Entity.prototype.rotateAndCache = function (image, angle) {
//     var offscreenCanvas = document.createElement('canvas');
//     var size = Math.max(image.width, image.height);
//     offscreenCanvas.width = size;
//     offscreenCanvas.height = size;
//     var offscreenCtx = offscreenCanvas.getContext('2d');
//     offscreenCtx.save();
//     offscreenCtx.translate(size / 2, size / 2);
//     offscreenCtx.rotate(angle);
//     offscreenCtx.translate(0, 0);
//     offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
//     offscreenCtx.restore();
//     //offscreenCtx.strokeStyle = "red";
//     //offscreenCtx.strokeRect(0,0,size,size);
//     return offscreenCanvas;
// }