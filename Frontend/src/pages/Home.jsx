import { Link } from 'react-router-dom';

/**
 * Home page
 * Landing page with navigation cards to main features
 */
function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          HR Management System
        </h1>
        <p className="text-lg text-gray-600">
          Manage your organization's departments and employees efficiently
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Departments Card */}
        <Link
          to="/departments"
          className="group block p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100"
        >
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Departments
          </h2>
          <p className="text-gray-600">
            Create, edit, and manage company departments. Organize your workforce into logical units.
          </p>
          <div className="mt-4 flex items-center text-blue-600 font-medium">
            Manage Departments
            <svg
              className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </Link>

        {/* Employees Card */}
        <Link
          to="/employees"
          className="group block p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100"
        >
          <div className="flex items-center mb-4">
            <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Employees
          </h2>
          <p className="text-gray-600">
            Add, modify, and manage employee records. Track personal information, salaries, and department assignments.
          </p>
          <div className="mt-4 flex items-center text-green-600 font-medium">
            Manage Employees
            <svg
              className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </Link>
      </div>

      {/* Quick Stats Section */}
      <div className="mt-12 p-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white">
        <h3 className="text-lg font-medium mb-2">Getting Started</h3>
        <p className="text-blue-100">
          Start by creating departments for your organization, then add employees and assign them to their respective departments.
        </p>
      </div>
    </div>
  );
}

export default Home;
