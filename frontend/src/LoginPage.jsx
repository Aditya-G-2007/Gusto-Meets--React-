import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { Phone } from "lucide-react"; 

// Import Firebase tools
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider } from "./firebase.js"; 

function LoginPage() {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate(); 

  // --- THE FIX IS HERE ---
  // This useEffect runs the moment the LoginPage loads.
  // It watches Firebase. If it sees you are logged in (from a previous popup 
  // or redirect), it immediately forces you to the next page.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Login detected! Forcing navigation to Home...");
        navigate("/"); 
      }
    });
    
    return () => unsubscribe();
  }, [navigate]);
  // -----------------------

  const handlePhoneLogin = () => {
    console.log("Phone login attempted with:", phone);
  };

  const handleGoogleLogin = async () => {
    try {
      // Using Popup here. Once it succeeds, the useEffect above will catch it and navigate!
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-neo-bg flex flex-col items-center justify-center px-4 font-inter">
      <div className="w-full max-w-sm">

        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-neo-green flex items-center justify-center mb-4 border-3 border-black shadow-neo">
            <span className="text-black font-jakarta font-extrabold text-2xl tracking-tight">GM</span>
          </div>
          <h1 className="text-black text-3xl font-jakarta font-extrabold tracking-tight">gusto meets</h1>
        </div>

        {/* Main Login Card */}
        <div className="bg-neo-surface border-3 border-black rounded-3xl p-8 shadow-neo-lg">
          
          {/* Header */}
          <h2 className="text-black text-2xl font-jakarta font-extrabold mb-1">Find your space</h2>
          <p className="text-gray-600 font-inter font-medium text-sm mb-8 leading-relaxed">
            Terraces for creators, photographers & private moments
          </p>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-neo-bg hover:bg-gray-100 border-3 border-black shadow-neo-sm text-black font-lexend font-bold text-sm rounded-xl py-3.5 flex items-center justify-center gap-3 transition-all active:translate-y-[1px] active:translate-x-[1px] active:shadow-none mb-6"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-[2px] bg-black" />
            <span className="text-black font-lexend font-bold text-xs lowercase">or</span>
            <div className="flex-1 h-[2px] bg-black" />
          </div>

          {/* Phone Input */}
          <div className="mb-4">
            <div className="flex items-center bg-neo-surface border-3 border-black rounded-xl px-4 py-3.5 gap-3 shadow-neo-sm focus-within:translate-y-[1px] focus-within:translate-x-[1px] focus-within:shadow-none transition-all">
              <Phone size={18} strokeWidth={2.5} className="text-black" />
              <input
                type="tel"
                placeholder="Enter 10-digit number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-transparent text-black font-inter font-bold text-sm flex-1 outline-none placeholder:text-gray-400 placeholder:font-medium"
              />
            </div>
          </div>

          {/* Sign In Button (Get OTP) */}
          <button
            onClick={handlePhoneLogin}
            className="w-full bg-neo-green hover:bg-neo-yellow border-3 border-black shadow-neo-sm text-black font-lexend font-extrabold text-sm rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all active:translate-y-[1px] active:translate-x-[1px] active:shadow-none"
          >
            Get OTP
          </button>

          {/* Footer Terms */}
          <p className="text-center text-gray-500 font-inter font-medium text-xs mt-8">
            By continuing, you agree to our Terms & Privacy Policy
          </p>
          
        </div>
      </div>
    </div>
  );
}

export default LoginPage;