// Importing required modules
const express = require('express'); // Express is a web framework for Node.js
const http = require('http'); // HTTP module is used to create an HTTP server
const { Server } = require('socket.io'); // Socket.IO is used for real-time communication
const path = require('path'); // Path module is used to handle and transform file paths

// Create an instance of the Express application
const app = express();

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Create a new instance of the Socket.IO server and attach it to the HTTP server
const io = new Server(server);

// Function to handle socket events
function handleSocket(io) {
    // Listen for new connections from clients
    io.on('connection', (socket) => {
        console.log('A user connected.');

        // Handle setting the username for the connected user
        socket.on('set username', (username) => {
            socket.username = username; // Store the username in the socket object
            console.log(`${username} joined the chat.`);
        });

        // Handle incoming chat messages from the client
        socket.on('chat message', (msg) => {
            const fullMessage = `${socket.username || 'Anonymous'}: ${msg}`;
            socket.broadcast.emit('chat message', fullMessage); // Broadcast to all other clients
            socket.emit('chat message', `You: ${msg}`); // Send back to the sender
        });

        // Handle when a user disconnects
        socket.on('disconnect', () => {
            console.log(`${socket.username || 'A user'} disconnected.`);
        });
    });
}

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set the view engine to 'ejs' for rendering dynamic HTML pages
app.set('view engine', 'ejs');

// Set the views directory to look for the EJS templates
app.set('views', path.join(__dirname, 'views'));

// Route to serve the chat page when the user accesses the home page ('/')
app.get('/', (req, res) => {
    res.render('index'); // Render the 'index' EJS template
});

// Initialize socket events
handleSocket(io);

// Start the server on port 3000
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});