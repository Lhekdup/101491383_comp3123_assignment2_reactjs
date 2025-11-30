import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

function AddEmployee() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    position: '',
    department: '',
    salary: ''
  });

  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      Object.keys(form).forEach((key) => {
        data.append(key, form[key]);
      });

      if (image) {
        data.append('profile_image', image);
      }

      await api.post('/emp/employees', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('Employee added successfully!');
      setError('');

      setTimeout(() => {
        navigate('/employees');
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to add employee'
      );
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 600 }}>
      <h2 className="mb-3">Add New Employee</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="row mb-3">
          <div className="col">
            <label>First Name</label>
            <input
              className="form-control"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col">
            <label>Last Name</label>
            <input
              className="form-control"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input
            className="form-control"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="row mb-3">
          <div className="col">
            <label>Position</label>
            <input
              className="form-control"
              name="position"
              value={form.position}
              onChange={handleChange}
            />
          </div>

          <div className="col">
            <label>Department</label>
            <input
              className="form-control"
              name="department"
              value={form.department}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-3">
          <label>Salary</label>
          <input
            className="form-control"
            type="number"
            name="salary"
            value={form.salary}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Profile Image</label>
          <input
            className="form-control"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <button className="btn btn-success w-100">
          Add Employee
        </button>
      </form>
    </div>
  );
}

export default AddEmployee;
