const http = require('http');
const os = require('os');
const path = require('path');
const events = require('events');

// Create an event emitter instance
const eventEmitter = new events.EventEmitter();

// Attach an event listener for the 'serverStarted' event
// (Fixed event name to have no spaces for consistency)
eventEmitter.on('serverStarted', () => {
    console.log('Server has started successfully');
});

// Create the HTTP server
const server = http.createServer((req, res) => {
    // Gather OS information
    const osinfo = `
OS Platform: ${os.platform()}
OS Architecture: ${os.arch()}
Free Memory: ${os.freemem()} bytes
Total Memory: ${os.totalmem()} bytes
Uptime: ${os.uptime()} seconds
`;

    // Resolve the current file path
    const filePath = path.resolve(__filename);

    // Log the incoming request
    console.log(`${req.method} request for ${req.url}\n`);

    // Write the response
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.write(`Current server file path: ${filePath}\n`);
    res.write("OS Information:\n");
    res.write(osinfo);
    res.end();
});

// Start the server
server.listen(3000, () => {
    // Emit the 'serverStarted' event (fixed name)
    eventEmitter.emit('serverStarted');
    console.log('Server is running on http://localhost:3000');
});
