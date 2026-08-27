import React from 'react';
import { ExternalLink, CheckCircle2, AlertTriangle, AlertCircle, HelpCircle, Eye } from 'lucide-react';

export default function LeadsTable({ leads, onSelectLead }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md">
            <CheckCircle2 className="w-3.5 h-3.5" /> Verified
          </span>
        );
      case 'mismatch':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-md">
            <AlertTriangle className="w-3.5 h-3.5" /> Mismatch
          </span>
        );
      case 'dead_site':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded-md">
            <AlertCircle className="w-3.5 h-3.5" /> Dead Site
          </span>
        );
      case 'no_contact_found':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-1 bg-gray-500/10 border border-gray-500/20 text-gray-400 rounded-md">
            <AlertCircle className="w-3.5 h-3.5" /> No Contact
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-md">
            <HelpCircle className="w-3.5 h-3.5" /> Unverified
          </span>
        );
    }
  };

  return (
    <div className="bg-cardBg border border-borderBg backdrop-blur-md rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-borderBg bg-white/[0.01]">
              <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Business Name</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Website</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Original Phone (Google)</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Scraped Contact</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borderBg/50">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-white/[0.01] transition-all duration-200">
                <td className="py-4 px-6">
                  <div className="font-semibold text-gray-100">{lead.name}</div>
                  <div className="text-xs text-gray-500 max-w-xs truncate">{lead.address}</div>
                </td>
                <td className="py-4 px-6">
                  {lead.website ? (
                    <a
                      href={lead.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brandPrimary hover:text-brandSecondary flex items-center gap-1 text-sm font-medium transition-colors"
                    >
                      Visit Website <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-gray-600 text-sm">-</span>
                  )}
                </td>
                <td className="py-4 px-6 text-sm text-gray-300 font-mono">
                  {lead.phone || <span className="text-gray-600">-</span>}
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm font-mono text-gray-300">{lead.scraped_phone || <span className="text-gray-600">-</span>}</div>
                  <div className="text-xs text-brandSecondary truncate max-w-[150px]">{lead.scraped_email}</div>
                </td>
                <td className="py-4 px-6">
                  {getStatusBadge(lead.verification_status)}
                </td>
                <td className="py-4 px-6 text-right">
                  <button
                    onClick={() => onSelectLead(lead)}
                    className="p-2 hover:bg-white/[0.04] border border-transparent hover:border-borderBg text-brandPrimary rounded-xl transition-all duration-300 inline-flex items-center gap-1.5 text-xs font-bold"
                  >
                    <Eye className="w-4 h-4" /> View Details
                  </button>
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan="6" className="py-12 text-center text-gray-500 text-sm">
                  No leads found. Enter a search query to import leads.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
