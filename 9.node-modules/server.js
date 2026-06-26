// Simple HTTP server using Node.js built-in 'http' module
const http = require("http");

// Create the server and define the response for each request
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write("welcome to custom server");
  res.end();
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log("server is running at http://localhost:3000");
});
