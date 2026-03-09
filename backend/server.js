const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const YTDlpWrap = require('yt-dlp-wrap').default;
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// yt-dlp binary path (Auto-detecting OS)
const isLinux = process.platform === 'linux';
const binaryPath = isLinux ? 'yt-dlp' : path.join(__dirname, 'yt-dlp.exe');
const ytDlp = new YTDlpWrap(binaryPath);

const axiosInstance = axios.create({
  timeout: 30000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.9',
  }
});

// ---- URL Validation (SSRF protection) ----
const isPrivateIP = (hostname) => {
  // Reject localhost and reserved IP ranges
  if (hostname === 'localhost') return true;
  const parts = hostname.split('.');
  if (parts.length !== 4) return false;
  const [a, b] = parts.map(Number);
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  return false;
};

const validateUrl = (urlStr) => {
  try {
    const url = new URL(urlStr);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
    if (isPrivateIP(url.hostname)) return false;
    return true;
  } catch (e) {
    return false;
  }
};

// ---- Detect if URL is a direct media file (image/video/audio) ----
const DIRECT_IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg', '.tiff', '.ico'];
const DIRECT_VIDEO_EXTS = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv', '.wmv', '.m4v'];
const DIRECT_AUDIO_EXTS = ['.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a', '.opus', '.wma'];

const getDirectMediaType = (url) => {
  try {
    const pathname = new URL(url).pathname.toLowerCase();
    if (DIRECT_IMAGE_EXTS.some(ext => pathname.endsWith(ext))) return 'image';
    if (DIRECT_VIDEO_EXTS.some(ext => pathname.endsWith(ext))) return 'video';
    if (DIRECT_AUDIO_EXTS.some(ext => pathname.endsWith(ext))) return 'audio';
    return null;
  } catch { return null; }
};

// ---- Sanitize filename ----
const sanitizeFilename = (name) => {
  return name
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')  // Remove forbidden chars
    .replace(/\s+/g, ' ')                        // Normalize spaces
    .trim()
    .substring(0, 200);                          // Max length
};

// ---- Guess file extension from content-type ----
const extFromContentType = (ct, fallback = '') => {
  if (!ct) return fallback;
  if (ct.includes('jpeg') || ct.includes('jpg')) return '.jpg';
  if (ct.includes('png')) return '.png';
  if (ct.includes('gif')) return '.gif';
  if (ct.includes('webp')) return '.webp';
  if (ct.includes('svg')) return '.svg';
  if (ct.includes('mp4')) return '.mp4';
  if (ct.includes('webm')) return '.webm';
  if (ct.includes('quicktime')) return '.mov';
  if (ct.includes('avi')) return '.avi';
  if (ct.includes('mpeg') || ct.includes('mp3')) return '.mp3';
  if (ct.includes('ogg')) return '.ogg';
  if (ct.includes('wav')) return '.wav';
  if (ct.includes('flac')) return '.flac';
  if (ct.includes('aac') || ct.includes('m4a')) return '.m4a';
  if (ct.includes('opus')) return '.opus';
  return fallback;
};

// ---- HEALTH ----
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ============================================================
// PREVIEW ENDPOINT — metadata fetch before download
// ============================================================
app.get('/api/preview', async (req, res) => {
  const { url } = req.query;

  if (!url || !validateUrl(url)) {
    return res.status(400).json({ error: 'Invalid or missing URL parameter' });
  }

  // --- Step 1: Try yt-dlp (works for YouTube, Vimeo, SoundCloud, Reddit, Twitter, Dailymotion, etc.) ---
  try {
    const metadata = await ytDlp.getVideoInfo([url, '--no-warnings']);
    const formats = [];

    if (metadata.formats && metadata.formats.length > 0) {
      const seen = new Set();

      // Video formats — prefer combined (video+audio) mp4 first
      const combined = metadata.formats
        .filter(f => f.vcodec !== 'none' && f.acodec !== 'none' && f.ext === 'mp4')
        .sort((a, b) => (b.height || 0) - (a.height || 0));

      // If no combined, get separate video streams
      const videoOnly = combined.length === 0
        ? metadata.formats
            .filter(f => f.vcodec !== 'none' && f.acodec === 'none')
            .sort((a, b) => (b.height || 0) - (a.height || 0))
        : [];

      const videoFormats = [...combined, ...videoOnly];

      videoFormats.forEach(f => {
        const label = f.height ? `${f.height}p` : f.format_note || f.format_id;
        if (!seen.has(label)) {
          seen.add(label);
          formats.push({ id: f.format_id, qualityLabel: label, type: 'video' });
        }
      });

      // Audio only formats
      const audioFmt = metadata.formats.find(f => f.vcodec === 'none' && f.acodec !== 'none');
      if (audioFmt) {
        const audioLabel = audioFmt.abr ? `Audio ${Math.round(audioFmt.abr)}kbps` : 'Audio Only';
        formats.push({ id: audioFmt.format_id, qualityLabel: audioLabel, type: 'audio' });
      }
    }

    // Fallback format if nothing was found
    if (formats.length === 0) {
      formats.push({ id: 'best', qualityLabel: 'Best Quality', type: 'video' });
    }

    return res.json({
      valid: true,
      title: metadata.title || 'Media',
      duration: metadata.duration,
      uploader: metadata.uploader || metadata.channel || metadata.creator || 'Unknown',
      thumbnail: metadata.thumbnail,
      formats,
      source: 'ytdlp'
    });
  } catch (ytdlpErr) {
    console.warn('yt-dlp preview failed:', ytdlpErr.message?.split('\n')[0]);
  }

  // --- Step 2: Direct URL fallback (for direct image/video/audio links) ---
  try {
    // Try HEAD first (fast)
    let contentType = null;
    try {
      const headRes = await axiosInstance.head(url, { timeout: 8000 });
      contentType = headRes.headers['content-type'] || '';
    } catch {
      // HEAD failed, try GET
      const getRes = await axiosInstance.get(url, { responseType: 'stream', timeout: 8000 });
      contentType = getRes.headers['content-type'] || '';
      getRes.data.destroy();
    }

    const isImage = contentType.startsWith('image/');
    const isAudio = contentType.startsWith('audio/');
    const isVideo = contentType.startsWith('video/');

    if (!isImage && !isAudio && !isVideo) {
      throw new Error(`Content type ${contentType} is not direct media.`);
    }

    const ext = extFromContentType(contentType);
    const mediaType = isImage ? 'image' : isAudio ? 'audio' : 'video';

    const formats = [];
    if (isImage) {
      formats.push({ id: 'direct', qualityLabel: 'Download Image', type: 'image' });
    } else if (isAudio) {
      formats.push({ id: 'direct', qualityLabel: 'Download Audio', type: 'audio' });
    } else {
      formats.push({ id: 'direct', qualityLabel: 'Best Quality', type: 'video' });
    }

    return res.json({
      valid: true,
      title: decodeURIComponent(new URL(url).pathname.split('/').pop()) || 'Download',
      contentType,
      ext,
      formats,
      isDirect: true,
      mediaType,
      source: 'direct'
    });
  } catch (directErr) {
    console.warn('Direct URL preview failed:', directErr.message?.split('\n')[0]);
  }

  // --- Step 3: Ultimate fallback — let user try anyway ---
  return res.json({
    valid: true,
    title: 'Media File',
    warning: 'Could not fetch metadata. The download will be attempted directly.',
    formats: [
      { id: 'best', qualityLabel: 'Download', type: 'video' }
    ],
    source: 'fallback'
  });
});

// ============================================================
// DOWNLOAD ENDPOINT — actual file streaming
// ============================================================
app.get('/api/download', async (req, res) => {
  const { url, name, type, formatId } = req.query;

  if (!url || !validateUrl(url)) {
    return res.status(400).json({ error: 'Invalid or missing URL parameter' });
  }

  let filename = sanitizeFilename(name ? decodeURIComponent(name) : 'download');
  const isAudio = type === 'audio';
  const isImage = type === 'image';

  // --- Step 1: If it's a direct media URL (image/audio/video link), stream directly ---
  const directType = getDirectMediaType(url);
  const isDirectMedia = directType === 'image' || directType === 'video' || directType === 'audio';
  const isDirect = formatId === 'direct';

  if (isImage || directType === 'image' || isDirect || directType === 'video' || directType === 'audio') {
    try {
      const response = await axiosInstance.get(url, { responseType: 'stream' });
      const contentType = response.headers['content-type'] || 'application/octet-stream';

      let ext;
      if (isImage || directType === 'image' || (isDirect && type === 'image')) {
        ext = extFromContentType(contentType, '.jpg');
      } else if (directType === 'audio' || (isDirect && type === 'audio')) {
        ext = extFromContentType(contentType, '.mp3');
      } else {
        ext = extFromContentType(contentType, '.mp4');
      }

      if (!filename.toLowerCase().endsWith(ext)) filename += ext;

      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', contentType);
      if (response.headers['content-length']) {
        res.setHeader('Content-Length', response.headers['content-length']);
      }
      response.data.pipe(res);
      response.data.on('error', () => { try { res.end(); } catch {} });
      return;
    } catch (directErr) {
      console.error('Direct media download failed:', directErr.message);
      return res.status(500).json({ error: 'Failed to download media', details: directErr.message });
    }
  }

  // --- Step 2: Try yt-dlp for video/audio (YouTube, Vimeo, SoundCloud, Reddit, etc.) ---
  try {
    const ext = isAudio ? '.mp3' : '.mp4';
    if (!filename.toLowerCase().endsWith(ext)) filename += ext;

    // Build format argument
    let fmtArg;
    if (formatId && formatId !== 'best' && formatId !== 'direct') {
      fmtArg = formatId;
    } else if (isAudio) {
      fmtArg = 'bestaudio/best';
    } else {
      fmtArg = 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best';
    }

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', isAudio ? 'audio/mpeg' : 'video/mp4');

    const ytdlpArgs = [
      url,
      '-f', fmtArg,
      '-o', '-',
      '--no-warnings',
      '--no-playlist',
    ];

    const ytDlpStream = ytDlp.execStream(ytdlpArgs);
    ytDlpStream.pipe(res);

    // If yt-dlp stream errors, try direct download
    ytDlpStream.on('error', async (err) => {
      console.error('yt-dlp stream error:', err.message);
      // Only fallback if headers not sent yet
      if (!res.headersSent) {
        if (directType) {
          return tryDirectDownload(url, filename, type, res);
        } else {
          return res.status(500).json({ error: 'Failed to extract media from the URL.', details: err.message });
        }
      }
    });

    res.on('close', () => {
      try { ytDlpStream.destroy(); } catch {}
    });
    return;
  } catch (ytdlpErr) {
    console.error('yt-dlp download error:', ytdlpErr.message);
    if (!res.headersSent) {
      if (directType) {
        return tryDirectDownload(url, filename, type, res);
      } else {
        return res.status(500).json({ error: 'yt-dlp execution failed.', details: ytdlpErr.message });
      }
    }
  }

});

// ---- Direct download helper ----
async function tryDirectDownload(url, filename, type, res) {
  try {
    const response = await axiosInstance.get(url, { responseType: 'stream' });
    const contentType = response.headers['content-type'] || 'application/octet-stream';
    const ext = extFromContentType(contentType, type === 'video' ? '.mp4' : type === 'audio' ? '.mp3' : '.jpg');
    if (!filename.toLowerCase().endsWith(ext)) filename += ext;

    if (!res.headersSent) {
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', contentType);
      if (response.headers['content-length']) {
        res.setHeader('Content-Length', response.headers['content-length']);
      }
    }
    response.data.pipe(res);
    response.data.on('error', () => { try { res.end(); } catch {} });
  } catch (error) {
    console.error('Direct download failed:', error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Download failed. The URL may not be directly accessible.', details: error.message });
    }
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // Keep alive for debugging
  setInterval(() => {
    // console.log('Keep alive...');
  }, 1000 * 60 * 60);
});

module.exports = app;
