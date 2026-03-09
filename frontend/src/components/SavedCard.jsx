import { Download, Trash2, Image as ImageIcon, Video, Clock } from 'lucide-react';

const SavedCard = ({ item, onDelete, onDownload }) => {
  const isImage = item.type === 'image';
  
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${isImage ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'}`}>
            {isImage ? <ImageIcon className="w-6 h-6" /> : <Video className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 truncate max-w-[150px] md:max-w-[200px]" title={item.name}>
              {item.name}
            </h3>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <Clock className="w-3 h-3" />
              <span>{new Date(item.savedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 break-all">
        <p className="text-xs text-gray-400 line-clamp-2" title={item.url}>
          {item.url}
        </p>
      </div>

      <div className="mt-5 flex gap-2">
        <button
          onClick={() => onDownload(item)}
          className="flex-1 bg-gray-50 hover:bg-primary hover:text-white text-gray-700 font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
        >
          <Download className="w-4 h-4" /> Download
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default SavedCard;
