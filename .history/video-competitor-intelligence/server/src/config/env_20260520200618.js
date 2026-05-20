import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server root or project root
dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config();

export const config = {
  port: process.env.PORT || 5001,
  youtubeApiKey: process.env.YOUTUBE_API_KEY || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  nodeEnv: process.env.NODE_ENV || 'development'
};
