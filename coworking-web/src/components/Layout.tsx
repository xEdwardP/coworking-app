import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export function Layout() {
  return (
    <div className="min-h-screen bg-[#101215] text-[#f4f5f2]">
      <Navbar />
      <main className="min-h-screen pl-[240px] pt-[72px]">
        <Outlet />
      </main>
    </div>
  );
}
