import UrlInputForm from '../components/UrlInputForm';

const UrlPage = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/clean-textile.png')] opacity-[0.03]" />
      
      {/* Decorative background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full relative z-10">
        <UrlInputForm />
      </div>
    </div>
  );
};

export default UrlPage;
