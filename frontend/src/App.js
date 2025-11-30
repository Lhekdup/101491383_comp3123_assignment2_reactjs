import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import EmployeeList from './pages/EmployeeList';
import AddEmployee from './pages/AddEmployee';
import ViewEmployee from './pages/ViewEmployee';
import UpdateEmployee from './pages/UpdateEmployee';
import Navbar from './components/Navbar';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      {token && <Navbar />}

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/employees" element={<EmployeeList />} />
        <Route path="/employees/add" element={<AddEmployee />} />
        <Route path="/employees/view/:id" element={<ViewEmployee />} />
        <Route path="/employees/update/:id" element={<UpdateEmployee />} />
      </Routes>
    </Router>
  );
}

export default App;
