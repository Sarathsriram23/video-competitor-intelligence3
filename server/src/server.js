import app from './app.js';
import { config } from './config/env.js';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`  VIDEO COMPETITOR INTELLIGENCE BACKEND  `);
  console.log(`  Server is running on port ${PORT}      `);
  console.log(`  Environment: ${config.nodeEnv}        `);
  console.log(`=========================================`);
});
// Server-side environment loaded successfully!
