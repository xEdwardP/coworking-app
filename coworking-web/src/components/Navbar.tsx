import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Bell, Building2, CalendarDays, Check, Heart, Search, User, X, Clock, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/explorar', label: 'Explorar', icon: Search, count: undefined },
  { to: '/mis-reservas', label: 'Mis reservas', icon: CalendarDays, count: 5 },
  { to: '/favoritos', label: 'Favoritos', icon: Heart, count: 3 },
];

const notifications = [
  {
    icon: Check,
    tone: 'bg-[#19482f] text-[#6bd69b]',
    text: 'Sala Ada Lovelace confirmó tu reserva del 10 de agosto.',
    date: 'Hace 2 horas',
  },
  {
    icon: Clock,
    tone: 'bg-[#473717] text-[#e4b044]',
    text: 'Tu reserva en Auditorio Margaret Hamilton empieza en 1 hora.',
    date: 'Hace 5 horas',
  },
  {
    icon: X,
    tone: 'bg-[#51281a] text-[#e46f4d]',
    text: 'Se canceló tu reserva en Sala Alan Turing del 3 de agosto.',
    date: 'Ayer',
  },
  {
    icon: Star,
    tone: 'bg-[#19482f] text-[#6bd69b]',
    text: '¿Qué te pareció Escritorio Grace Hopper? Deja tu reseña.',
    date: 'Hace 2 días',
  },
];

export function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 flex w-[240px] flex-col border-r border-[#2a2f34] bg-[#1b1f23] px-3 py-5">
        <button
          type="button"
          onClick={() => navigate('/explorar')}
          className="mb-9 flex items-center gap-3 px-1 text-left"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#52a37c] text-white">
            <Building2 size={16} />
          </span>
          <span className="text-xl font-extrabold tracking-tight text-white">Nido</span>
        </button>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-bold transition ${
                    isActive
                      ? 'bg-[#163c29] text-[#62c891]'
                      : 'text-[#aab0ab] hover:bg-[#20262a] hover:text-white'
                  }`
                }
              >
                <Icon size={18} strokeWidth={2} />
                <span className="flex-1">{item.label}</span>
                {item.count !== undefined && (
                  <span className="rounded-full border border-[#2d343a] bg-[#171b1f] px-2 py-0.5 text-[11px] font-bold text-[#a6d7bf]">
                    {item.count}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto rounded-lg border border-[#2c3137] bg-[#171b1f] p-3">
          <div className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#62c891] text-xs font-extrabold text-white">
              {user?.name?.slice(0, 2).toUpperCase() ?? 'ES'}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold leading-tight text-white">{user?.name ?? 'Estudiante Uno'}</p>
              <p className="truncate text-xs text-[#9db1a7]">{user?.email ?? 'user1@test.com'}</p>
            </div>
          </div>
        </div>
      </aside>

      <header className="fixed left-[240px] right-0 top-0 z-30 h-[72px] border-b border-[#2a2f34] bg-[#111418]">
        <div className="flex h-full items-center justify-between gap-4 px-4 md:px-6">
          <div className="relative w-full max-w-[420px]">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca5a0]" />
            <input
              placeholder="Buscar espacios por nombre o ubicación..."
              className="h-10 w-full rounded-lg border border-[#30363d] bg-[#171b1f] pl-11 pr-4 text-sm text-[#dfe6df] outline-none placeholder:text-[#b3beb5] focus:border-[#52a37c]"
            />
          </div>

          <div ref={panelRef} className="relative flex items-center gap-2">
            <button
              type="button"
              aria-label="Notificaciones"
              onClick={() => setNotificationsOpen((value) => !value)}
              className="relative grid h-10 w-10 place-items-center rounded-lg border border-[#30363d] bg-[#171b1f] text-[#aab0ab] transition hover:text-white"
            >
              <Bell size={18} />
              <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-[#e16044] text-[10px] font-extrabold text-white">
                3
              </span>
            </button>
            <button
              type="button"
              aria-label="Perfil"
              className="grid h-10 w-10 place-items-center rounded-lg border border-[#30363d] bg-[#171b1f] text-[#aab0ab] transition hover:text-white"
            >
              <User size={18} />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 top-12 w-[340px] rounded-xl border border-[#2f353b] bg-[#1a1e22] p-4 shadow-2xl">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="font-extrabold text-white">Notificaciones</h2>
                  <button type="button" className="text-xs font-bold text-[#56b084]">
                    Marcar leídas
                  </button>
                </div>
                <div className="space-y-5">
                  {notifications.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.text} className="flex gap-3">
                        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${item.tone}`}>
                          <Icon size={16} />
                        </span>
                        <div>
                          <p className="text-sm font-extrabold leading-snug text-[#f1f3ef]">{item.text}</p>
                          <p className="mt-1 text-xs font-bold text-[#9ba29c]">{item.date}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
