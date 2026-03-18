import { useState, useEffect, useCallback } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { Youtube, Instagram, Facebook, Twitter, Link2, Loader2, Download, Play, Shield, Zap, MonitorPlay, Music, Film, ExternalLink, X as XIcon } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://saver-ur-1.onrender.com/api';

const PLATFORMS = [
  { id: 'youtube', label: 'YouTube', icon: <Youtube className="w-5 h-5 text-red-500"/>, bg: 'bg-red-50' },
  { id: 'tiktok', label: 'TikTok', icon: <Film className="w-5 h-5 text-gray-800"/>, bg: 'bg-gray-100' },
  { id: 'instagram', label: 'Instagram', icon: <Instagram className="w-5 h-5 text-pink-500"/>, bg: 'bg-pink-50' },
  { id: 'facebook', label: 'Facebook', icon: <Facebook className="w-5 h-5 text-blue-600"/>, bg: 'bg-blue-50' },
];

const FEATURES = [
  { icon: <MonitorPlay className="w-6 h-6 text-violet-600"/>, bg: 'bg-violet-100', title: '4K Quality', desc: 'Download videos in their original resolution up to 4K UHD with crystal clear audio quality.' },
  { icon: <Zap className="w-6 h-6 text-violet-600"/>, bg: 'bg-violet-100', title: 'Ultra Speed', desc: 'Our advanced multi-threaded engine processes your requests instantly for lightning-fast downloads.' },
  { icon: <Shield className="w-6 h-6 text-violet-600"/>, bg: 'bg-violet-100', title: 'Secure & Private', desc: 'We respect your privacy. All processing is encrypted and no personal data is ever stored on our servers.' },
];

const Home = () => {
  const [url, setUrl] = useState('');
  const [platform, setPlatform] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<string | null>(null);
  const [jobData, setJobData] = useState<any | null>(null);
  const [format, setFormat] = useState<'video' | 'audio'>('video');
  const [showPreview, setShowPreview] = useState(false);

  // Build YouTube embed URL from any YouTube link
  const getYouTubeId = (u: string) => {
    const match = u.match(/(?:v=|youtu\.be\/|embed\/|v\/|.+\/|watch\?v=|&v=)([\w-]{11})/);
    return match ? match[1] : null;
  };

  const getPreviewEmbed = useCallback(() => {
    if (!url) return null;
    const ytId = getYouTubeId(url);
    if (ytId) {
      return { type: 'youtube', src: `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0` };
    }
    // For other platforms: use proxy to bypass CORS
    if (jobData?.formats?.length) {
      const bestVideo = jobData.formats.find((f: any) => f.quality !== 'audio');
      if (bestVideo?.format_id) {
        const proxyUrl = `${API_BASE}/download-proxy?videoUrl=${encodeURIComponent(url)}&format_id=${bestVideo.format_id}&ext=${bestVideo.ext}&preview=true`;
        return { type: 'direct', src: proxyUrl };
      }
    }
    return { type: 'external', src: url };
  }, [url, jobData]);

  const detectPlatform = (u: string) => {
    const l = u.toLowerCase();
    if (l.includes('youtube.com') || l.includes('youtu.be')) return 'youtube';
    if (l.includes('instagram.com')) return 'instagram';
    if (l.includes('facebook.com') || l.includes('fb.watch')) return 'facebook';
    if (l.includes('twitter.com') || l.includes('x.com')) return 'twitter';
    if (l.includes('tiktok.com')) return 'tiktok';
    if (l.includes('netflix.com') || l.includes('primevideo.com') || l.includes('hotstar.com') || l.includes('disneyplus.com')) return 'drm';
    return 'other';
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUrl(val);
    setError(null);
    setPlatform(val ? detectPlatform(val) : null);
  };

  const clearForm = () => {
    setUrl(''); setPlatform(null); setError(null);
    setJobId(null); setJobStatus(null); setJobData(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setError(null); setJobId(null); setJobStatus('loading'); setJobData(null);
    if (platform === 'drm') { setJobStatus('drm'); return; }
    try {
      const { data } = await axios.post(`${API_BASE}/fetch`, { url });
      setJobId(data.jobId);
    } catch {
      setError('Unable to connect — check your internet connection');
      setJobStatus(null);
    }
  };

  useEffect(() => {
    let iv: ReturnType<typeof setInterval>;
    if (jobId && jobStatus === 'loading') {
      iv = setInterval(async () => {
        try {
          const { data } = await axios.get(`${API_BASE}/status/${jobId}`);
          if (data.status === 'completed') {
            setJobStatus('completed');
            setJobData(data.metadata);
            clearInterval(iv);
            // Save to history
            const item = {
              id: jobId,
              title: data.metadata.title,
              thumbnail: data.metadata.thumbnail,
              duration: data.metadata.duration,
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              size: data.metadata.formats?.[0]?.filesize || 'Unknown',
              url: url
            };
            axios.post(`${API_BASE}/history`, item).catch(console.error);
          } else if (data.status === 'error') {
            setJobStatus('error');
            setError('Processing failed: ' + data.error);
            clearInterval(iv);
          }
        } catch {
          setError('Failed to poll status.');
          setJobStatus('error');
          clearInterval(iv);
        }
      }, 1500);
    }
    return () => clearInterval(iv);
  }, [jobId, jobStatus, url]);

  const handleDownload = (f: any, title: string) => {
    const proxyUrl = f.original_url && f.format_id
      ? `${API_BASE}/download-proxy?videoUrl=${encodeURIComponent(f.original_url)}&format_id=${f.format_id}&ext=${f.ext}&title=${encodeURIComponent(title)}`
      : f.url;
    window.open(proxyUrl, '_blank');
  };

  const getQualityBadge = (q: string) => {
    if (q === '1080p') return { label: 'FULL HD', cls: 'bg-violet-100 text-violet-700' };
    if (q === '720p') return { label: 'HD', cls: 'bg-blue-100 text-blue-700' };
    if (q === '480p' || q === '360p') return { label: 'SD', cls: 'bg-gray-100 text-gray-600' };
    if (q === 'audio') return { label: 'HIGH QUALITY', cls: 'bg-green-100 text-green-700' };
    return { label: q, cls: 'bg-gray-100 text-gray-600' };
  };

  // ── Video Preview Modal ────────────────────────────────────────────────────
  const VideoPreviewModal = () => {
    const embed = getPreviewEmbed();
    if (!embed) return null;

    if (embed.type === 'external') {
      window.open(embed.src, '_blank');
      setShowPreview(false);
      return null;
    }

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(10,8,30,0.85)', backdropFilter: 'blur(6px)' }}
        onClick={() => setShowPreview(false)}
      >
        <div
          className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl bg-black"
          style={{ aspectRatio: '16/9' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={() => setShowPreview(false)}
            className="absolute top-3 right-3 z-10 w-9 h-9 bg-black/60 hover:bg-black/90 text-white rounded-full flex items-center justify-center transition"
          >
            <XIcon className="w-5 h-5"/>
          </button>

          {embed.type === 'youtube' ? (
            <iframe
              src={embed.src}
              title="Video Preview"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={embed.src}
              controls
              autoPlay
              className="w-full h-full object-contain bg-black"
            />
          )}
        </div>

        {/* Caption */}
        <div className="absolute bottom-6 left-0 right-0 text-center">
          <p className="text-white/60 text-sm">{jobData?.title}</p>
        </div>
      </div>
    );
  };

  // ── Download results view ──────────────────────────────────────────────────
  if (jobStatus === 'completed' && jobData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 pb-20">
        {/* Preview modal */}
        {showPreview && <VideoPreviewModal />}

        <button onClick={clearForm} className="flex items-center gap-2 text-violet-600 hover:text-violet-800 font-medium text-sm mb-8 transition">
          ← Go Back
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-1 pb-4 border-b border-gray-100">
          <div className="w-12 h-12 bg-violet-700 rounded-xl flex items-center justify-center shadow-md shadow-violet-200">
            <Download className="w-6 h-6 text-white"/>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Ready to Download</h1>
        </div>

        {/* Video preview card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 my-6 flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <p className="text-xs font-bold text-violet-600 tracking-widest mb-2 uppercase">Video Ready</p>
            <h2 className="text-xl font-bold text-gray-900 mb-3 leading-snug">{jobData.title}</h2>
            {jobData.duration && (
              <p className="text-sm text-gray-400 mb-4 flex items-center gap-2">
                <span>⏱ {Math.floor(jobData.duration / 60)}:{String(jobData.duration % 60).padStart(2, '0')}</span>
              </p>
            )}
            <button
              onClick={() => setShowPreview(true)}
              className="btn-primary text-sm"
            >
              <Play className="w-4 h-4 fill-white"/> Preview Video
            </button>
          </div>
          {jobData.thumbnail && (
            <div className="w-full md:w-56 h-36 rounded-xl overflow-hidden shrink-0 bg-gray-900">
              <img src={jobData.thumbnail} alt={jobData.title} className="w-full h-full object-cover"/>
            </div>
          )}
        </div>

        {/* Format selector */}
        <h3 className="flex items-center gap-2 font-bold text-gray-900 text-lg mb-4">
          <span className="text-violet-600">☰</span> Select Download Format
        </h3>

        <div className="space-y-3 mb-8">
          {jobData.formats
            .filter((f: any) => format === 'video' ? f.quality !== 'audio' : f.quality === 'audio')
            .slice(0, 6)
            .map((f: any, i: number) => {
              const badge = getQualityBadge(f.quality);
              const isVideo = f.quality !== 'audio';
              return (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 hover:border-violet-200 hover:shadow-md transition-all">
                  <div className="w-11 h-11 bg-violet-100 rounded-xl flex items-center justify-center shrink-0">
                    {isVideo ? <MonitorPlay className="w-5 h-5 text-violet-600"/> : <Music className="w-5 h-5 text-violet-600"/>}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-gray-900">{isVideo ? `MP4 - ${f.quality}` : 'MP3 - Audio'}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.cls}`}>{badge.label}</span>
                    </div>
                    <p className="text-sm text-gray-400">Estimated size: {f.filesize}</p>
                  </div>
                  <button
                    onClick={() => handleDownload(f, jobData.title)}
                    className="bg-violet-100 hover:bg-violet-700 text-violet-700 hover:text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 shrink-0">
                    <Download className="w-4 h-4"/> Download
                  </button>
                </div>
              );
            })}
          {jobData.formats.filter((f: any) => format === 'video' ? f.quality !== 'audio' : f.quality === 'audio').length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
              No {format} formats available.
            </div>
          )}
        </div>

        {/* Audio/Video toggle */}
        <div className="flex gap-3 mb-8">
          {(['video', 'audio'] as const).map(t => (
            <button key={t} onClick={() => setFormat(t)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition border
                ${format === t ? 'bg-violet-700 text-white border-violet-700 shadow' : 'bg-white text-gray-500 border-gray-200 hover:border-violet-300'}`}>
              {t === 'video' ? '🎬 MP4 Video' : '🎵 MP3 Audio'}
            </button>
          ))}
        </div>

        <p className="text-center text-sm text-gray-400">
          By downloading, you agree to our{' '}
          <a href="#" className="text-violet-600 hover:underline">Terms of Service</a>{' '}
          and{' '}
          <a href="#" className="text-violet-600 hover:underline">Copyright Policy</a>.
        </p>
      </div>
    );
  }

  // ── Main landing view ──────────────────────────────────────────────────────
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 lg:px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-5">
            Download your favorite{' '}
            <span className="text-violet-700">videos</span>{' '}
            in seconds
          </h1>
          <p className="text-gray-500 text-lg mb-8 leading-relaxed">
            The fastest and most reliable way to save videos from across the web. High quality, no watermarks, completely free.
          </p>

          <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
              <input
                type="url"
                value={url}
                onChange={handleUrlChange}
                placeholder="Paste video URL here (YouTube, TikTok...)"
                required
                className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-sm outline-none transition-all
                  ${error ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100'}`}
              />
            </div>
            <button type="submit" disabled={!url || jobStatus === 'loading'}
              className="btn-primary shrink-0 disabled:opacity-60 disabled:cursor-not-allowed">
              {jobStatus === 'loading'
                ? <><Loader2 className="w-4 h-4 animate-spin"/> Analyzing...</>
                : <><Download className="w-4 h-4"/> Download</>}
            </button>
          </form>

          {error && <p className="text-red-500 text-sm mb-2">⚠️ {error}</p>}
          <p className="text-xs text-gray-400">
            By using our service you accept our{' '}
            <a href="#" className="underline hover:text-violet-600">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="underline hover:text-violet-600">Privacy Policy</a>.
          </p>
        </div>

        {/* Decorative right panel */}
        <div className="relative hidden md:block">
          <div className="bg-violet-100 rounded-3xl aspect-[4/3] flex items-center justify-center relative overflow-hidden shadow-inner">
            <div className="w-20 h-20 bg-violet-300/60 rounded-full flex items-center justify-center">
              <Play className="w-10 h-10 text-violet-700 fill-violet-700"/>
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-white rounded-2xl p-3.5 flex items-center gap-3 shadow-lg">
              <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center shrink-0">
                <div className="w-4 h-4 bg-violet-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-[8px] font-black">✓</span>
                </div>
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Ready to Download</p>
                <p className="text-xs text-gray-500">4K Resolution Detected</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DRM Warning */}
      {jobStatus === 'drm' && (
        <div className="max-w-2xl mx-auto px-4 mb-8">
          <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-8 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-7 h-7 text-red-500"/>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">DRM Protected Content</h2>
            <p className="text-gray-500 text-sm mb-6">
              This platform encrypts its content. Downloading is not legally possible, but you can watch it directly:
            </p>
            <a href={url} target="_blank" rel="noopener noreferrer" className="btn-primary mx-auto w-fit">
              Watch Now <ExternalLink className="w-4 h-4"/>
            </a>
            <button onClick={clearForm} className="mt-4 block mx-auto text-sm text-gray-400 hover:text-violet-600 transition">
              Try another URL
            </button>
          </div>
        </div>
      )}

      {/* Supported Platforms */}
      <section className="bg-white border-y border-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs font-bold text-violet-600 tracking-widest mb-8 uppercase">Supported Platforms</p>
          <div className="flex flex-wrap justify-center gap-4">
            {PLATFORMS.map(p => (
              <div key={p.id} className={`${p.bg} border border-gray-100 rounded-2xl px-6 py-3.5 flex items-center gap-3 font-semibold text-gray-800 shadow-sm hover:shadow-md transition cursor-pointer`}>
                {p.icon} {p.label}
              </div>
            ))}
            <div className="bg-violet-50 border border-violet-100 rounded-2xl px-6 py-3.5 flex items-center gap-2 font-semibold text-violet-700 shadow-sm">
              <Twitter className="w-5 h-5"/> Twitter / X
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 lg:px-6 py-20 text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-3">Why choose Saver-UR?</h2>
        <p className="text-gray-500 max-w-xl mx-auto mb-12">
          Experience the ultimate video saving tool with these professional features, designed for power users.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 text-left hover:shadow-md hover:border-violet-100 transition-all">
              <div className={`w-12 h-12 ${f.bg} rounded-2xl flex items-center justify-center mb-5`}>
                {f.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
