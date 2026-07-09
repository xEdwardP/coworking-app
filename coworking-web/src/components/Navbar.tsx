import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/explorar', label: 'Explorar' },
  { to: '/mis-reservas', label: 'Mis Reservas' },
  { to: '/favoritos', label: 'Favoritos' },
];

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleSignOut() {
    signOut();
    navigate('/login');
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[var(--color-border-subtle)]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="text-lg font-semibold tracking-tight">Nido</span>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition ${
                    isActive ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button
            aria-label="Notificaciones"
            className="relative p-2 rounded-full hover:bg-neutral-100 transition"
          >
            <Bell size={18} />
          </button>

          <div className="flex items-center gap-2 pl-3 border-l border-[var(--color-border-subtle)]">
            <div className="text-right">
              <p className="text-sm font-medium leading-tight">{user?.name}</p>
              <p className="text-xs text-neutral-500 leading-tight">{user?.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              aria-label="Cerrar sesión"
              className="p-2 rounded-full hover:bg-neutral-100 transition text-neutral-500"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <nav className="md:hidden border-t border-[var(--color-border-subtle)] px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-600'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={handleSignOut}
            className="w-full text-left rounded-lg px-3 py-2 text-sm font-medium text-red-600"
          >
            Cerrar sesión
          </button>
        </nav>
      )}
    </header>
  );
}