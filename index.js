const express = require('express');
const { spawn } = require('child_process');
const ffmpeg = require('fluent-ffmpeg');

const app = express();

// Define routes to handle incoming video streams
app.post('/stream', (req, res) => {
    // Spawn ffmpeg process to handle video processing and streaming
    const ffmpegProcess = spawn('ffmpeg', [
        '-i', '-', // Input from stdin
        '-c:v', 'libx264', // Video codec
        '-preset', 'veryfast', // Preset for encoding speed
        '-tune', 'zerolatency', // Tune for zero latency
        '-pix_fmt', 'yuv420p', // Pixel format
        '-f', 'flv', // Output format (FLV for streaming)
        'rtmp://your_youtube_rtmp_url', // YouTube RTMP URL
        'rtmp://your_twitch_rtmp_url', // Twitch RTMP URL
    ]);

    // Pipe request stream to ffmpeg process stdin
    req.pipe(ffmpegProcess.stdin);

    // Log ffmpeg output to console
    ffmpegProcess.stderr.on('data', (data) => {
        console.log(`ffmpeg: ${data}`);
    });

    // Handle process exit
    ffmpegProcess.on('close', (code) => {
        console.log(`ffmpeg process exited with code ${code}`);
    });

    // Respond to the client
    res.sendStatus(200);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});