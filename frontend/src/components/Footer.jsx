import { DownloadCloud } from 'lucide-react';

const Footer = () => (
  <footer className="bg-white border-t border-gray-200 mt-auto py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-2 text-primary font-bold">
        <DownloadCloud size={24} />
        <span>Saver-UR</span>
      </div>
      <p className="text-gray-500 text-sm">
        © {new Date().getFullYear()} Saver-UR. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
