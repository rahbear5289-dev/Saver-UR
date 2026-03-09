import UrlInputForm from '../components/UrlInputForm';

const DownloadPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
        <div className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-accent to-primary opacity-20 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"></div>
      </div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8 px-4">
        <h2 className="text-3xl font-extrabold text-gray-900">Direct Download Center</h2>
        <p className="mt-2 text-sm text-gray-600">Quickly save media files through this alternate entry point.</p>
      </div>

      <div className="mx-auto w-full px-4 sm:px-0 relative z-10">
        <UrlInputForm />
      </div>
    </div>
  );
};

export default DownloadPage;
