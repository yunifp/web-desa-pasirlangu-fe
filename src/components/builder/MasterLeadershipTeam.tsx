import React from 'react';
import { Link2 } from 'lucide-react';

export interface Leader { name: string; role: string; image: string; url?: string; }
export interface MasterLeadershipTeamProps {
  badge?: string; title?: string; period?: string;
  commissaries?: Leader[]; directors?: Leader[];
}

export const MasterLeadershipTeam: React.FC<MasterLeadershipTeamProps> = ({
  badge, title, period, commissaries = [], directors = []
}) => {
  return (
    <section className="py-24 bg-white border-b border-slate-100 font-sans select-none overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{badge}</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-150">{period}</span>
        </div>
        <div className="space-y-8">
          <h3 className="text-xs font-black text-[#0B4028] uppercase tracking-widest border-l-2 border-[#C5A059] pl-3">Dewan Komisaris</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {commissaries.map((person, idx) => (
              <div key={idx} className="space-y-4 group">
                <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden bg-slate-100 relative border border-slate-200/60 shadow-xs">
                  <img src={person.image} alt={person.name} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {person.url && (
                    <a href={person.url} target="_blank" rel="noreferrer" className="absolute bottom-3 right-3 w-8 h-8 rounded-lg bg-[#0B4028] text-[#C5A059] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md">
                      <Link2 size={14} />
                    </a>
                  )}
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-sm font-black text-slate-900 group-hover:text-[#0B4028] transition-colors tracking-tight">{person.name}</h4>
                  <p className="text-xs font-bold text-[#C5A059]">{person.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-8 pt-6 border-t border-slate-100">
          <h3 className="text-xs font-black text-[#0B4028] uppercase tracking-widest border-l-2 border-[#C5A059] pl-3">Jajaran Direksi</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {directors.map((person, idx) => (
              <div key={idx} className="space-y-4 group">
                <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden bg-slate-100 relative border border-slate-200/60 shadow-xs">
                  <img src={person.image} alt={person.name} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {person.url && (
                    <a href={person.url} target="_blank" rel="noreferrer" className="absolute bottom-3 right-3 w-8 h-8 rounded-lg bg-[#0B4028] text-[#C5A059] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md">
                      <Link2 size={14} />
                    </a>
                  )}
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-sm font-black text-slate-900 group-hover:text-[#0B4028] transition-colors tracking-tight">{person.name}</h4>
                  <p className="text-xs font-bold text-[#C5A059]">{person.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};