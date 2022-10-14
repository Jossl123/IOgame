var canvas
var ctx
class Vector2d {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    normalize() {
        return this.divide(this.length())
    }
    add(v) {
        if (v instanceof Vector2d) return new Vector2d(this.x + v.x, this.y + v.y, this.z + v.z);
        else return new Vector2d(this.x + v, this.y + v, this.z + v);
    }
    divide(v) {
        if (v instanceof Vector2d) return new Vector2d(this.x / v.x, this.y / v.y, this.z / v.z);
        else return new Vector2d(this.x / v, this.y / v, this.z / v);
    }
    length() {
        return Math.sqrt(this.dot(this));
    }
    equals(v) {
        return this.x == v.x && this.y == v.y ;
    }
    dot(v) {
        return this.x * v.x + this.y * v.y ;
    }
}


var player = {
    pos: new Vector2d(10, 10),
    speed: 3,
    dir: new Vector2d(0, 0),
    color: "#000000"
}
var isKeyDown = false
var keyDown = 0

var ws = new WebSocket(`ws:${window.location.host}//`, "protocolOne");
var opponents = {}
class Food {
    constructor(x, y, r) {
        this.pos = { x: x, y: y }
        this.r = r
    }
}
var food = new Food(Math.random() * 200, Math.random() * 300, 3)

window.onload = function() {
    document.addEventListener("keydown", keydown);
    document.addEventListener("keyup", keyup);
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    ctx.canvas.width = window.innerWidth
    ctx.canvas.height = window.innerHeight
    drawPlayers()
}

ws.onopen = function() {
    ws.send(JSON.stringify({
        title: "joinGame"
    }))
}

ws.onmessage = function(message) {
    message = JSON.parse(message.data)
    switch (message.title) {
        case "youJoinGame":
            player = message.body.you
            player.dir = new Vector2d(player.dir.x, player.dir.y)
            player.pos = new Vector2d(player.pos.x, player.pos.y)
            opponents = message.body.opponents
            drawPlayers()
            break;

        case "newPlayer":
            opponents[message.body.name] = message.body
            break;

        case "opponentPos":
            opponents[message.body.name] = message.body
            drawPlayers()
            break;

        default:
            break;
    }
}

ws.onclose = function() {
    window.location.replace("/")
}

function drawPlayers() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.beginPath();
    // ctx.rect(10, 20, 10,20);
    // ctx.fillStyle = 'limegreen';
    // ctx.fill();
    for (let opponentName in opponents) {
        var opponent = opponents[opponentName]
        if (getDistToCircle(player.pos, opponent.pos, opponent.r + player.size) <= 0) {
            bounceToBall(player.pos, opponent.pos)
        }
        ctx.beginPath();
        ctx.arc(opponent.pos.x, opponent.pos.y, opponent.size, 0, Math.PI * 2);
        ctx.fillStyle = opponent.color;
        ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(player.pos.x, player.pos.y, player.size, 0, Math.PI * 2)
    ctx.fillStyle = player.color;
    ctx.fill();
    drawFood()
}

function drawFood() {
    ctx.beginPath();
    ctx.arc(food.pos.x, food.pos.y, food.r, 0, Math.PI * 2)
    ctx.fillStyle = player.color;
    ctx.fill();
}

function bounceToBall(p1, p2) {
    var v = p2.copy().sub(p1)
    player.dir = player.dir.add(v.normalize())
}

setTimeout(function() {
    var interval = setInterval(function() {
        if (isKeyDown) {
            console.log("test")
            move(keyDown)
        }
    }, 0);
}, 100);

function move(keyCode) {
    switch (keyCode) {
        case 38:
            player.dir.y -= player.speed
            break;
        case 40:
            player.dir.y += player.speed
            break;
        case 37:
            player.dir.x -= player.speed
            break;
        case 39:
            player.dir.x += player.speed
            break;
        default:
            break;
    }
    player.dir=player.dir.normalize()
    player.pos = player.pos.add(player.dir)
    drawPlayers()
    ws.send(JSON.stringify({
            title: "playerPos",
            body: player
        }))
        //si je touche la nouriture
    if (getDistToCircle(player.pos, food.pos, food.r + player.size) <= 0) {
        grow()
        food = new Food(Math.random() * 200, Math.random() * 300, 3)
    }
}

function keydown(event) {
    isKeyDown = true
    keyDown = event.keyCode
}

function keyup(event) {
    isKeyDown = false
}

function grow() {
    player.size++
}

window.onresize = function() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
}

function getDistToCircle(v1, v2, r) {
    return Math.sqrt((v1.x - v2.x) * (v1.x - v2.x) + (v1.y - v2.y) * (v1.y - v2.y)) - r
}