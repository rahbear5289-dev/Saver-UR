import { useState } from 'react';
import { Send, Terminal } from 'lucide-react';

export default function Input() {
  const [inputVal, setInputVal] = useState('');
  const [logs, setLogs] = useState<string[]>([
    '❯ system connected — kernel v1.0.4',
    '❯ daemon ready, awaiting payload...',
  ]);

  const handleSend = () => {
    if (!inputVal.trim()) return;
    setLogs(prev => [...prev, `❯ ${inputVal}`, '  → {"status": "ok", "message": "Received"}']);
    setInputVal('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-6 py-12 pb-24">
      <div className="mb-8">
        <p className="text-xs font-bold text-violet-600 uppercase tracking-widest flex items-center gap-2 mb-3">
          <Terminal className="w-3.5 h-3.5"/> Developer Terminal
        </p>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Raw Input Console</h1>
        <p className="text-gray-500">For power users: interact directly with the Saver-UR daemon using raw JSON payloads.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="bg-gray-50 border-b border-gray-100 px-5 py-3.5 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
          <span className="text-gray-400 text-xs font-mono ml-4">saver-ur-cli — zsh — 80×24</span>
        </div>

        {/* Output */}
        <div className="p-5 h-80 overflow-y-auto bg-[#1E1B4B] font-mono text-sm text-gray-300">
          <p className="text-xs text-gray-600 mb-4">Saver-UR Terminal v1.0.4</p>
          {logs.map((line, i) => (
            <div key={i} className={`mb-1 ${line.startsWith('❯') ? 'text-green-400' : 'text-gray-500 pl-4'}`}>{line}</div>
          ))}
          <p className="mt-4 text-violet-400/50 text-xs">Hint: try {`{ "action": "ping" }`}</p>
        </div>

        {/* Input row */}
        <div className="border-t border-gray-100 bg-gray-50 p-4 flex items-center gap-3">
          <span className="text-violet-600 font-bold font-mono text-lg shrink-0">~</span>
          <input
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={`{ "url": "https://...", "resolution": "MAX" }`}
            className="bg-transparent text-gray-700 w-full outline-none placeholder-gray-400 font-mono text-sm py-2"
          />
          <button onClick={handleSend}
            className="btn-primary text-sm py-2 px-4 shrink-0">
            <Send className="w-4 h-4"/>
          </button>
        </div>
      </div>
    </div>
  );
}
