import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Globe, Phone, Map, FileText, Loader } from 'lucide-react';

export default function DetailsDrawer({ lead, onClose, apiBaseUrl }) {
  const [jobStatus, setJobStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchJobStatus = async () => {
    try {
      const resp = await fetch(`${apiBaseUrl}/vendors/${lead.id}`);
      if (resp.ok) {
        const data = await resp.json();
        setJobStatus(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchJobStatus();
    const interval = setInterval(fetchJobStatus, 4000);
    return () => clearInterval(interval);
  }, [lead.id]);

  const handleReScrape = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${apiBaseUrl}/vendors/${lead.id}/scrape`, {
        method: 'POST'
      });
      if (resp.ok) {
        fetchJobStatus();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'text-emerald-400';
      case 'mismatch': return 'text-amber-400';
      case 'dead_site': return 'text-red-400';
      case 'no_contact_found': return 'text-gray-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[480px] bg-[#0c0d14] border-l border-borderBg shadow-2xl z-50 flex flex-col justify-between transform transition-transform duration-300">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-borderBg">
          <div>
            <h3 className="font-bold text-lg text-white">{lead.name}</h3>
            <span className={`text-xs font-semibold ${getStatusColor(jobStatus?.verification_status || lead.verification_status)}`}>
              {(jobStatus?.verification_status || lead.verification_status).toUpperCase()}
            </span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/[0.04] rounded-xl border border-borderBg text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Website Info */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Scrape Parameters</h4>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-white/[0.01] border border-borderBg/50 rounded-xl">
              <Globe className="w-5 h-5 text-brandPrimary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 font-semibold">Website URL</p>
                {lead.website ? (
                  <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-sm text-brandPrimary hover:underline break-all font-medium">
                    {lead.website}
                  </a>
                ) : (
                  <p className="text-sm text-gray-500 font-medium">No website provided</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white/[0.01] border border-borderBg/50 rounded-xl">
              <Phone className="w-5 h-5 text-brandPrimary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 font-semibold">Original Phone (Google)</p>
                <p className="text-sm text-gray-300 font-mono font-medium">{lead.phone || '-'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Extracted Details */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Scraped Results</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white/[0.01] border border-borderBg/50 rounded-xl">
              <p className="text-xs text-gray-500 font-semibold">Scraped Phone</p>
              <p className="text-sm text-gray-300 font-mono font-medium mt-1">
                {jobStatus?.scraped_phone || lead.scraped_phone || <span className="text-gray-600">-</span>}
              </p>
            </div>
            <div className="p-3 bg-white/[0.01] border border-borderBg/50 rounded-xl">
              <p className="text-xs text-gray-500 font-semibold">Scraped Email</p>
              <p className="text-sm text-brandSecondary font-medium mt-1 truncate">
                {jobStatus?.scraped_email || lead.scraped_email || <span className="text-gray-600">-</span>}
              </p>
            </div>
          </div>
        </div>

        {/* Location & Metadata */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Location Metadata</h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-white/[0.01] border border-borderBg/50 rounded-xl">
              <Map className="w-5 h-5 text-brandPrimary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 font-semibold">Coordinates</p>
                <p className="text-sm text-gray-300 font-mono">Lat: {lead.latitude || '-'}, Lng: {lead.longitude || '-'}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-white/[0.01] border border-borderBg/50 rounded-xl">
              <FileText className="w-5 h-5 text-brandPrimary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 font-semibold">Full Address</p>
                <p className="text-sm text-gray-300 leading-relaxed">{lead.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Celery Log Status */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Job Monitoring</h4>
          <div className="p-4 bg-white/[0.01] border border-borderBg rounded-xl space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Scrape Status:</span>
              <span className={`font-bold font-mono px-2 py-0.5 rounded ${
                jobStatus?.verification_status === 'unverified' ? 'bg-amber-500/10 text-amber-400 animate-pulse' : 'bg-emerald-500/10 text-emerald-400'
              }`}>
                {jobStatus?.verification_status === 'unverified' ? 'Scrape Queued/Running' : 'Scrape Completed'}
              </span>
            </div>
            {jobStatus?.verification_status === 'unverified' && (
              <div className="flex items-center gap-2 text-xs text-amber-400 mt-2">
                <Loader className="w-3.5 h-3.5 animate-spin" />
                <span>Playwright is executing dynamic crawl... checking details shortly.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer / Trigger Scrape */}
      <div className="p-6 border-t border-borderBg bg-white/[0.01]">
        <button
          onClick={handleReScrape}
          disabled={loading || !lead.website}
          className="w-full py-4 bg-gradient-to-r from-brandPrimary to-brandSecondary hover:from-brandPrimary/90 hover:to-brandSecondary/90 text-white font-semibold rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-brandPrimary/10"
        >
          {loading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <RefreshCw className="w-5 h-5" />
          )}
          Re-Scrape Business Website
        </button>
      </div>
    </div>
  );
}
