import { Link } from 'react-router-dom';
import { DownloadCloud, PlayCircle, Image, Globe, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-8 border border-primary/20 shadow-sm animate-fade-in-up">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Saver-UR is Live! Download free media now.
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight mb-8">
            The Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Media Downloader</span>
          </h1>
          
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Instantly download any image or video from any URL directly to your device. Support for multiple formats, blazingly fast parsing, completely free.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/url" className="group flex items-center justify-center gap-2 bg-primary hover:bg-accent text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
              Start Downloading 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Decorative blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/20 blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 rounded-full bg-accent/20 blur-[100px] pointer-events-none" />
      </section>

      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why use Saver-UR?</h2>
            <p className="text-gray-500 mt-4 leading-relaxed">Built for speed, user privacy, and cross-platform compatibility. Forget complex desktop apps.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-background border border-primary/10 hover:shadow-xl transition-shadow flex flex-col">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm text-primary flex items-center justify-center mb-6">
                <Globe className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Universal URLs</h3>
              <p className="text-gray-600 leading-relaxed">Works with virtually any publicly accessible URL on the internet. Paste it, and we fetch it.</p>
            </div>
            
            <div className="p-8 rounded-3xl bg-background border border-primary/10 hover:shadow-xl transition-shadow flex flex-col">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm text-primary flex items-center justify-center mb-6">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lighting Fast</h3>
              <p className="text-gray-600 leading-relaxed">Direct proxy streams meaning you save files in seconds without bandwidth throttling bottlenecks.</p>
            </div>

            <div className="p-8 rounded-3xl bg-background border border-primary/10 hover:shadow-xl transition-shadow flex flex-col">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm text-primary flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Safe & Secure</h3>
              <p className="text-gray-600 leading-relaxed">We don't log your downloads on our servers. The history stays securely encrypted locally in your browser.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-t from-primary/10 to-transparent">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to grab that file?</h2>
          <p className="text-xl text-gray-600 mb-10">Stop inspecting elements manually. Let Saver-UR do the work.</p>
          <Link to="/url" className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-900 px-8 py-4 rounded-2xl text-lg font-bold shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1">
            <DownloadCloud className="w-6 h-6 text-primary" />
            Try it out
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
