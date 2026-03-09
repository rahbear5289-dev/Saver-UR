import { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { QrCode, Download, Link2, Trash2, CheckCircle } from 'lucide-react';

const QRPage = () => {
  const [inputUrl, setInputUrl] = useState('');
  const [qrValue, setQrValue] = useState('');
  const [qrSize, setQrSize] = useState(256);
  const [fgColor, setFgColor] = useState('#6B21A8');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const qrRef = useRef(null);

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleGenerate = () => {
    const trimmed = inputUrl.trim();
    if (!trimmed) {
      setError('Please enter a URL first.');
      return;
    }
    const withProtocol = trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? trimmed
      : `https://${trimmed}`;
    if (!isValidUrl(withProtocol)) {
      setError('Please enter a valid URL (e.g. https://example.com).');
      return;
    }
    setError('');
    setQrValue(withProtocol);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleGenerate();
  };

  const handleClear = () => {
    setInputUrl('');
    setQrValue('');
    setError('');
  };

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qrcode.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyUrl = async () => {
    if (!qrValue) return;
    try {
      await navigator.clipboard.writeText(qrValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="min-h-screen bg-background pt-12 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <QrCode className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">QR Code Generator</h1>
          <p className="text-gray-500 mt-2">Enter any URL to generate a downloadable QR code instantly.</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

          {/* Input Section */}
          <div className="p-8 border-b border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Link2 className="inline w-4 h-4 mr-1 text-primary" />
              Enter URL
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => { setInputUrl(e.target.value); setError(''); }}
                onKeyDown={handleKeyDown}
                placeholder="https://example.com"
                className={`flex-1 px-4 py-3 rounded-xl border ${
                  error ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-primary/30'
                } focus:outline-none focus:ring-4 focus:border-primary text-gray-800 text-sm transition-all`}
              />
              {inputUrl && (
                <button
                  onClick={handleClear}
                  title="Clear"
                  className="px-3 py-3 rounded-xl border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-300 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={handleGenerate}
                className="px-6 py-3 bg-primary hover:bg-accent text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm"
              >
                Generate
              </button>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-500 font-medium">{error}</p>
            )}
          </div>

          {/* Customization */}
          <div className="px-8 py-5 bg-gray-50 border-b border-gray-100 flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">QR Color</label>
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-9 h-9 rounded-full border-2 border-gray-200 cursor-pointer p-0.5"
                title="QR Code Color"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Background</label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-9 h-9 rounded-full border-2 border-gray-200 cursor-pointer p-0.5"
                title="Background Color"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Size</label>
              <select
                value={qrSize}
                onChange={(e) => setQrSize(Number(e.target.value))}
                className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/30 text-gray-700 cursor-pointer"
              >
                <option value={128}>Small (128px)</option>
                <option value={256}>Medium (256px)</option>
                <option value={384}>Large (384px)</option>
                <option value={512}>XL (512px)</option>
              </select>
            </div>
          </div>

          {/* QR Display */}
          <div className="p-8 flex flex-col items-center">
            {qrValue ? (
              <div className="flex flex-col items-center gap-6 w-full animate-[fadeIn_0.4s_ease]">
                {/* QR Code Canvas */}
                <div
                  ref={qrRef}
                  className="p-4 rounded-2xl border-2 border-primary/20 shadow-lg inline-block"
                  style={{ backgroundColor: bgColor }}
                >
                  <QRCodeCanvas
                    value={qrValue}
                    size={qrSize}
                    fgColor={fgColor}
                    bgColor={bgColor}
                    level="H"
                    includeMargin={false}
                  />
                </div>

                {/* URL Display */}
                <div className="w-full max-w-md bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 flex items-center gap-3">
                  <Link2 className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-sm text-gray-700 truncate flex-1">{qrValue}</span>
                  <button
                    onClick={handleCopyUrl}
                    className="text-xs font-semibold text-primary hover:text-accent transition-colors flex items-center gap-1"
                  >
                    {copied ? (
                      <><CheckCircle className="w-4 h-4 text-green-500" /> Copied!</>
                    ) : 'Copy'}
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 flex-wrap justify-center">
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-primary hover:bg-accent text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <Download className="w-5 h-5" />
                    Download QR Code (PNG)
                  </button>
                  <button
                    onClick={handleClear}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold px-6 py-3 rounded-xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                    Clear
                  </button>
                </div>

                <p className="text-xs text-gray-400">Scan this QR code with any camera to open the URL.</p>
              </div>
            ) : (
              <div className="py-16 flex flex-col items-center text-center gap-4">
                <div className="w-24 h-24 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-gray-200" />
                </div>
                <p className="text-gray-400 text-sm max-w-xs">
                  Enter a URL above and click <span className="font-semibold text-primary">Generate</span> to create your QR code.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: '🔗 Any URL', desc: 'Works with websites, YouTube links, social media, and more.' },
            { title: '🎨 Customizable', desc: 'Change colors and size to match your branding.' },
            { title: '📥 Downloadable', desc: 'Save QR code as PNG and use it anywhere.' },
          ].map((tip) => (
            <div key={tip.title} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-1">{tip.title}</h3>
              <p className="text-gray-500 text-sm">{tip.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default QRPage;
