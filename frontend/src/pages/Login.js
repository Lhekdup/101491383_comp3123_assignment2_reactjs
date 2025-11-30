import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post('/user/login', form);

      // this saves token in localStorage
      localStorage.setItem('token', res.data.token);

      // this redirect to employee list
      navigate('/employees');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Try again.'
      );
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h2 className="text-center mb-4">Login</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Email</label>
          <input
            className="form-control"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            className="form-control"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <button className="btn btn-primary w-100">Login</button>
      </form>

      <div className="text-center mt-3">
        Don’t have an account? <Link to="/signup">Signup</Link>
      </div>
    </div>
  );
}

export default Login;
