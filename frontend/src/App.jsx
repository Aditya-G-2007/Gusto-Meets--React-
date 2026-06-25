import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase.js"; 

// Import your pages
// (Make sure you actually created HomePage.jsx and DetailsPage.jsx from our previous steps!)
import LoginPage from "./LoginPage.jsx";  
import HomePage from "./HomePage.jsx"; 
import DetailsPage from "./DetailsPage.jsx";

// ---------------------------------------------------------
// 1. A mini-component to act as a "Bouncer" for private routes
// ---------------------------------------------------------
const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    // If they aren't logged in, kick them back to login page
    return <Navigate to="/login" replace />;
  }
  // If they are logged in, let them see the page
  return children;
};

// ---------------------------------------------------------
// 2. The Main App Component
// ---------------------------------------------------------
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Prevents flickering while Firebase checks status

  useEffect(() => {
    // This listener watches Firebase constantly. 
    // The moment you log in via Google, this fires and updates the 'user' state.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth State Changed! User is:", currentUser ? currentUser.email : "Not logged in");
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup the listener when the app closes
    return () => unsubscribe();
  }, []);

  // Show a dark loading screen while Firebase is figuring out if you are logged in
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e1a12] flex items-center justify-center">
        <p className="text-[#4ade80]">Loading Gusto Meets...</p>
      </div>
    );
  }

  return (
    // Note: We don't need <BrowserRouter> here because you already put it in main.jsx!
    <Routes>
      
      {/* LOGIN ROUTE */}
      {/* If the user is already logged in, redirect them away from the login page to Home */}
      <Route 
        path="/login" 
        element={user ? <Navigate to="/" replace /> : <LoginPage />} 
      />
      
      {/* HOME ROUTE (Protected) */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute user={user}>
            <HomePage />
          </ProtectedRoute>
        } 
      />

      {/* SPACE DETAILS ROUTE (Protected) */}
      <Route 
        path="/space/:id" 
        element={
          <ProtectedRoute user={user}>
            <DetailsPage />
          </ProtectedRoute>
        } 
      />

    </Routes>
  );
}

export default App;
