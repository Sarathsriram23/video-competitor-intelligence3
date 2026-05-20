import { Router } from 'express';
import { generateReport, downloadReportPPTX, searchAndFetchVideos } from '../controllers/reportController.js';

const router = Router();

// Endpoint to search and fetch videos for multiple brands
router.post('/search-videos', searchAndFetchVideos);

// Endpoint to generate competitive audit report
router.post('/generate', generateReport);

// Endpoint to download powerpoint presentation
router.post('/download', downloadReportPPTX);

export default router;
