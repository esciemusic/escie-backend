/**
 * ESCIE Central Engine - V2.6.0
 * Live Orchestration & Comms Router
 */

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*", // Grants absolute clearance for your GitHub Pages frontend to connect
        methods: ["GET", "POST"]
    }
});

// 1. Global Radio Stream State Tracker
let currentGlobalRadioState = {
    artist: "ESCIE",
    trackName: "Vampiro Method (Unreleased cut)",
    trackUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    currentTimestamp: 0
};

// 2. Background Clock Loop (Broadcasts synchronization pulses every 1 second)
setInterval(() => {
    currentGlobalRadioState.currentTimestamp += 1;
    
    // Simulate a 5-minute track loop reset (300 seconds)
    if (currentGlobalRadioState.currentTimestamp > 300) {
        currentGlobalRadioState.currentTimestamp = 0;
    }
    
    io.emit('radio_sync', currentGlobalRadioState);
}, 1000);

// 3. Network Connection Matrix
io.on('connection', (socket) => {
    // Force immediate sync handshake upon client connection
    socket.emit('radio_sync', currentGlobalRadioState);
    
    // Process and broadcast incoming chat streams
    socket.on('send_message', (data) => {
        if (!data.user || !data.content) return;
        
        io.emit('new_message', { 
            user: data.user.toString().trim().toUpperCase(), 
            content: data.content.toString().trim() 
        });
    });
});

// 4. Port Binding Sequence
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Backend Engine Online // Operational Port: ${PORT}`);
});
