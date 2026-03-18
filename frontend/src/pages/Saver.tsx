import { Layers, Settings2, History, Download } from 'lucide-react';

export default function Saver() {
  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-6 py-12 pb-24">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Batch Saver</h1>
        <p className="text-gray-500">Queue multiple URLs and let Saver-UR process them all in the background.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 flex flex-col">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
              <Layers className="w-5 h-5 text-violet-600"/>
            </div>
            <h2 className="text-lg font-bold text-gray-900">URL Queue</h2>
          </div>
          <textarea
            className="flex-1 h-52 p-4 bg-gray-50 border border-gray-200 rounded-xl mb-5 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition resize-none font-mono text-sm text-gray-700 placeholder-gray-400 leading-relaxed"
            placeholder={"Paste URLs here, one per line...\nhttps://youtube.com/watch?v=...\nhttps://instagram.com/reel/..."}
          />
          <button className="btn-primary justify-center">
            <Download className="w-4 h-4"/> Process Queue
          </button>
        </div>

        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                <Settings2 className="w-5 h-5 text-violet-600"/>
              </div>
              <h2 className="text-lg font-bold text-gray-900">Global Settings</h2>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Quality</label>
                <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:border-violet-400 outline-none">
                  <option>Maximum (4K / 1080p)</option>
                  <option>Standard (720p)</option>
                  <option>Audio Only (MP3 320kbps)</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest">Options</label>
                {['Compress into ZIP archive', 'Email me when complete'].map((opt, i) => (
                  <label key={i} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition text-xs font-bold
                      ${i === 1 ? 'bg-violet-700 border-violet-700 text-white' : 'border-gray-300 group-hover:border-violet-400'}`}>
                      {i === 1 && '✓'}
                    </div>
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                <History className="w-5 h-5 text-violet-600"/>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Recent Batches</h3>
                <p className="text-xs text-gray-400">View queue history</p>
              </div>
            </div>
            <button className="text-violet-600 hover:text-violet-800 font-semibold text-sm transition">View →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
