import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import SearchPanel from './components/SearchPanel';
import LeadsTable from './components/LeadsTable';
import DetailsDrawer from './components/DetailsDrawer';
import { Database, ShieldCheck, AlertTriangle, AlertCircle, RefreshCw, Server } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [leads, setLeads] = useState([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  
  // Custom API Host config for easy ngrok tunnels!
  const [apiBaseUrl, setApiBaseUrl] = useState(() => {
    return localStorage.getItem('apiBaseUrl') || 'http://localhost:8000';
  });
  const [isEditingApi, setIsEditingApi] = useState(false);
  const [apiInput, setApiInput] = useState(apiBaseUrl);

  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    mismatch: 0,
    dead: 0,
  });

  const fetchLeads = async () => {
    try {
      const resp = await fetch(`${apiBaseUrl}/vendors/?limit=50`);
      if (resp.ok) {
        const data = await resp.json();
        setLeads(data.items || []);
        setTotalLeads(data.total || 0);
        calculateStats(data.items || []);
      }
    } catch (e) {
      console.error("Failed to fetch leads:", e);
    }
  };

  const calculateStats = (items) => {
    const total = items.length;
    const verified = items.filter(i => i.verification_status === 'verified').length;
    const mismatch = items.filter(i => i.verification_status === 'mismatch').length;
    const dead = items.filter(i => i.verification_status === 'dead_site').length;
    setStats({ total, verified, mismatch, dead });
  };

  useEffect(() => {
    fetchLeads();
    const interval = setInterval(fetchLeads, 5000);
    return () => clearInterval(interval);
  }, [apiBaseUrl]);

  const handleSearch = async (keyword, location) => {
    setLoading(true);
    try {
      const resp = await fetch(`${apiBaseUrl}/search/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, location })
      });
      if (resp.ok) {
        await fetchLeads();
        setActiveTab('leads'); // switch to leads tab to view results
      }
    } catch (e) {
      console.error("Search failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const saveApiBaseUrl = () => {
    let url = apiInput.trim().replace(/\/$/, ""); // trim trailing slash
    setApiBaseUrl(url);
    localStorage.setItem('apiBaseUrl', url);
    setIsEditingApi(false);
  };

  return (
    <div className="min-h-screen bg-darkBg text-gray-100 flex">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 space-y-8 min-h-screen">
        {/* Header with API config */}
        <header className="flex justify-between items-center pb-6 border-b border-borderBg">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {activeTab === 'dashboard' && 'Discovery Dashboard'}
              {activeTab === 'search' && 'Find Vendor Leads'}
              {activeTab === 'leads' && 'Saved B2B Leads'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {activeTab === 'dashboard' && 'System overview and performance metrics.'}
              {activeTab === 'search' && 'Discover new leads from Google Maps and auto-scrape details.'}
              {activeTab === 'leads' && 'Review scraped emails, verified phone numbers, and statuses.'}
            </p>
          </div>

          {/* API Host Switcher */}
          <div className="flex items-center gap-3 bg-cardBg border border-borderBg px-4 py-2 rounded-xl text-xs font-semibold">
            <Server className="w-4 h-4 text-brandPrimary" />
            {isEditingApi ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={apiInput}
                  onChange={(e) => setApiInput(e.target.value)}
                  className="bg-darkBg border border-borderBg/50 px-2 py-1 rounded text-white text-[11px] focus:outline-none"
                />
                <button onClick={saveApiBaseUrl} className="text-brandPrimary hover:underline">Save</button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-gray-400">API Host:</span>
                <span className="text-gray-200 font-mono">{apiBaseUrl}</span>
                <button onClick={() => setIsEditingApi(true)} className="text-brandSecondary hover:underline ml-1">Edit</button>
              </div>
            )}
          </div>
        </header>

        {/* Tab 1: Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Metric Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-cardBg border border-borderBg p-6 rounded-2xl flex items-center justify-between shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brandPrimary/5 rounded-full blur-2xl"></div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Total Leads</p>
                  <p className="text-3xl font-extrabold text-white mt-2">{stats.total}</p>
                </div>
                <Database className="w-8 h-8 text-brandPrimary shrink-0" />
              </div>

              <div className="bg-cardBg border border-borderBg p-6 rounded-2xl flex items-center justify-between shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Verified Leads</p>
                  <p className="text-3xl font-extrabold text-emerald-400 mt-2">{stats.verified}</p>
                </div>
                <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
              </div>

              <div className="bg-cardBg border border-borderBg p-6 rounded-2xl flex items-center justify-between shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl"></div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Mismatched Info</p>
                  <p className="text-3xl font-extrabold text-amber-400 mt-2">{stats.mismatch}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-amber-400 shrink-0" />
              </div>

              <div className="bg-cardBg border border-borderBg p-6 rounded-2xl flex items-center justify-between shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl"></div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Dead Sites</p>
                  <p className="text-3xl font-extrabold text-red-400 mt-2">{stats.dead}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-400 shrink-0" />
              </div>
            </div>

            {/* Quick Action Search card */}
            <div className="bg-cardBg border border-borderBg p-8 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
              <div className="absolute top-0 right-0 w-48 h-48 bg-brandSecondary/5 rounded-full blur-3xl"></div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Ready to expand your lead database?</h3>
                <p className="text-gray-400 text-sm max-w-xl">
                  Run a vendor discovery task on any city or industry. The backend handles API fetching, Redis caching, and triggers background scraping automatically.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('search')}
                className="w-full md:w-auto px-6 py-4 bg-gradient-to-r from-brandPrimary to-brandSecondary hover:from-brandPrimary/90 hover:to-brandSecondary/90 text-white font-semibold rounded-2xl text-sm transition-all duration-300 shadow-lg shadow-brandPrimary/20 flex items-center justify-center gap-2"
              >
                Start Vendor Search
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Find Leads */}
        {activeTab === 'search' && (
          <div className="space-y-6 animate-fadeIn">
            <SearchPanel onSearch={handleSearch} loading={loading} />
          </div>
        )}

        {/* Tab 3: Saved Leads Table */}
        {activeTab === 'leads' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-400 font-semibold">{totalLeads} Total records found</p>
              <button
                onClick={fetchLeads}
                className="p-2 border border-borderBg bg-white/[0.01] hover:bg-white/[0.04] text-gray-400 hover:text-white rounded-xl transition-all duration-300"
                title="Refresh Table"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
            <LeadsTable leads={leads} onSelectLead={setSelectedLead} />
          </div>
        )}
      </main>

      {/* Details Slide-out Drawer */}
      {selectedLead && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setSelectedLead(null)}
          ></div>
          <DetailsDrawer
            lead={selectedLead}
            onClose={() => setSelectedLead(null)}
            apiBaseUrl={apiBaseUrl}
          />
        </>
      )}
    </div>
  );
}
