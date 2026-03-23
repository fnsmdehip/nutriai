console.log('[server.ts]: STARTING'); // DEBUG
import app from './app';

const PORT = process.env.PORT || 3001; // Default to 3001 if not specified
console.log(`[server.ts]: Attempting to listen on PORT: ${PORT}`); // DEBUG

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
