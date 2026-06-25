import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { supabase } from './supabaseClient';
import { MapPin, Users, Calendar, Clock, Star, CheckCircle2, XCircle } from 'lucide-react';

export default function DetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      const { data, error } = await supabase
        .from('terraces')
        .select(`
          *,
          terrace_rates ( rate, duration_type ),
          terrace_permissions ( * ),
          terrace_images ( image_url )
        `)
        .eq('id', id)
        .single();

      if (!error) setSpace(data);
      setLoading(false);
    };
    fetchDetails();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#0e1a12] text-white pl-64 pt-20 text-center">Loading details...</div>;
  if (!space) return <div className="min-h-screen bg-[#0e1a12] text-white pl-64 pt-20 text-center">Space not found.</div>;

  const rate = space.terrace_rates?.[0]?.rate || 0;
  const permissions = space.terrace_permissions?.[0] || {};
  const images = space.terrace_images || [];

  return (
    <div className="min-h-screen bg-[#0e1a12] flex font-sans">
      <Sidebar />

      <main className="flex-1 ml-64 p-8 lg:p-12 text-white max-w-7xl mx-auto">
        
        {/* Title Section */}
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-semibold mb-2">{space.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <span className="flex items-center gap-1 font-medium"><Star size={16} className="text-yellow-500 fill-yellow-500" /> 4.9</span>
              <span className="underline cursor-pointer">11 Reviews</span>
              <span className="flex items-center gap-1"><MapPin size={16}/> {space.address_line}, {space.city}</span>
            </div>
          </div>
        </div>

        {/* Image Gallery (Airbnb Style) */}
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[400px] mb-12 rounded-2xl overflow-hidden">
          <div className="col-span-2 row-span-2 bg-[#1e3a28]">
             {images[0] ? <img src={images[0].image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl">⛰️</div>}
          </div>
          <div className="col-span-1 row-span-1 bg-[#2a3f32]">
             {images[1] && <img src={images[1].image_url} className="w-full h-full object-cover" />}
          </div>
          <div className="col-span-1 row-span-1 bg-[#1e3a28]">
             {images[2] && <img src={images[2].image_url} className="w-full h-full object-cover" />}
          </div>
          <div className="col-span-2 row-span-1 bg-[#2a3f32]">
             {images[3] && <img src={images[3].image_url} className="w-full h-full object-cover" />}
          </div>
        </div>

        {/* Content Split Layout */}
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column: Info & Rules */}
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-2">Entire Space hosted by Gusto</h2>
            <p className="text-gray-400 mb-6 flex items-center gap-2">
              <Users size={18} /> Up to {space.max_capacity} guests
            </p>

            <div className="w-full h-px bg-[#1e3a28] mb-8" />

            {/* Description */}
            <h3 className="text-xl font-medium mb-4">About this space</h3>
            <p className="text-gray-300 leading-relaxed mb-8">{space.description || "A beautiful open terrace perfect for your next gathering."}</p>

            <div className="w-full h-px bg-[#1e3a28] mb-8" />

            {/* House Rules from terrace_permissions */}
            <h3 className="text-xl font-medium mb-4">House Rules</h3>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className={`flex items-center gap-2 p-3 rounded-xl border ${permissions.allow_alcohol ? 'border-green-900/50 text-green-400' : 'border-red-900/30 text-red-400'}`}>
                {permissions.allow_alcohol ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                <span className="text-sm">Alcohol</span>
              </div>
              <div className={`flex items-center gap-2 p-3 rounded-xl border ${permissions.allow_smoking ? 'border-green-900/50 text-green-400' : 'border-red-900/30 text-red-400'}`}>
                {permissions.allow_smoking ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                <span className="text-sm">Smoking</span>
              </div>
              <div className={`flex items-center gap-2 p-3 rounded-xl border ${permissions.allow_loud_music ? 'border-green-900/50 text-green-400' : 'border-red-900/30 text-red-400'}`}>
                {permissions.allow_loud_music ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                <span className="text-sm">Loud Music</span>
              </div>
              <div className={`flex items-center gap-2 p-3 rounded-xl border ${permissions.allow_outside_food ? 'border-green-900/50 text-green-400' : 'border-red-900/30 text-red-400'}`}>
                {permissions.allow_outside_food ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                <span className="text-sm">Outside Food</span>
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Booking Card */}
          <div className="w-full lg:w-[400px]">
            <div className="sticky top-8 bg-[#141f17] border border-[#1e3a28] rounded-2xl p-6 shadow-2xl">
              <div className="mb-6">
                <span className="text-2xl font-semibold text-[#4ade80]">₹{rate}</span>
                <span className="text-gray-400"> / hr</span>
              </div>

              {/* Date & Time Selectors */}
              <div className="border border-[#1e3a28] rounded-xl overflow-hidden mb-4">
                <div className="flex border-b border-[#1e3a28]">
                  <div className="flex-1 p-3 border-r border-[#1e3a28] hover:bg-[#1e3a28] transition-colors cursor-pointer">
                    <span className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Date</span>
                    <span className="text-sm text-white">Add date</span>
                  </div>
                  <div className="flex-1 p-3 hover:bg-[#1e3a28] transition-colors cursor-pointer">
                    <span className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Time</span>
                    <span className="text-sm text-white">Select slot</span>
                  </div>
                </div>
              </div>

              <button className="w-full bg-[#4ade80] hover:bg-[#22c55e] text-[#0e1a12] font-semibold text-lg rounded-xl py-4 transition-colors mb-4">
                Reserve
              </button>

              <p className="text-center text-sm text-gray-400">You won't be charged yet</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}