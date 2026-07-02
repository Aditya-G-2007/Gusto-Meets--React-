import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { supabase } from './supabaseClient'; 
import { Search, MapPin, Users, PlusCircle, ChevronDown, Check, Star} from 'lucide-react'; 

const CITIES = ["Chennai", "Bangalore", "Mumbai", "Delhi", "Hyderabad"];
const CATEGORIES = [
  { id: 'all', label: "All Spaces" },
  { id: 'couples', label: "Couples Allowed" },
  { id: 'party', label: "Party Friendly" },
  { id: 'alcohol', label: "BYOB Allowed" },
  { id: 'overnight', label: "Overnight Stays" }
];

const CARD_COLORS = ['bg-neo-green', 'bg-neo-pink', 'bg-neo-yellow', 'bg-neo-blue'];

export default function HomePage() {
  const navigate = useNavigate();
  
  const [allSpaces, setAllSpaces] = useState([]);
  const [displayedSpaces, setDisplayedSpaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Chennai');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchSpaces = async () => {
      const { data, error } = await supabase
        .from('terraces')
        .select(`
          id, title, city, address_line, max_capacity,
          terrace_rates ( rate ),
          terrace_images ( image_url, is_cover ),
          terrace_permissions ( allow_couples, allow_loud_music, allow_alcohol, allow_overnight )
        `)
        .eq('is_active', true);

      if (error) {
        console.error("Error fetching spaces:", error);
      } else {
        setAllSpaces(data || []);
      }
      setLoading(false);
    };

    fetchSpaces();
  }, []);

  useEffect(() => {
    let filtered = [...allSpaces];

    if (selectedCity) {
      filtered = filtered.filter(space => 
        space.city?.toLowerCase() === selectedCity.toLowerCase()
      );
    }

    if (searchQuery.trim() !== '') {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(space => 
        space.title?.toLowerCase().includes(lowerQuery) || 
        space.address_line?.toLowerCase().includes(lowerQuery)
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(space => {
        const perms = space.terrace_permissions?.[0] || {};
        switch (selectedCategory) {
          case 'couples': return perms.allow_couples === true;
          case 'party': return perms.allow_loud_music === true;
          case 'alcohol': return perms.allow_alcohol === true;
          case 'overnight': return perms.allow_overnight === true;
          default: return true;
        }
      });
    }

    setDisplayedSpaces(filtered);
  }, [allSpaces, searchQuery, selectedCity, selectedCategory]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsLocationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-neo-bg flex font-inter text-black">
      <Sidebar />

      <main className="flex-1 ml-64 p-8 lg:p-12">
        
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="font-jakarta font-extrabold text-[32px] tracking-tight text-black mb-1">Explore Terraces</h1>
            <p className="font-inter font-semibold text-gray-600 text-sm">Find the perfect urban oasis for your next event.</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* List Your Terrace Button - Now GREEN */}
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-3 border-black bg-neo-green shadow-neo active:translate-y-1 active:translate-x-1 active:shadow-none transition-all text-sm font-lexend font-bold text-black">
              <PlusCircle size={18} strokeWidth={2.5} />
              List Your Terrace
            </button>

            {/* Location Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-3 border-black bg-neo-green shadow-neo active:translate-y-1 active:translate-x-1 active:shadow-none transition-all text-sm font-lexend font-bold text-black"
              >
                {selectedCity}
                <ChevronDown size={18} strokeWidth={2.5} className={`transition-transform ${isLocationOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu - Now GREEN */}
              {isLocationOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-neo-green border-3 border-black rounded-xl shadow-neo-lg py-2 z-50 overflow-hidden">
                  <div className="px-3 py-1 mb-1 border-b-2 border-black/20">
                    <span className="text-[10px] font-lexend font-bold uppercase tracking-wider text-black">Select City</span>
                  </div>
                  {CITIES.map(city => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setIsLocationOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-black hover:text-neo-green flex items-center justify-between transition-colors font-inter font-bold text-black"
                    >
                      <span>{city}</span>
                      {selectedCity === city && <Check size={16} strokeWidth={3} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Wide Search Bar */}
        <div className="bg-neo-surface border-3 border-black rounded-xl flex items-center p-2 mb-6 shadow-neo w-full focus-within:translate-y-[1px] focus-within:translate-x-[1px] focus-within:shadow-neo-sm transition-all">
          <Search className="text-black w-5 h-5 ml-3 mr-3" strokeWidth={2.5} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search spaces by name, landmark, or area..." 
            className="bg-transparent border-none outline-none text-sm w-full font-inter font-semibold text-black placeholder:text-gray-500 placeholder:font-medium py-2"
          />
        </div>

        {/* Dynamic Categories / Filters - Now ALL GREEN */}
        <div className="flex gap-3 mb-10 overflow-x-auto no-scrollbar pb-2">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button 
                key={cat.id} 
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-lexend font-bold transition-all border-3 border-black shadow-neo-sm active:translate-y-1 active:shadow-none ${
                  isActive 
                    ? 'bg-black text-neo-green' // Active is inverted to stand out among all the green
                    : 'bg-neo-green text-black hover:bg-neo-yellow'
                }`}
              >
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* Grid Display */}
        {loading ? (
          <div className="font-jakarta font-bold text-xl flex items-center justify-center py-20 text-black">
             <svg className="w-8 h-8 text-neo-green animate-spin mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            Loading spaces...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            
            {displayedSpaces.length === 0 ? (
              <div className="col-span-full py-20 text-center border-3 border-black rounded-2xl bg-neo-surface shadow-neo">
                <p className="font-jakarta font-bold text-lg text-black">No spaces found matching your search in {selectedCity}.</p>
                <button 
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }} 
                  className="mt-4 bg-neo-green border-2 border-black rounded-lg px-4 py-2 font-lexend font-bold text-sm shadow-neo-sm active:translate-y-1 active:translate-x-1 active:shadow-none transition-all text-black"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              displayedSpaces.map((space, index) => {
                const rate = space.terrace_rates?.[0]?.rate || "N/A";
                const coverImage = space.terrace_images?.find(img => img.is_cover)?.image_url 
                                || space.terrace_images?.[0]?.image_url;
                
                const cardColor = CARD_COLORS[index % CARD_COLORS.length];

                return (
                  <div 
                    key={space.id} 
                    onClick={() => navigate(`/space/${space.id}`)}
                    className="w-full rounded-2xl border-3 border-black shadow-neo overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:shadow-neo-lg cursor-pointer bg-neo-surface"
                  >
                    {/* Image Card */}
                    <div className="relative aspect-[4/3] border-b-3 border-black bg-neo-surface flex items-center justify-center overflow-hidden">
                      <button className="absolute top-3 right-3 bg-neo-surface border-2 border-black rounded-full p-2 shadow-neo-sm active:translate-x-1 active:translate-y-1 active:shadow-none z-10 transition-all text-black">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                      </button>
                      
                      {coverImage ? (
                        <img src={coverImage} alt={space.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-5xl">⛰️</div>
                      )}
                    </div>
                    
                    {/* Info Section */}
                    <div className={`${cardColor} p-4 flex-1 flex flex-col justify-between`}>
                      <div>
                        <p className="text-xs text-black flex items-center gap-1 opacity-90 font-inter font-bold uppercase tracking-wider mb-1">
                          <MapPin size={12} strokeWidth={3} /> {space.city}
                        </p>
                        <h3 className="font-jakarta font-bold text-lg truncate text-black">{space.title}</h3>
                        <p className="text-black font-inter font-semibold text-xs mt-1 flex items-center gap-1 opacity-80">
                          <Users size={12} strokeWidth={2.5} /> Up to {space.max_capacity} guests
                        </p>
                      </div>
                      
                      <div className="flex justify-between items-end mt-4">
                        <div className="flex flex-col">
                           <span className="border-2 border-black bg-neo-surface rounded-md px-2 py-1 text-neo-green font-lexend font-black text-sm shadow-neo-sm w-max">
                            ₹{rate}/hr
                          </span>
                        </div>
                        <div className="font-inter font-black text-sm flex items-center gap-1 text-black bg-neo-surface border-2 border-black px-2 py-1 rounded-md shadow-neo-sm">
                          <span className="text-yellow-400">⭐</span> 4.9
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}
      </main> 
    </div>
  );
}