import { Link, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/clerk-react';
import { DownloadCloud, Menu, X } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'URL Downloader', path: '/url' },
    { name: 'Download Entry', path: '/download' },
    { name: 'Saved History', path: '/saved' },
    { name: 'QR Generator', path: '/qr' },
  ];

  return (
    <nav className="fixed w-full z-50 top-0 left-0 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-2 text-primary hover:text-accent transition-colors">
            <DownloadCloud size={28} strokeWidth={2.5} />
            <span className="font-extrabold text-2xl tracking-tight">Saver-UR</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={clsx(
                  "text-sm font-medium transition-colors hover:text-accent",
                  location.pathname === link.path ? "text-primary border-b-2 border-primary pb-1" : "text-gray-600"
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="pl-4 border-l border-gray-200">
              <SignedIn>
                <UserButton appearance={{ elements: { userButtonAvatarBox: "w-9 h-9" } }} />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="bg-primary hover:bg-accent text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-primary">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={clsx(
                  "block px-3 py-3 rounded-md text-base font-medium",
                  location.pathname === link.path ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 mt-2 border-t border-gray-100 px-3 flex items-center justify-between">
              <span className="text-gray-600 font-medium tracking-wide">Account</span>
              <SignedIn>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button onClick={() => setIsOpen(false)} className="bg-primary text-white px-4 py-2 rounded-lg font-medium">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
