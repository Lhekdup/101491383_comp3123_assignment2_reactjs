import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';

function ViewEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployee();
  }, []);

  const fetchEmployee = async () => {
    try {
      const res = await api.get(`/emp/employees/${id}`);
      setEmployee(res.data.data);
    } catch (err) {
      setError('Failed to load employee');
    }
  };

  if (error) return <div className="container mt-4 alert alert-danger">{error}</div>;
  if (!employee) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container mt-4" style={{ maxWidth: 600 }}>
      <h2 className="mb-3">Employee Details</h2>

      {employee.profile_image && (
        <div className="mb-3 text-center">
          <img
            src={`http://localhost:3001${employee.profile_image}`}
            alt="profile"
            width="120"
            height="120"
            style={{ borderRadius: '50%' }}
          />
        </div>
      )}

      <ul className="list-group mb-4">
        <li className="list-group-item">
          <strong>Name:</strong> {employee.first_name} {employee.last_name}
        </li>
        <li className="list-group-item">
          <strong>Email:</strong> {employee.email}
        </li>
        <li className="list-group-item">
          <strong>Position:</strong> {employee.position || 'N/A'}
        </li>
        <li className="list-group-item">
          <strong>Department:</strong> {employee.department || 'N/A'}
        </li>
        <li className="list-group-item">
          <strong>Salary:</strong> {employee.salary || 'N/A'}
        </li>
      </ul>

      <div className="d-flex justify-content-between">
        <button className="btn btn-secondary" onClick={() => navigate('/employees')}>
          Back
        </button>

        <button
          className="btn btn-warning"
          onClick={() => navigate(`/employees/update/${employee._id}`)}
        >
          Edit
        </button>
      </div>
    </div>
  );
}

export default ViewEmployee;
