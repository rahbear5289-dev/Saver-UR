import { useState, useEffect } from 'react';
import { Download, Search, Trash2, Eye, Plus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@clerk/react';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://saver-ur-1.onrender.com/api';

const TABS = ['All', 'Movies', 'Music', 'Social'];

export default function Dashboard() {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const [tab, setTab] = useState('All');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) fetchHistory();
  }, [isLoaded]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const headers: any = {};
      if (isSignedIn) {
        const token = await getToken();
        if (token) headers.Authorization = `Bearer ${token}`;
      }
      const { data } = await axios.get(`${API_BASE}/history`, { headers });
      setItems(data.downloads || []);
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = items.filter(i => 
    i.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-8 pb-20">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Download History</h1>
          <p className="text-gray-500 text-sm mt-1">
            {loading ? 'Refreshing...' : `You have ${items.length} successful downloads`}
          </p>
        </div>
        <Link to="/" className="btn-primary">
          <Plus className="w-4 h-4"/> New Download
        </Link>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
          <input
            type="text"
            placeholder="Search by video title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition"
          />
        </div>
        <div className="flex items-center gap-2">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition ${tab === t ? 'bg-violet-700 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:border-violet-300'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <Loader2 className="w-10 h-10 text-violet-400 animate-spin mb-4"/>
          <p className="text-gray-500 font-medium text-lg">Loading your history...</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(item => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-violet-100 transition-all group">
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                {item.thumbnail ? (
                  <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-violet-50">
                    <Download className="w-8 h-8 text-violet-200"/>
                  </div>
                )}
                {item.duration && (
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                    {Math.floor(item.duration / 60)}:{String(item.duration % 60).padStart(2, '0')}
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1 line-clamp-2">{item.title}</h3>
                <p className="text-xs text-gray-400 mb-3">{item.channel || 'Video Web'}</p>
                <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                  <div><span className="font-semibold uppercase tracking-wide text-[10px]">Downloaded</span><br/>{item.date}</div>
                  <div className="text-right"><span className="font-semibold uppercase tracking-wide text-[10px]">Size</span><br/>{item.size}</div>
                </div>
                <div className="flex items-center gap-2">
                  <a href={item.url} target="_blank" rel="noreferrer" className="btn-primary flex-1 text-xs py-2 justify-center">
                    <Eye className="w-3.5 h-3.5"/> View Original
                  </a>
                  <button className="btn-outline text-xs py-2 px-3">
                    <Download className="w-3.5 h-3.5"/>
                  </button>
                  <button onClick={() => setItems(prev => prev.filter(i => i.id !== item.id))}
                    className="btn-outline text-xs py-2 px-3 text-red-500 hover:text-red-600 hover:border-red-200">
                    <Trash2 className="w-3.5 h-3.5"/>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add new card */}
          <Link to="/" className="bg-violet-50 border-2 border-violet-200 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 text-center hover:bg-violet-100 transition group min-h-[300px]">
            <div className="w-12 h-12 bg-violet-200 rounded-full flex items-center justify-center mb-3 group-hover:bg-violet-300 transition">
              <Plus className="w-6 h-6 text-violet-600"/>
            </div>
            <p className="font-bold text-violet-700 mb-1">New Download</p>
            <p className="text-sm text-violet-500">Paste a link to start downloading a new video</p>
          </Link>
        </div>
      )}

      {!loading && filtered.length > 12 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {['‹', '1', '2', '3', '...', '12', '›'].map((p, i) => (
            <button key={i} className={`w-10 h-10 rounded-xl text-sm font-semibold transition
              ${p === '1' ? 'bg-violet-700 text-white shadow' : 'bg-white border border-gray-200 text-gray-600 hover:border-violet-300 hover:text-violet-700'}`}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
