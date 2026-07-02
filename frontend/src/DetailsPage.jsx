import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient'; 
import { MapPin, Users, Star, CheckCircle2, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';

// ==========================================
// 1. CALENDAR PICKER COMPONENT (Popup)
// ==========================================
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function CalendarPicker({ selectedDate, onSelectDate }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewDate, setViewDate] = useState(selectedDate || new Date(today.getFullYear(), today.getMonth(), 1));

  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();

  const isSameDay = (a, b) => a && b && a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
  const isPast = (d) => d < today;

  return (
    <div className="bg-neo-surface border-3 border-black rounded-xl p-4 w-72 shadow-neo absolute top-full left-0 mt-2 z-50">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1.5 border-2 border-transparent hover:border-black rounded-lg text-black transition-all active:translate-y-[1px]"><ChevronLeft size={18} strokeWidth={2.5} /></button>
        <span className="text-black text-sm font-lexend font-bold uppercase tracking-wide">{MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}</span>
        <button onClick={nextMonth} className="p-1.5 border-2 border-transparent hover:border-black rounded-lg text-black transition-all active:translate-y-[1px]"><ChevronRight size={18} strokeWidth={2.5} /></button>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {DAYS.map((d) => <div key={d} className="text-center text-xs font-lexend font-bold text-gray-500 py-1">{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-y-1 gap-x-1">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
          const past = isPast(date);
          const isToday = isSameDay(date, today);
          const isSel = isSameDay(date, selectedDate);

          return (
            <button
              key={day}
              disabled={past}
              onClick={() => onSelectDate(date)}
              className={`aspect-square flex items-center justify-center rounded-lg text-sm font-lexend font-bold transition-all border-2 
                ${isSel ? "bg-neo-green text-black border-black shadow-neo-sm" 
                : isToday ? "border-black text-black bg-gray-100" 
                : past ? "text-gray-400 border-transparent cursor-not-allowed" 
                : "text-black border-transparent hover:border-black cursor-pointer active:translate-y-[1px]"}`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// 2. TIME SLOT PICKER COMPONENT (Popup)
// ==========================================
const BASE_SLOTS = [
  "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", 
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", 
  "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"
];
const DURATIONS = [1, 2, 3, 4];

function TimeSlotPicker({ bookedSlots, selSlot, setSelSlot, selDur, setSelDur, onClose }) {
  const slots = BASE_SLOTS.map(time => ({
    time,
    occupied: bookedSlots.includes(time)
  }));

  return (
    <div className="bg-neo-surface border-3 border-black rounded-xl p-5 w-80 shadow-neo absolute top-full right-0 mt-2 z-50">
      <div className="flex gap-4 mb-4 justify-center font-lexend font-bold">
        <span className="flex items-center gap-1 text-[10px] text-black"><span className="w-2.5 h-2.5 rounded-full bg-neo-green border border-black" /> Available</span>
        <span className="flex items-center gap-1 text-[10px] text-black"><span className="w-2.5 h-2.5 rounded-full bg-neo-pink border border-black" /> Occupied</span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4 max-h-48 overflow-y-auto no-scrollbar pr-1">
        {slots.map((slot) => {
          const isSel = selSlot === slot.time;
          return (
            <button
              key={slot.time}
              disabled={slot.occupied}
              onClick={() => setSelSlot(slot.time)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 text-left w-full transition-all text-xs font-lexend font-bold
                ${slot.occupied ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed line-through" 
                : isSel ? "bg-neo-green border-black shadow-neo-sm" : "bg-white border-black text-black cursor-pointer hover:bg-gray-100 active:translate-y-[1px]"}`}
            >
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 border border-black ${slot.occupied ? "bg-gray-300" : isSel ? "bg-white" : "bg-neo-green"}`} />
              <span>{slot.time}</span>
            </button>
          );
        })}
      </div>

      {selSlot && (
        <div className="border-t-3 border-black pt-4 mt-2">
          <p className="text-[10px] text-black font-lexend font-extrabold mb-2 uppercase tracking-wide">Duration</p>
          <div className="flex gap-2">
            {DURATIONS.map((d) => (
              <button
                key={d}
                onClick={() => { setSelDur(d); onClose(); }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-lexend font-bold border-2 transition-all active:translate-y-[1px]
                  ${selDur === d ? "bg-neo-green text-black border-black shadow-neo-sm" : "bg-white text-black border-black hover:bg-gray-100"}`}
              >
                {d}hr
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. MAIN DETAILS PAGE
// ==========================================
export default function DetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking State
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [bookedSlots, setBookedSlots] = useState([]);
  
  // Popup Management
  const [activePopup, setActivePopup] = useState(null); // 'date' | 'time' | null
  const dropdownRef = useRef(null);

  // Fetch Space Details
  useEffect(() => {
    const fetchDetails = async () => {
      const { data, error } = await supabase
        .from('terraces')
        .select(`*, terrace_rates ( rate, duration_type ), terrace_permissions ( * ), terrace_images ( image_url )`)
        .eq('id', id)
        .single();
      if (!error) setSpace(data);
      setLoading(false);
    };
    fetchDetails();
  }, [id]);

  // Fetch Booked Slots when Date Changes
  useEffect(() => {
    if (!selectedDate) return;
    
    const fetchBookings = async () => {
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from('bookings')
        .select('start_time') // Only need start time for UI disabling
        .eq('terrace_id', id)
        .gte('start_time', startOfDay.toISOString())
        .lte('start_time', endOfDay.toISOString());

      if (!error && data) {
        const formattedOccupiedSlots = data.map(booking => {
          const dateObj = new Date(booking.start_time);
          return dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }); 
        });
        setBookedSlots(formattedOccupiedSlots);
      }
    };
    fetchBookings();
  }, [selectedDate, id]);

  // Close dropdowns if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActivePopup(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleReserve = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select a date and time first!");
      return;
    }
    // Proceed to checkout/Razorpay
    alert(`Processing Reservation for ${selectedDate.toDateString()} at ${selectedTime} for ${selectedDuration} hours.`);
  };

  if (loading) return (
    <div className="min-h-screen bg-neo-bg text-black flex items-center justify-center font-jakarta font-bold text-xl">
       <svg className="w-8 h-8 text-neo-green animate-spin mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
      Loading details...
    </div>
  );
  
  if (!space) return <div className="min-h-screen bg-neo-bg text-black flex items-center justify-center font-jakarta font-bold text-xl">Space not found.</div>;

  const rate = space.terrace_rates?.[0]?.rate || 0;
  const permissions = space.terrace_permissions?.[0] || {};
  const images = space.terrace_images || [];
  const totalPrice = rate * selectedDuration;

  return (
    <div className="min-h-screen bg-neo-bg flex font-inter text-black pb-24">
      
      {/* Assuming Sidebar is outside your routing or handled by a layout wrapper. */}
      {/* <Sidebar /> */}

      <main className="flex-1 ml-0 lg:ml-64 p-8 lg:p-12 max-w-7xl mx-auto">
        
        {/* Navigation Back */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 font-lexend font-bold text-sm border-2 border-black bg-neo-surface px-4 py-2 rounded-lg shadow-neo-sm active:translate-y-1 active:shadow-none transition-all w-max"
        >
          <ChevronLeft size={16} strokeWidth={3} /> Back to explore
        </button>

        <div className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-[40px] font-jakarta font-extrabold leading-tight mb-2 tracking-tight">{space.title}</h1>
            <div className="flex items-center gap-4 text-sm font-inter font-semibold text-gray-700">
              <span className="flex items-center gap-1 font-bold text-black bg-neo-surface border-2 border-black px-2 py-0.5 rounded shadow-neo-sm"><Star size={14} className="text-yellow-400 fill-yellow-400" /> 4.9</span>
              <span className="underline cursor-pointer hover:text-black">11 Reviews</span>
              <span className="flex items-center gap-1"><MapPin size={16} strokeWidth={2.5}/> {space.address_line}, {space.city}</span>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-4 grid-rows-2 gap-3 h-[400px] mb-12 rounded-2xl overflow-hidden border-3 border-black shadow-neo bg-neo-surface p-2">
          <div className="col-span-2 row-span-2 bg-gray-100 rounded-xl overflow-hidden border-2 border-black">
             {images[0] ? <img src={images[0].image_url} alt="Cover" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl">⛰️</div>}
          </div>
          <div className="col-span-1 row-span-1 bg-gray-100 rounded-xl overflow-hidden border-2 border-black">{images[1] ? <img src={images[1].image_url} alt="Gallery 1" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">⛰️</div>}</div>
          <div className="col-span-1 row-span-1 bg-gray-100 rounded-xl overflow-hidden border-2 border-black">{images[2] ? <img src={images[2].image_url} alt="Gallery 2" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">⛰️</div>}</div>
          <div className="col-span-2 row-span-1 bg-gray-100 rounded-xl overflow-hidden border-2 border-black">{images[3] ? <img src={images[3].image_url} alt="Gallery 3" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-3xl">⛰️</div>}</div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          <div className="flex-1">
            <h2 className="text-2xl font-jakarta font-extrabold mb-2">Entire Space hosted by Gusto</h2>
            <p className="font-inter font-semibold text-gray-700 mb-6 flex items-center gap-2"><Users size={18} strokeWidth={2.5} /> Up to {space.max_capacity} guests</p>
            <div className="w-full h-[3px] bg-black mb-8" />
            
            <h3 className="text-xl font-jakarta font-extrabold mb-4">About this space</h3>
            <p className="font-inter font-medium text-gray-800 leading-relaxed mb-8 text-base">{space.description}</p>
            
            <div className="w-full h-[3px] bg-black mb-8" />
            
            <h3 className="text-xl font-jakarta font-extrabold mb-4">House Rules</h3>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className={`flex items-center gap-2 p-3.5 rounded-xl border-3 border-black shadow-neo-sm font-lexend font-bold text-sm ${permissions.allow_alcohol ? 'bg-neo-green text-black' : 'bg-neo-pink text-black'}`}>
                {permissions.allow_alcohol ? <CheckCircle2 size={20} strokeWidth={2.5} /> : <XCircle size={20} strokeWidth={2.5} />} <span>Alcohol</span>
              </div>
              <div className={`flex items-center gap-2 p-3.5 rounded-xl border-3 border-black shadow-neo-sm font-lexend font-bold text-sm ${permissions.allow_smoking ? 'bg-neo-green text-black' : 'bg-neo-pink text-black'}`}>
                {permissions.allow_smoking ? <CheckCircle2 size={20} strokeWidth={2.5} /> : <XCircle size={20} strokeWidth={2.5} />} <span>Smoking</span>
              </div>
              <div className={`flex items-center gap-2 p-3.5 rounded-xl border-3 border-black shadow-neo-sm font-lexend font-bold text-sm ${permissions.allow_loud_music ? 'bg-neo-green text-black' : 'bg-neo-pink text-black'}`}>
                {permissions.allow_loud_music ? <CheckCircle2 size={20} strokeWidth={2.5} /> : <XCircle size={20} strokeWidth={2.5} />} <span>Loud Music</span>
              </div>
              <div className={`flex items-center gap-2 p-3.5 rounded-xl border-3 border-black shadow-neo-sm font-lexend font-bold text-sm ${permissions.allow_outside_food ? 'bg-neo-green text-black' : 'bg-neo-pink text-black'}`}>
                {permissions.allow_outside_food ? <CheckCircle2 size={20} strokeWidth={2.5} /> : <XCircle size={20} strokeWidth={2.5} />} <span>Outside Food</span>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking Card */}
          <div className="w-full lg:w-[420px]">
            <div className="sticky top-8 bg-neo-surface border-3 border-black rounded-2xl p-7 shadow-neo-lg">
              <div className="mb-6 flex items-end gap-1">
                <span className="text-3xl font-lexend font-extrabold text-black">₹{rate}</span>
                <span className="font-lexend font-bold text-gray-500 pb-1"> / hr</span>
              </div>

              {/* Popups Container (Fixed overflow issue here!) */}
              <div className="relative mb-4" ref={dropdownRef}>
                
                {/* The Visible Buttons */}
                <div className="flex bg-white border-3 border-black rounded-xl shadow-neo-sm overflow-hidden">
                  <div 
                    onClick={() => setActivePopup(activePopup === 'date' ? null : 'date')}
                    className={`flex-1 p-3 border-r-3 border-black hover:bg-neo-green transition-colors cursor-pointer ${activePopup === 'date' ? 'bg-neo-green' : ''}`}
                  >
                    <span className="block text-[10px] font-lexend font-extrabold uppercase text-gray-600 mb-1">Date</span>
                    <span className={`text-sm font-lexend font-bold ${selectedDate ? 'text-black' : 'text-gray-400'}`}>
                      {selectedDate ? selectedDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Add date'}
                    </span>
                  </div>

                  <div 
                    onClick={() => {
                      if (!selectedDate) alert("Please select a date first!");
                      else setActivePopup(activePopup === 'time' ? null : 'time');
                    }}
                    className={`flex-1 p-3 hover:bg-neo-green transition-colors cursor-pointer ${activePopup === 'time' ? 'bg-neo-green' : ''}`}
                  >
                    <span className="block text-[10px] font-lexend font-extrabold uppercase text-gray-600 mb-1">Time</span>
                    <span className={`text-sm font-lexend font-bold ${selectedTime ? 'text-black' : 'text-gray-400'}`}>
                      {selectedTime ? `${selectedTime} (${selectedDuration}hr)` : 'Select slot'}
                    </span>
                  </div>
                </div>

                {/* The Dropdown Popups */}
                {activePopup === 'date' && (
                  <CalendarPicker 
                    selectedDate={selectedDate} 
                    onSelectDate={(date) => {
                      setSelectedDate(date);
                      setSelectedTime(null);
                      setActivePopup('time');
                    }} 
                  />
                )}
                
                {activePopup === 'time' && (
                  <TimeSlotPicker 
                    bookedSlots={bookedSlots}
                    selSlot={selectedTime} 
                    setSelSlot={setSelectedTime} 
                    selDur={selectedDuration}
                    setSelDur={setSelectedDuration}
                    onClose={() => setActivePopup(null)}
                  />
                )}
              </div>

              {/* Price Calculation display */}
              {selectedTime && (
                <div className="flex justify-between font-lexend font-bold text-sm text-gray-600 mb-4 px-1">
                  <span>₹{rate} × {selectedDuration} hour{selectedDuration > 1 ? 's' : ''}</span>
                  <span className="text-black text-base border-b-2 border-black">₹{totalPrice}</span>
                </div>
              )}

              {/* Primary Action */}
              <button 
                onClick={handleReserve} 
                className="w-full bg-neo-green hover:bg-neo-yellow border-3 border-black shadow-neo text-black font-lexend font-extrabold text-lg rounded-xl py-4 transition-all active:translate-y-1 active:translate-x-1 active:shadow-none mb-4"
              >
                Reserve
              </button>
              
              <p className="text-center text-sm font-inter font-bold text-gray-500 mb-6">
                You won't be charged yet
              </p>

              {/* Secondary Action: Map Location */}
              <a 
                href={space.geo_lat && space.geo_lng ? `https://maps.google.com/?q=${space.geo_lat},${space.geo_lng}` : `https://maps.google.com/?q=${encodeURIComponent(space.address_line + ', ' + space.city)}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-neo-surface border-3 border-black shadow-neo-sm hover:bg-gray-100 text-black font-lexend font-extrabold text-lg rounded-xl py-3.5 transition-all active:translate-y-[1px] active:translate-x-[1px] active:shadow-none group"
              >
                <MapPin size={22} strokeWidth={2.5} className="text-black group-hover:scale-110 transition-transform" />
                View on Map
              </a>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}