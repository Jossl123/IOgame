const express = require("express");
const WebSocket = require('ws');
const http = require('http');
const PORT = 4000;

const app = express();
const bodyParser = require('body-parser')
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

function generate_color() {
    return "#" + ((1<<24)*Math.random() | 0).toString(16)
}

var games = {
    "first": {
        players: []
    }
}

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        message = JSON.parse(message)
        var title = message.title
        var body = message.body
        switch (title) {
            case "joinGame":
                games.first.players.push(ws)
                ws.infos = {
                    pos: {x: 10, y: 10},
                    name: generate_token(10),
                    color: generate_color(),
                    size: 10,
                    speed: 3
                }
                var oppoObj = {}
                for(let client of games.first.players){
                    if (client != ws){
                        oppoObj[client.infos.name] = client.infos
                        client.send(JSON.stringify({
                            title: "newPlayer",
                            body: ws.infos
                        }))
                        ws.send(JSON.stringify({
                            title: "opponentPos",
                            body: client.infos
                        }))
                    }
                }
                ws.send(JSON.stringify({
                    title: "youJoinGame",
                    body: {
                        you: ws.infos,
                        opponents: oppoObj
                    }
                }))
                break;

            case "playerPos":
                ws.infos = body
                for(let client of games.first.players){
                    if (client != ws){
                        client.send(JSON.stringify({
                            title: "opponentPos",
                            body: ws.infos
                        }))
                    }
                }
                break;

            default:
                console.log(message)
                break;
        }
    });
    ws.on("close", () => {
        games.first.players.splice(games.first.players.indexOf(ws), 1)
    });
});

app.use(express.static(__dirname + '/public/'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
});

app.get("/game", (req, res) => {
    res.sendFile(__dirname + '/views/game.html')
});

app.get("/getGameList", (req, res) => {
    res.json(games)
});

server.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});

//génère un code unique
function generate_token(length) {
    var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    var b = [];
    for (var i = 0; i < length; i++) {
        var j = (Math.random() * (a.length - 1)).toFixed(0);
        b[i] = a[j];
    }
    return b.join("");
}