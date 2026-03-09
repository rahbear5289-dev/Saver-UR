import { useState, useEffect } from 'react';
import { Trash2, AlertCircle, History } from 'lucide-react';
import SavedCard from '../components/SavedCard';
import { getSavedUrls, deleteSavedUrl, clearAllSavedUrls } from '../utils/storage';
import { getDownloadUrl } from '../utils/api';

const SavedPage = () => {
  const [savedItems, setSavedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setSavedItems(getSavedUrls());
    setIsLoading(false);
  }, []);

  const handleDelete = (id) => {
    const updated = deleteSavedUrl(id);
    setSavedItems(updated);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all your saved URLs? This cannot be undone.')) {
      clearAllSavedUrls();
      setSavedItems([]);
    }
  };

  const handleDownload = (item) => {
    try {
      const downloadLink = getDownloadUrl(item.url, item.name, item.type);
      const a = document.createElement('a');
      a.href = downloadLink;
      a.target = '_blank';
      a.download = item.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      alert('Error triggering download. Please try again.');
    }
  };

  const calculateStorageUsed = () => {
    try {
      let _lsTotal = 0, _xLen, _x;
      for (_x in localStorage) {
          if (!localStorage.hasOwnProperty(_x)) continue;
          _xLen = ((localStorage[_x].length + _x.length) * 2);
          _lsTotal += _xLen;
      }
      return (_lsTotal / 1024).toFixed(2); // In KB
    } catch (e) {
      return 0;
    }
  };

  const kbUsed = calculateStorageUsed();
  const showStorageWarning = kbUsed > 4000; // Warning around 4MB since limit is 5MB

  if (isLoading) {
    return <div className="min-h-screen bg-background flex justify-center py-20">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background pt-12 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              <History className="w-8 h-8 text-primary" />
              Saved History
            </h1>
            <p className="text-gray-500 mt-2">Manage all the media URLs you've downloaded.</p>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            {savedItems.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Clear All
              </button>
            )}
            <span className="text-xs text-gray-400">
              Storage used: {kbUsed} KB
            </span>
          </div>
        </div>

        {showStorageWarning && (
          <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-yellow-800">Storage almost full</h3>
              <p className="text-sm text-yellow-700 mt-1">Your local storage is approaching the 5MB browser limit. Please clear some saved items to ensure uninterrupted service.</p>
            </div>
          </div>
        )}

        {savedItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <History className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No saved URLs yet</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">You haven't downloaded any media yet. Start downloading to build your history.</p>
            <a href="/url" className="inline-block bg-primary hover:bg-accent text-white font-medium px-8 py-3 rounded-xl transition-colors">
              Start Downloading
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedItems.map(item => (
              <SavedCard 
                key={item.id} 
                item={item} 
                onDelete={handleDelete} 
                onDownload={handleDownload} 
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default SavedPage;
