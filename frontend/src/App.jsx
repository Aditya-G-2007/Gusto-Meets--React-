import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import LoginPage from './LoginPage';
// Make sure these paths match exactly how you named your config files!
import { auth } from "./firebase";
import { supabase } from './supabaseClient';

// Import your pages
import HomePage from './HomePage';
import DetailsPage from './DetailsPage';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    // This listens for Firebase login/logout events
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      
      console.log("Auth State Changed! User is:", firebaseUser?.email || "None");
      setCurrentUser(firebaseUser);

      // === NEW SUPABASE SYNC LOGIC ===
      if (firebaseUser) {
        const { error } = await supabase
          .from('authenticated_users')
          .upsert(
            { 
              firebase_uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: 'GUEST'
            }, 
            { 
              onConflict: 'firebase_uid', 
              ignoreDuplicates: true // Will safely ignore if they already exist
            }
          );

        if (error) {
          console.error("🔴 Error syncing user to Supabase:", error);
        } else {
          console.log("🍏 User successfully synced to Supabase with UID!");
        }
      }
      // ===============================

      setIsAuthLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Design Update: Neobrutalist Loading Screen
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-neo-bg flex items-center justify-center">
        <div className="border-3 border-black bg-neo-surface px-8 py-6 rounded-xl shadow-neo flex flex-col items-center gap-4">
          <svg className="w-8 h-8 text-neo-green animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          <h1 className="font-jakarta font-extrabold text-xl text-black">Loading Gusto Meets...</h1>
        </div>
      </div>
    );
  }

  // Design Update: Added the Neobrutalist container wrapper
  return (
    <div className="min-h-screen bg-neo-bg text-black relative pb-24">
      <Routes>
        {/* Protected Routes: Only show if currentUser exists, otherwise redirect */}
        <Route 
          path="/" 
          element={currentUser ? <HomePage /> : <Navigate to="/login" />} 
        />
        
        <Route 
          path="/space/:id" 
          element={currentUser ? <DetailsPage /> : <Navigate to="/login" />} 
        />
        
        <Route path="/login" element={<LoginPage />} /> 
      </Routes>
    </div>
  );
}
