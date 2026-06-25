import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { supabase } from './supabaseClient'; // Import your client
import { Search, SlidersHorizontal, MapPin, Users } from 'lucide-react'; 

export default function HomePage() {
  const navigate = useNavigate();
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpaces = async () => {
      // Relational query: Fetch terraces along with their hourly rate and cover image
      const { data, error } = await supabase
        .from('terraces')
        .select(`
          id, title, city, address_line, max_capacity,
          terrace_rates ( rate ),
          terrace_images ( image_url )
        `)
        .eq('is_active', true);

      if (error) {
        console.error("Error fetching spaces:", error);
      } else {
        setSpaces(data || []);
      }
      setLoading(false);
    };

    fetchSpaces();
  }, []);

  return (
    <div className="min-h-screen bg-[#0e1a12] flex font-sans">
      <Sidebar />

      <main className="flex-1 ml-64 p-8 lg:p-12 text-white">
        <h1 className="text-4xl font-semibold mb-2">Find your space</h1>
        <div className="text-[#4ade80] text-sm mb-8 flex items-center gap-1 cursor-pointer w-fit">
          <MapPin size={16} /> Chennai <span>⌄</span>
        </div>

        {/* Desktop Search Bar */}
        <div className="bg-[#141f17] border border-[#1e3a28] rounded-xl flex items-center p-4 mb-10 shadow-sm max-w-3xl">
          <Search className="text-[#4ade80] w-5 h-5 mr-3" />
          <input 
            type="text" 
            placeholder="Search terraces, lofts..." 
            className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-gray-500"
          />
          <button className="bg-[#1e3a28] p-2 rounded-lg text-gray-300 hover:text-white transition-colors ml-2">
            <SlidersHorizontal size={18} />
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading spaces...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
            {spaces.map((space) => {
              // Extract relational data safely
              const rate = space.terrace_rates?.[0]?.rate || "N/A";
              const coverImage = space.terrace_images?.[0]?.image_url;

              return (
                <div 
                  key={space.id} 
                  onClick={() => navigate(`/space/${space.id}`)}
                  className="group cursor-pointer flex flex-col"
                >
                  {/* Image Card */}
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3 bg-[#1e3a28]">
                    <button className="absolute top-3 right-3 p-2 bg-transparent hover:bg-black/20 rounded-full z-10 text-white transition-all">
                      ♡
                    </button>
                    {coverImage ? (
                      <img src={coverImage} alt={space.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-5xl group-hover:scale-105 transition-transform duration-500">⛰️</div>
                    )}
                  </div>
                  
                  {/* Info Section */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-base truncate text-gray-100">{space.city}, India</h3>
                      <p className="text-gray-400 text-sm mt-0.5 truncate">{space.title}</p>
                      <p className="text-gray-500 text-sm mt-0.5 flex items-center gap-1"><Users size={14} /> Up to {space.max_capacity} guests</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-yellow-500">★</span>
                      <span className="text-gray-200">4.9</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-[#4ade80] font-semibold">₹{rate}</span>
                    <span className="text-gray-400 text-sm"> / hr</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  );
}