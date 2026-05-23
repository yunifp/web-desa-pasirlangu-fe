import React from 'react';
import { Link2 } from 'lucide-react';

export interface Leader { name: string; role: string; image: string; url?: string; }
export interface MasterLeadershipTeamProps {
  badge?: string; title?: string; period?: string;
  commissaries?: Leader[]; directors?: Leader[];
}

export const MasterLeadershipTeam: React.FC<MasterLeadershipTeamProps> = ({
  badge, title, period, commissaries = []}) => {
  return (
    <section className="py-24 bg-white font-sans select-none overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-2 border-slate-100 pb-8">
          <div className="space-y-6">
            <span className="text-[11px] font-black text-cyan-600 block uppercase tracking-widest relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-1 after:bg-blue-900 after:rounded-full">
              {badge}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-slate-700 tracking-tight mt-6">
              {title}
            </h2>
          </div>
          <span className="text-xs font-bold text-blue-900 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
            {period}
          </span>
        </div>

        <div className="space-y-8">
          {/* <h3 className="text-sm font-black text-blue-950 uppercase tracking-widest border-l-4 border-cyan-500 pl-4 bg-slate-50 py-2 w-max pr-6 rounded-r-xl">
            Kepala Desa
          </h3> */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {commissaries.map((person, idx) => (
              <div key={idx} className="space-y-5 group">
                <div className="aspect-[4/5] w-full rounded-[2rem] rounded-tr-none overflow-hidden bg-slate-100 relative border-4 border-blue-50 shadow-sm group-hover:border-cyan-100 group-hover:shadow-xl transition-all duration-500">
                  <img src={person.image} alt={person.name} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-multiply" />
                  {person.url && (
                    <a href={person.url} target="_blank" rel="noreferrer" className="absolute bottom-4 right-4 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md text-white hover:bg-cyan-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md transform translate-y-2 group-hover:translate-y-0 duration-300">
                      <Link2 size={16} />
                    </a>
                  )}
                </div>
                <div className="space-y-1 px-2">
                  <h4 className="text-base font-black text-slate-800 group-hover:text-blue-950 transition-colors tracking-tight">{person.name}</h4>
                  <p className="text-xs font-bold text-cyan-600">{person.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* <div className="space-y-8 pt-10 border-t-2 border-slate-100">
          <h3 className="text-sm font-black text-blue-950 uppercase tracking-widest border-l-4 border-cyan-500 pl-4 bg-slate-50 py-2 w-max pr-6 rounded-r-xl">
            Jajaran Direksi
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {directors.map((person, idx) => (
              <div key={idx} className="space-y-5 group">
                <div className="aspect-[4/5] w-full rounded-[2rem] rounded-tr-none overflow-hidden bg-slate-100 relative border-4 border-blue-50 shadow-sm group-hover:border-cyan-100 group-hover:shadow-xl transition-all duration-500">
                  <img src={person.image} alt={person.name} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-multiply" />
                  {person.url && (
                    <a href={person.url} target="_blank" rel="noreferrer" className="absolute bottom-4 right-4 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md text-white hover:bg-cyan-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md transform translate-y-2 group-hover:translate-y-0 duration-300">
                      <Link2 size={16} />
                    </a>
                  )}
                </div>
                <div className="space-y-1 px-2">
                  <h4 className="text-base font-black text-slate-800 group-hover:text-blue-950 transition-colors tracking-tight">{person.name}</h4>
                  <p className="text-xs font-bold text-cyan-600">{person.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div> */}

      </div>
    </section>
  );
};