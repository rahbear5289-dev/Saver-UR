import { SignUp } from "@clerk/react";

export default function SignupPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-12 px-4 animate-fade-in-up">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">Join Saver-ur</h1>
        <p className="text-muted">Create an account to save your favorite videos forever.</p>
      </div>
      
      <div className="shadow-custom rounded-2xl overflow-hidden border border-lavender">
        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-primary hover:bg-primary-dark transition-all text-sm font-bold',
              card: 'shadow-none border-none',
              headerTitle: 'text-primary',
            }
          }}
          routing="path" 
          path="/signup" 
          signInUrl="/login"
        />
      </div>
    </div>
  );
}
