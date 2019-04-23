var ws = require("nodejs-websocket");

console.log("開始建立連接...")

var game1 = null, game2 = null, game1Ready = false, game2Ready = false;

var server = ws.createServer(function (conn) {
    conn.on("text", function (str) {
        console.log("收到的信息為:" + str)
        if (str === "game1") {
            game1 = conn;
            game1Ready = true;
            conn.sendText("success");
        }

        if (str === "game2") {
            game2 = conn;
            game2Ready = true;
        }

        if (game1Ready && game2Ready) {
            game2.sendText(str);
        }
        conn.sendText(str)
    })

    conn.on("close", function (code, reason) {
        console.log("關閉連接")
    });

    conn.on("error", function (code, reason) {
        console.log("異常關閉")
    });

}).listen(8000)

console.log("WebSocket建立完畢")