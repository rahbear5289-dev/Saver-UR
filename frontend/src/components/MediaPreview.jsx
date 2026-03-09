const MediaPreview = ({ url, type }) => {
  if (!url) return null;

  return (
    <div className="w-full mt-6 flex justify-center overflow-hidden bg-gray-50 border-2 border-primary/20 rounded-xl relative group">
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      {type === 'image' ? (
        <img
          src={url}
          alt="Media Preview"
          className="max-h-96 w-auto object-contain p-2 rounded-xl transition-transform duration-500 group-hover:scale-[1.02]"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=Preview+Not+Available' }}
        />
      ) : (
        <video
          src={url}
          controls
          className="max-h-96 w-full object-contain p-2 rounded-xl shadow-inner"
          controlsList="nodownload"
        />
      )}
    </div>
  );
};

export default MediaPreview;
