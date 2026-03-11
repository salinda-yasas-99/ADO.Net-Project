import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

/**
 * Layout component
 * Wraps all pages with consistent navigation and structure
 */
function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
