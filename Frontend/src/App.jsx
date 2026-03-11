import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/common';
import { Home, DepartmentList, EmployeeList } from './pages';

/**
 * App Component
 * Main application with routing configuration
 */
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="departments" element={<DepartmentList />} />
        <Route path="employees" element={<EmployeeList />} />
      </Route>
    </Routes>
  );
}

export default App;
