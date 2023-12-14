const express = require('express');
const { WebSocketServer } = require('ws');
const http = require('http');

// Express 애플리케이션과 HTTP 서버 생성
const app = express();
const server = http.createServer(app);

// WebSocket 서버 생성
const wss = new WebSocketServer({ server });

// 클라이언트 연결 관리
wss.on('connection', (ws) => {
    console.log('클라이언트가 연결되었습니다.');

    // 서버에서 클라이언트로 메시지 전송
    ws.on('message', (message) => {
        console.log('받은 메시지:', message);
            // 모든 연결된 클라이언트에게 메시지 전송
        wss.clients.forEach((client) => {
            client.send(message);
        });
        }
    });
});

// Express 라우트
app.get('/', (req, res) => {
    res.send('WebSocket 서버 예시');
});

// 서버 시작
server.listen(8080, () => {
    console.log('서버가 8080포트에서 시작되었습니다.');
});
