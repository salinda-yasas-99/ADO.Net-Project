import { NavLink } from 'react-router-dom';

/**
 * Navigation component
 * Provides site-wide navigation with active link highlighting
 */
function Navigation() {
  const linkClasses = ({ isActive }) =>
    `px-4 py-2 rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="text-xl font-bold text-blue-600">
              HR Management
            </NavLink>
          </div>
          <div className="flex items-center space-x-4">
            <NavLink to="/departments" className={linkClasses}>
              Departments
            </NavLink>
            <NavLink to="/employees" className={linkClasses}>
              Employees
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
