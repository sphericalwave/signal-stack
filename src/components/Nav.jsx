import { NavLink } from 'react-router-dom';

const links = [
  { to: '/signal-stack/',         label: 'Dashboard' },
  { to: '/signal-stack/onchain',  label: 'On-Chain'  },
  { to: '/signal-stack/macro',    label: 'Macro'     },
  { to: '/signal-stack/news',     label: 'News'      },
  { to: '/signal-stack/altcoins', label: 'Altcoins'  },
  { to: '/signal-stack/alerts',   label: 'Alerts'    },
];

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0b0e]/90 backdrop-blur-sm">
      <div className="max-w-screen-2xl mx-auto px-4 flex items-center h-12 gap-6">
        <span className="font-mono text-sm font-semibold text-green-400 tracking-wider mr-4">
          SIGNAL<span className="text-white">STACK</span>
        </span>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/signal-stack/'}
            className={({ isActive }) =>
              `text-xs font-medium tracking-wide transition-colors ${
                isActive
                  ? 'text-white border-b-2 border-green-400 pb-0.5'
                  : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
        <div className="ml-auto flex items-center gap-3">
          <span className="font-mono text-[10px] text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded">
            LIVE
          </span>
          <span className="font-mono text-[10px] text-slate-500">
            {new Date().toUTCString().slice(0, 25)} UTC
          </span>
        </div>
      </div>
    </nav>
  );
}
