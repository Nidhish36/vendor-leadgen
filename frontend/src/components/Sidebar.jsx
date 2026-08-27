import React from 'react';
import { LayoutDashboard, Search, Database } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'search', name: 'Find Leads', icon: Search },
    { id: 'leads', name: 'Saved Leads', icon: Database },
  ];

  return (
    <aside className="w-64 bg-[#0c0d14] border-r border-borderBg flex flex-col justify-between h-screen fixed left-0 top-0 z-30">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-gradient-to-tr from-brandPrimary to-brandSecondary p-2 rounded-xl text-white shadow-md shadow-brandPrimary/20">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              LeadGen Portal
            </h1>
            <span className="text-xs text-gray-500 font-medium">B2B Vendor Discovery</span>
          </div>
        </div>

        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-brandPrimary/15 to-brandSecondary/10 text-brandPrimary border-l-4 border-brandPrimary'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.02]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-brandPrimary' : 'text-gray-400'}`} />
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-6 border-t border-borderBg">
        <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-borderBg rounded-xl">
          <div className="w-8 h-8 rounded-full bg-brandPrimary/10 flex items-center justify-center text-brandPrimary font-bold text-sm">
            VL
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-300">Local Environment</p>
            <p className="text-[10px] text-gray-500">v1.0.0 - Stable</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
