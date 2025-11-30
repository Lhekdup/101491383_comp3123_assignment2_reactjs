import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Login from './pages/Login';
import Signup from './pages/Signup';
import EmployeeList from './pages/EmployeeList';
import AddEmployee from './pages/AddEmployee';
import ViewEmployee from './pages/ViewEmployee';
import UpdateEmployee from './pages/UpdateEmployee';
import Navbar from './components/Navbar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check token on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Router>
      {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />}

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/employees"
          element={isAuthenticated ? <EmployeeList /> : <Navigate to="/login" />}
        />
        <Route
          path="/employees/add"
          element={isAuthenticated ? <AddEmployee /> : <Navigate to="/login" />}
        />
        <Route
          path="/employees/view/:id"
          element={isAuthenticated ? <ViewEmployee /> : <Navigate to="/login" />}
        />
        <Route
          path="/employees/update/:id"
          element={isAuthenticated ? <UpdateEmployee /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
