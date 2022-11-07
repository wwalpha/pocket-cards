import app from './server';

const PORT = process.env.PORT || 8080;

// Start the servers
const server = app.listen(PORT, () => {
  console.log(`User manager service started on port ${PORT}`);
});

// timeout 20s
server.timeout = 1000 * 20;
