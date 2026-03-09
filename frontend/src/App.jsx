import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import UrlPage from './pages/UrlPage';
import DownloadPage from './pages/DownloadPage';
import SavedPage from './pages/SavedPage';
import QRPage from './pages/QRPage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-[80px]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/url" element={<UrlPage />} />
            <Route path="/download" element={<DownloadPage />} />
            <Route 
              path="/saved" 
              element={
                <>
                  <SignedIn>
                    <SavedPage />
                  </SignedIn>
                  <SignedOut>
                    <div className="flex-grow flex items-center justify-center p-6">
                      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Content Protected</h2>
                        <p className="text-gray-600 mb-6">Please sign in to view your saved URLs.</p>
                      </div>
                    </div>
                  </SignedOut>
                </>
              } 
            />
            <Route path="/qr" element={<QRPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
