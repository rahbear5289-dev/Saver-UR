import { SignIn } from "@clerk/react";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-12 px-4 animate-fade-in-up">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary mb-2 shadow-sm">Welcome Back to Saver-ur</h1>
        <p className="text-muted">Sign in to access your download history and premium tools.</p>
      </div>
      
      <div className="shadow-custom rounded-2xl overflow-hidden border border-lavender">
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-primary hover:bg-primary-dark transition-all text-sm font-bold',
              card: 'shadow-none border-none',
              headerTitle: 'text-primary',
              socialButtonsBlockButton: 'border-lavender hover:bg-lavender/10 transition',
            }
          }}
          routing="path" 
          path="/login" 
          signUpUrl="/signup"
        />
      </div>
    </div>
  );
}
