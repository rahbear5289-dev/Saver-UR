import { useState } from 'react';
import { Shield, Book, ScrollText, CheckCircle, Send, AlertTriangle, FileText } from 'lucide-react';

const TABS = [
  { id: 'dmca', label: 'DMCA Policy', icon: Shield },
  { id: 'copyright', label: 'Copyright', icon: Book },
  { id: 'terms', label: 'Terms of Service', icon: ScrollText },
];

export default function Docs() {
  const [activeTab, setActiveTab] = useState('dmca');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-12 pb-24">
      {/* Header */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Legal Center</h1>
        <p className="text-gray-500">Important guidelines and legal documentation for Saver-UR users.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 bg-white p-1.5 rounded-2xl border border-gray-100 w-fit">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition
                  ${activeTab === t.id ? 'bg-violet-700 text-white shadow-md shadow-violet-200' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <t.icon className="w-4 h-4" /> {t.label}
              </button>
            ))}
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-10">
            {activeTab === 'dmca' && (
              <div className="animate-in fade-in duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-red-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">DMCA Policy</h2>
                </div>
                <div className="prose prose-violet max-w-none text-gray-600 leading-relaxed space-y-4">
                  <p>Saver-UR respects the intellectual property rights of others. If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement, please provide our Copyright Agent with a written notice containing the following information:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
                    <li>Identification of the copyrighted work claimed to have been infringed.</li>
                    <li>Identification of the material that is claimed to be infringing or to be the subject of infringing activity and that is to be removed.</li>
                    <li>Information reasonably sufficient to permit the service provider to contact you, such as an address, telephone number, and email.</li>
                  </ul>
                  <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex gap-4 mt-8">
                    <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
                    <p className="text-sm text-amber-800">
                      <strong>Important Note:</strong> Please be aware that under Section 512(f) of the DMCA, any person who knowingly materially misrepresents that material or activity is infringing may be subject to liability.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'copyright' && (
              <div className="animate-in fade-in duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
                    <Book className="w-5 h-5 text-violet-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Copyright Information</h2>
                </div>
                <div className="prose prose-violet max-w-none text-gray-600 space-y-4">
                  <p>All content provided on Saver-UR is for personal use only. Our platform acts as a technical intermediary between users and third-party content hosting providers.</p>
                  <p>We do not host any copyrighted files on our servers. When you use our service, you are essentially creating a personal backup of publicly available content for which you must have the legal right to access.</p>
                </div>
              </div>
            )}
             {activeTab === 'terms' && (
              <div className="animate-in fade-in duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <ScrollText className="w-5 h-5 text-blue-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Terms of Service</h2>
                </div>
                <p className="text-gray-600 mb-4">By using Saver-UR, you agree to comply with the following terms:</p>
                <div className="grid gap-4">
                  {[
                    'You will not use the service for any illegal purposes.',
                    'You are solely responsible for the content you download.',
                    'The service is provided "as is" without warranties of any kind.',
                    'We reserve the right to block access to specific URLs or users.'
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <CheckCircle className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Form */}
        <div className="lg:w-96 shrink-0">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Submit a Notice</h3>
            <p className="text-sm text-gray-500 mb-6">Use this form to send a DMCA or legal inquiry directly to our team.</p>
            
            {submitted ? (
              <div className="bg-green-50 border border-green-100 rounded-2xl p-6 text-center animate-in zoom-in duration-300">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-green-800 font-bold mb-1">Notice Submitted</p>
                <p className="text-green-600 text-xs">Our legal team will review your inquiry within 24-48 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Subject</label>
                  <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-violet-400 outline-none">
                    <option>DMCA Takedown Request</option>
                    <option>Copyright Information</option>
                    <option>General Legal Inquiry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                  <input required placeholder="Your legal name" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-violet-400 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                  <input required type="email" placeholder="legal@example.com" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-violet-400 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Details</label>
                  <textarea required rows={4} placeholder="Describe the inquiry details..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-violet-400 outline-none resize-none"></textarea>
                </div>
                <button 
                  disabled={loading}
                  type="submit" 
                  className="btn-primary w-full justify-center py-3"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Send Notice</>}
                </button>
              </form>
            )}
            
            <div className="mt-8 flex items-center gap-2 p-3 bg-violet-50 rounded-xl border border-violet-100">
               <FileText className="w-4 h-4 text-violet-600" />
               <span className="text-[10px] font-bold text-violet-700 uppercase tracking-tighter">Response time: ~24 hours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline Loader for consistency
const Loader2 = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);
