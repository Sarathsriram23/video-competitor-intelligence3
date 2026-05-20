# Video Competitor Intelligence

A full-stack application for analyzing competitor videos and generating intelligence reports with PowerPoint exports.

## Features

- **Video Analysis**: Analyze competitor videos from YouTube
- **Analytics Dashboard**: View competitor metrics and statistics
- **Report Generation**: Generate PowerPoint reports with analysis insights
- **Real-time Updates**: Live competitor intelligence tracking

## Tech Stack

### Frontend
- **Next.js 14**: React framework for production
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework

### Backend
- **Node.js + Express**: REST API server
- **YouTube API**: Video data extraction
- **PowerPoint Generator**: Report creation via pptxgen

## Project Structure

```
├── client/              # Next.js frontend application
│   ├── src/
│   │   ├── app/        # Next.js app directory
│   │   ├── components/ # React components
│   │   └── types/      # TypeScript types
│   └── package.json
│
├── server/             # Express backend API
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── routes/     # API routes
│   │   ├── services/   # Business logic
│   │   └── middleware/ # Express middleware
│   └── package.json
│
└── vercel.json         # Vercel deployment config
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   cd client && npm install
   cd ../server && npm install
   ```

2. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Add your YouTube API key and other required variables

3. **Development**
   ```bash
   # Terminal 1 - Start backend
   cd server
   npm start

   # Terminal 2 - Start frontend
   cd client
   npm run dev
   ```

4. **Production Build**
   ```bash
   npm run build
   npm start
   ```

## Deployment

### Vercel (Frontend + API Routes)
The project is configured for Vercel deployment with `vercel.json`:
- Frontend deploys from `client/` directory
- Backend deploys as serverless functions

### Steps
1. Connect your GitHub repository to Vercel
2. Vercel will auto-detect the configuration
3. Set required environment variables in Vercel dashboard
4. Deploy!

## Environment Variables

Create a `.env` file in the root directory:

```
YOUTUBE_API_KEY=your_api_key_here
NODE_ENV=development
API_BASE_URL=http://localhost:5000
```

## API Endpoints

- `POST /api/reports/analyze` - Analyze competitor videos
- `GET /api/analytics/dashboard` - Get analytics data
- `POST /api/reports/generate` - Generate PowerPoint report

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email sarath@example.com or open an issue on GitHub.
