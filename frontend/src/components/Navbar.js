import { Link } from 'react-router-dom';

function Navbar({ setIsAuthenticated }) {
  const logout = () => {
  localStorage.removeItem('token');
  setIsAuthenticated(false);
  window.location.href = '/login';
};

  return (
    <nav style={{ padding: 10, background: '#222' }}>
      <Link to="/employees" style={{ color: 'white', marginRight: 15 }}>Employees</Link>
      <Link to="/employees/add" style={{ color: 'white', marginRight: 15 }}>Add</Link>
      <button onClick={logout}>Logout</button>
    </nav>
  );
}

export default Navbar;
