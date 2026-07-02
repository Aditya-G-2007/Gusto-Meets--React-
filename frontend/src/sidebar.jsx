import React from 'react';
import { Home, Calendar, User, LogOut, Settings, MapPin } from 'lucide-react';

export default function Sidebar() {
  const activePath = "/";

  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'My Bookings', icon: Calendar, path: '/bookings' },
    { name: 'Saved Spaces', icon: MapPin, path: '/saved' },
    { name: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <aside className="w-64 h-screen bg-[#33D19E] border-r-3 border-black flex flex-col fixed left-0 top-0 z-50">
      
      {/* Header / Logo Area - Now GREEN */}
      <div className="p-6 flex items-center gap-3 border-b-3 border-black bg-neo-green">
        <div className="w-10 h-10 rounded-xl bg-neo-surface flex items-center justify-center border-3 border-black shadow-neo-sm">
          <span className="text-black font-lexend font-black text-sm tracking-tight">GM</span>
        </div>
        <h1 className="text-black text-2xl font-jakarta font-extrabold tracking-tight">Gusto Meets</h1>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 py-6 px-4 flex flex-col gap-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePath === item.path;
          return (
            <button
              key={item.name}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left font-lexend font-bold text-sm border-3 ${
                isActive 
                  ? 'bg-neo-surface text-black border-black shadow-neo-sm' 
                  : 'bg-transparent text-black border-transparent hover:border-black hover:bg-white/50 active:translate-y-[1px]'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 3 : 2.5} className="text-black" />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Area */}
      <div className="p-4 border-t-3 border-black bg-neo-green">
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left text-black font-lexend font-bold text-sm border-3 border-transparent hover:border-black hover:bg-white/50 active:translate-y-[1px] mb-2">
          <Settings size={20} strokeWidth={2.5} className="text-black" />
          <span>Settings</span>
        </button>
        
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left text-black font-lexend font-bold text-sm border-3 border-transparent hover:border-black hover:bg-neo-pink hover:shadow-neo-sm active:translate-y-1 active:translate-x-1 active:shadow-none">
          <LogOut size={20} strokeWidth={2.5} className="text-black" />
          <span>Sign Out</span>
        </button>
      </div>
      
    </aside>
  );
} 