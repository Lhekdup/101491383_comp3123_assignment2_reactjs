import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

function EmployeeList() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState({
    department: '',
    position: ''
  });
  const [error, setError] = useState('');

  // Fetch all employees on load
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/emp/employees');
      setEmployees(res.data.data);
    } catch (err) {
      setError('Failed to load employees');
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearch({
      ...search,
      [e.target.name]: e.target.value
    });
  };

  // Search by department or position
  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const query = new URLSearchParams(search).toString();
      const res = await api.get(`/emp/employees/search?${query}`);
      setEmployees(res.data.data);
      setError('');
    } catch (err) {
      setError('No matching employees found');
    }
  };

  // Delete employee
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;

    try {
      await api.delete(`/emp/employees/${id}`);
      fetchEmployees();
    } catch (err) {
      setError('Failed to delete employee');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Employee List</h2>

      {/* Search Bar */}
      <form className="row g-2 mb-4" onSubmit={handleSearch}>
        <div className="col">
          <input
            name="department"
            placeholder="Search by Department"
            className="form-control"
            value={search.department}
            onChange={handleSearchChange}
          />
        </div>

        <div className="col">
          <input
            name="position"
            placeholder="Search by Position"
            className="form-control"
            value={search.position}
            onChange={handleSearchChange}
          />
        </div>

        <div className="col">
          <button className="btn btn-primary w-100">Search</button>
        </div>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Employee Table */}
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Email</th>
            <th>Position</th>
            <th>Department</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td>
                {emp.profile_image ? (
                  <img
                    src={`http://localhost:3001${emp.profile_image}`}
                    alt="profile"
                    width="50"
                    height="50"
                  />
                ) : (
                  'N/A'
                )}
              </td>

              <td>{emp.first_name} {emp.last_name}</td>
              <td>{emp.email}</td>
              <td>{emp.position}</td>
              <td>{emp.department}</td>
              <td>{emp.salary}</td>

              <td>
                <button
                  className="btn btn-info btn-sm me-2"
                  onClick={() => navigate(`/employees/view/${emp._id}`)}
                >
                  View
                </button>

                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => navigate(`/employees/update/${emp._id}`)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(emp._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {employees.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center">
                No employees found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeList;
