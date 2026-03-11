import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/common';
import { Home, DepartmentList, UserList } from './pages';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="departments" element={<DepartmentList />} />
        <Route path="users" element={<UserList />} />
      </Route>
    </Routes>
  );
}

export default App;
