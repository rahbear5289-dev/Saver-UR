import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ClerkProvider, useAuth, UserButton } from '@clerk/react';
import { Menu, X, Download } from 'lucide-react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Decshop from './pages/Decshop';
import Docs from './pages/Docs';
import Saver from './pages/Saver';
import Input from './pages/Input';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_placeholder';

const HeaderAuth = () => {
  const { isSignedIn } = useAuth();
  return isSignedIn ? (
    <>
      <Link to="/dashboard" className="text-gray-600 hover:text-violet-700 font-medium text-sm transition">History</Link>
      <UserButton />
    </>
  ) : (
    <>
      <Link to="/login" className="text-gray-600 hover:text-violet-700 font-medium text-sm transition">Login</Link>
      <Link to="/signup" className="btn-primary text-sm py-2">Get Started</Link>
    </>
  );
};

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 lg:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" onClick={close} className="flex items-center gap-2 font-bold text-xl text-gray-900 shrink-0">
          <div className="w-8 h-8 bg-violet-700 rounded-lg flex items-center justify-center shadow-sm shadow-violet-300">
            <Download className="w-4 h-4 text-white" strokeWidth={2.5}/>
          </div>
          Saver-UR
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 font-medium text-sm text-gray-600">
          <Link to="/" className="hover:text-violet-700 transition">Home</Link>
          <Link to="/dashboard" className="hover:text-violet-700 transition">History</Link>
          <Link to="/decshop" className="hover:text-violet-700 transition">Premium</Link>
          <Link to="/docs" className="hover:text-violet-700 transition">Legal</Link>
          <Link to="/saver" className="hover:text-violet-700 transition">Batch</Link>
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          <HeaderAuth />
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 text-gray-600" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4 font-medium text-gray-700">
          <Link to="/" onClick={close} className="hover:text-violet-700">Home</Link>
          <Link to="/dashboard" onClick={close} className="hover:text-violet-700">History</Link>
          <Link to="/decshop" onClick={close} className="hover:text-violet-700">Premium</Link>
          <Link to="/docs" onClick={close} className="hover:text-violet-700">Legal</Link>
          <Link to="/saver" onClick={close} className="hover:text-violet-700">Batch</Link>
          <Link to="/login" onClick={close} className="hover:text-violet-700">Login</Link>
          <Link to="/signup" onClick={close} className="btn-primary w-fit">Get Started</Link>
        </div>
      )}
    </header>
  );
};

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#F5F3FF] text-gray-900">
          <Navigation />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/decshop" element={<Decshop />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/saver" element={<Saver />} />
              <Route path="/input" element={<Input />} />
              <Route path="/login/*" element={<LoginPage />} />
              <Route path="/signup/*" element={<SignupPage />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-100 py-10">
            <div className="max-w-6xl mx-auto px-4 lg:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2 font-bold text-gray-900">
                <div className="w-7 h-7 bg-violet-700 rounded-lg flex items-center justify-center">
                  <Download className="w-3.5 h-3.5 text-white" strokeWidth={2.5}/>
                </div>
                Saver-UR
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <a href="#" className="hover:text-violet-700 transition">Privacy Policy</a>
                <a href="#" className="hover:text-violet-700 transition">Terms of Service</a>
                <a href="#" className="hover:text-violet-700 transition">Contact Support</a>
              </div>
              <p className="text-sm text-gray-400">© {new Date().getFullYear()} Saver-UR. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;
