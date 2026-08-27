import React, { useState } from 'react';
import { Search, MapPin, Loader2, Sparkles } from 'lucide-react';

export default function SearchPanel({ onSearch, loading }) {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!keyword.trim() || !location.trim()) return;
    onSearch(keyword.trim(), location.trim());
  };

  return (
    <div className="bg-cardBg border border-borderBg backdrop-blur-md rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brandPrimary/5 rounded-full blur-3xl"></div>
      
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-brandPrimary" />
        <h2 className="text-lg font-bold text-white">Find New Vendors</h2>
      </div>
      <p className="text-gray-400 text-sm mb-6">
        Search by keyword (e.g., restaurants, bakeries) and city location to discover businesses. The system will automatically scrape their websites in the background to verify phone numbers and email details.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search Keyword (e.g. Cafe, Gym, Restaurant)"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-darkBg/50 border border-borderBg rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:border-brandPrimary transition-all duration-300"
            required
          />
        </div>

        <div className="flex-1 relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Location (e.g. Bangalore, Indiranagar)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-darkBg/50 border border-borderBg rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:border-brandPrimary transition-all duration-300"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || !keyword || !location}
          className="md:w-auto px-6 py-3.5 bg-gradient-to-r from-brandPrimary to-brandSecondary hover:from-brandPrimary/90 hover:to-brandSecondary/90 text-white font-semibold rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-brandPrimary/10"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Searching & Scraping...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Discover Leads
            </>
          )}
        </button>
      </form>
    </div>
  );
}
