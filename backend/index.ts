import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';

const app = express();
app.use(cors());
app.use(express.json());

// In-memory jobs map (Fallback for Queue)
const jobs = new Map<string, any>();
const downloadsDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadsDir)) fs.mkdirSync(downloadsDir);

const YTDLP_PATH = process.platform === 'win32' 
  ? path.join(__dirname, 'yt-dlp.exe') 
  : 'yt-dlp'; // Use system yt-dlp on Linux/Render

// Quick health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', platform: process.platform, node: process.version }));

// Mock History
const mockHistory = new Map<string, any[]>();

app.post('/api/fetch', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const jobId = crypto.randomUUID();
  jobs.set(jobId, { status: 'loading', progress: 0, url });

  // Processing async
  setImmediate(() => {
    try {
      // Small check for binary only on windows, on linux we assume it's in PATH
      if (process.platform === 'win32' && !fs.existsSync(YTDLP_PATH)) {
        jobs.set(jobId, { status: 'error', error: 'yt-dlp.exe not found' });
        return;
      }
      const ytdlp = spawn(YTDLP_PATH, ['-j', url]);
      
      let stdout = '';
      let stderr = '';

      ytdlp.stdout.on('data', (data) => {
         stdout += data.toString();
      });

      ytdlp.stderr.on('data', (data) => {
         stderr += data.toString();
      });

      ytdlp.on('close', (code) => {
        if (code !== 0) {
          jobs.set(jobId, { status: 'error', error: 'Processing failed: ' + stderr });
          return;
        }

        try {
          const metadata = JSON.parse(stdout);
          
          // Format filter: smarter selection for high quality with audio.
          const availableFormats = metadata.formats?.filter((f: any) => {
            const hasVideo = f.vcodec !== 'none';
            const hasAudio = f.acodec !== 'none';
            // Pure audio
            if (!hasVideo && hasAudio) return true;
            // Combined video + audio (important for no-ffmpeg setups)
            if (hasVideo && hasAudio) return true;
            return false;
          }).map((f: any) => ({
            format_id: f.format_id,
            ext: f.ext,
            resolution: f.resolution || 'audio',
            quality: f.height ? `${f.height}p` : 'audio',
            filesize: f.filesize ? `${(f.filesize / 1024 / 1024).toFixed(2)} MB` : 'Unknown',
            url: f.url,
            original_url: url
          })) || [];

          // If no merged video found, fallback to 'best'
          if (!availableFormats.some(f => f.quality !== 'audio')) {
             availableFormats.push({
               format_id: 'best',
               ext: 'mp4',
               resolution: 'best',
               quality: 'Best available',
               filesize: 'Unknown',
               url: '', // will be used by proxy
               original_url: url
             });
          }

          jobs.set(jobId, {
            status: 'completed',
            progress: 100,
            metadata: {
              title: metadata.title,
              thumbnail: metadata.thumbnail,
              duration: metadata.duration,
              formats: availableFormats
            }
          });
        } catch(e) {
          jobs.set(jobId, { status: 'error', error: 'Failed to parse metadata' });
        }
      });
    } catch(e) {
      jobs.set(jobId, { status: 'error', error: 'Spawn failed' });
    }
  });

  res.json({ jobId, status: 'loading' });
});

app.get('/api/status/:jobId', (req, res) => {
  const { jobId } = req.params;
  const job = jobs.get(jobId);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  res.json(job);
});

app.get('/api/history', (req, res) => {
  const userId = req.headers.authorization?.split('Bearer ')[1] || 'anonymous';
  const history = mockHistory.get(userId) || [];
  res.json({ downloads: history });
});

app.post('/api/history', (req, res) => {
  const userId = req.headers.authorization?.split('Bearer ')[1] || 'anonymous';
  const history = mockHistory.get(userId) || [];
  history.push(req.body);
  mockHistory.set(userId, [...history].slice(-50)); // keep last 50
  res.json({ success: true });
});

app.get('/api/download-proxy', (req, res) => {
  const { videoUrl, format_id, ext, title, preview } = req.query;
  if (!videoUrl || !format_id) return res.status(400).send('Missing params');

  const cleanTitle = (title as string || 'download').replace(/[^a-zA-Z0-9 -]/g, '_');
  const isPreview = preview === 'true';

  // Force output filename extension to mp4 if video, fallback to original if audio
  const fileExt = ext === 'm4a' || ext === 'webm' && !isPreview ? ext : 'mp4';

  if (isPreview) {
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Content-Type', `video/${fileExt}`);
  } else {
    res.setHeader('Content-Disposition', `attachment; filename="${cleanTitle}.${fileExt}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
  }
  
  // Guarantee audio + video combined format in case they choose 'best'
  let formatParam = format_id as string;
  if (formatParam === 'best') {
    formatParam = 'b[ext=mp4]/b'; // Forces best mp4 combination natively
  }

  const ytdlp = spawn(YTDLP_PATH, ['-f', formatParam, '-o', '-', videoUrl as string]);
  ytdlp.stdout.pipe(res);
  ytdlp.stderr.on('data', () => {}); // silence stderr output
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
