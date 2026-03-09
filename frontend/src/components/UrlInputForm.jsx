import { useState } from 'react';
import { Download, Link as LinkIcon, Image as ImageIcon, Video, Loader2, Save } from 'lucide-react';
import MediaPreview from './MediaPreview';
import { getPreview, getDownloadUrl } from '../utils/api';
import { saveUrl } from '../utils/storage';

const UrlInputForm = () => {
  const [url, setUrl] = useState('');
  const [step, setStep] = useState(1); // 1: input URL, 2: configure & preview
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mediaName, setMediaName] = useState('download');
  const [mediaType, setMediaType] = useState('image');
  const [mediaData, setMediaData] = useState(null);
  const [formatId, setFormatId] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }
    setLoading(true);
    try {
      const metadata = await getPreview(url);
      setMediaData(metadata);
      // For social/YouTube platforms, default to video
      if (metadata.isYouTube || metadata.isSocial) {
        setMediaType('video');
      } else {
        setMediaType(metadata.contentType?.includes('video') ? 'video' : 'image');
      }
      if (metadata.title) {
        setMediaName(metadata.title.replace(/[^a-zA-Z0-9 _-]/g, '').trim().slice(0, 60) || 'download');
      }
      if (metadata.formats && metadata.formats.length > 0) {
        setFormatId(String(metadata.formats[0].id));
      }
      setStep(2);
    } catch (err) {
      if (!err.response) {
        setError('Could not connect to the backend server. Please make sure the backend is running on port 5000.');
      } else {
        setError(err.response?.data?.error || 'Failed to fetch media metadata. The URL might be restricted or invalid.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    setError(null);
    setSuccess(false);

    try {
      let finalType = mediaType;
      const isSocialOrYT = mediaData?.isYouTube || mediaData?.isSocial;
      if (isSocialOrYT) {
        const selectedFormat = mediaData.formats?.find(f => String(f.id) === String(formatId));
        if (selectedFormat && selectedFormat.type === 'audio') finalType = 'audio';
        else finalType = 'video';
      }

      const downloadLink = getDownloadUrl(url, mediaName, finalType, formatId);
      
      // We can use an anchor tag to trigger the download directly since the backend sets Content-Disposition attachment
      const a = document.createElement('a');
      a.href = downloadLink;
      a.target = '_blank';
      a.download = mediaName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Save to local storage history
      saveUrl({ url, name: mediaName, type: mediaType });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError('An error occurred while trying to download.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto backdrop-blur-lg bg-white/70 p-6 md:p-8 rounded-3xl shadow-xl border border-white/50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-accent" />
      
      {step === 1 && (
        <form onSubmit={handleInitialSubmit} className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Paste URL to Start</h2>
            <p className="text-gray-500 mt-2">Enter any valid image or video URL to begin downloading.</p>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <LinkIcon className="h-6 w-6 text-gray-400 group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="url"
              className="block w-full pl-12 pr-4 py-4 md:py-5 border-2 border-gray-200 rounded-2xl bg-white/60 focus:bg-white focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all text-lg placeholder-gray-400"
              placeholder="https://example.com/image.jpg"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>

          {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 border border-transparent rounded-2xl shadow-lg text-lg font-bold text-white bg-primary hover:bg-accent focus:outline-none focus:ring-4 focus:ring-primary/50 disabled:opacity-70 disabled:cursor-not-allowed transition duration-300 ease-in-out transform hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <Download className="w-6 h-6" />}
            {loading ? 'Validating...' : 'Next Step'}
          </button>
        </form>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="flex-1 truncate pr-4 text-gray-600 space-x-2 flex items-center">
              <LinkIcon className="w-4 h-4 text-primary shrink-0" />
              <span className="truncate">{url}</span>
            </div>
            <button 
              onClick={() => { setStep(1); setError(null); }}
              className="text-sm font-medium text-primary hover:text-accent underline underline-offset-2 whitespace-nowrap"
            >
              Change URL
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">File Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition ease-in-out"
                value={mediaName}
                onChange={(e) => setMediaName(e.target.value)}
              />
            </div>

          {(mediaData?.isYouTube || mediaData?.isSocial) && mediaData.formats?.length > 0 ? (
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">Download Quality</label>
                <select
                  value={formatId}
                  onChange={(e) => setFormatId(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white appearance-none"
                >
                  {mediaData.formats?.map(fmt => (
                    <option key={fmt.id} value={fmt.id}>
                      {fmt.qualityLabel} {fmt.type === 'audio' ? '🎵' : '🎬'}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">Media Type</label>
                <div className="flex gap-4 p-1 bg-gray-100 rounded-xl border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setMediaType('image')}
                    className={`flex-1 py-2 flex items-center justify-center gap-2 rounded-lg font-medium transition-all ${mediaType === 'image' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <ImageIcon className="w-4 h-4" /> Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaType('video')}
                    className={`flex-1 py-2 flex items-center justify-center gap-2 rounded-lg font-medium transition-all ${mediaType === 'video' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <Video className="w-4 h-4" /> Video
                  </button>
                </div>
              </div>
            )}
          </div>

          {(mediaData?.isYouTube || mediaData?.isSocial) && mediaData.title ? (
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 flex flex-col md:flex-row gap-4 items-center">
              {mediaData.thumbnail && (
                <img src={mediaData.thumbnail} alt="Thumbnail" className="w-full md:w-32 h-auto rounded-lg shadow-sm" />
              )}
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-bold text-gray-900 line-clamp-2">{mediaData.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{mediaData.uploader} • {Math.floor(mediaData.duration / 60)}:{String(mediaData.duration % 60).padStart(2, '0')}</p>
                <div className="mt-2 text-xs font-semibold text-primary bg-primary/10 inline-block px-2 py-1 rounded">
                  You are downloading: {mediaName}
                </div>
              </div>
            </div>
          ) : (
            <MediaPreview url={url} type={mediaType} />
          )}

          {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-200">{error}</div>}
          
          {success && (
            <div className="p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-2 border border-green-200 shadow-sm animate-in fade-in">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Downloaded successfully! Saved to history.
            </div>
          )}

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full py-4 px-6 border border-transparent rounded-2xl shadow-xl shadow-primary/20 text-xl font-bold text-white bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary focus:outline-none focus:ring-4 focus:ring-primary/50 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
          >
            {isDownloading ? <Loader2 className="animate-spin w-6 h-6" /> : <Save className="w-6 h-6" />}
            {isDownloading ? 'Downloading...' : 'Download Media'}
          </button>
        </div>
      )}
    </div>
  );
};

export default UrlInputForm;
