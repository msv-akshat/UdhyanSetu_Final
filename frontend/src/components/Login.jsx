import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import bg from "../assets/loginbg.png"
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';


function Login(props) {
  useEffect(() => {
    document.title = "UdhyanSetu - " + props.title;

  }, [props.title]);

  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert('Please enter both username and password.');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/login`, {
        username,
        password,
      });

      if (response.status === 200) {
        const userRole = response.data.user.role;
        const userName = response.data.user.username;
        login(userRole, userName);
        navigate('/download');
        console.log(response.data);
      }
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('Login failed:', error);
      if (error.response && error.response.status === 401) {
        alert('Invalid username or password.');
      } else {
        alert('An error occurred during login. Please try again later.');
      }
    }
  };

  return (
    <div className="position-relative d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 0 }}
      ></div>
      <div
        className="container rounded shadow position-relative"
        style={{
          padding: '4rem',
          width: '100%',
          maxWidth: '600px',
          backgroundColor: 'rgba(97, 220, 115, 0.15)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )',
          zIndex: 1,
          color: 'white',
        }}
      >

        <h2 className="mb-5 mt-1 text-center fw-bold text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
          User Login
        </h2>


        <form className="form-horizontal" onSubmit={handleSubmit}>
          <div className="mb-4 row">
            <label htmlFor="username" className="col-sm-3 col-form-label">Username</label>
            <div className="col-sm-9">
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Enter your Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="off"
              />
            </div>
          </div>

          <div className="mb-3 row">
            <label htmlFor="password" className="col-sm-3 col-form-label">Password</label>
            <div className="col-sm-9">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="off"
              />
            </div>
          </div>

          <div className="mb-3 row">
            <div className="col-sm-9 offset-sm-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="gridCheck1"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="gridCheck1">
                  Show Password
                </label>
              </div>
            </div>
          </div>

          <div className="mt-4 mb-0 d-flex justify-content-center">
            <button
              type="submit"
              className="btn px-5"
              style={{
                backgroundColor: hover ? "#f05328" : "#f6653c",
                boxShadow: hover ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
                color: hover ? 'black' : 'white',
                border: 'none',
                transition: '0.3s ease'
              }}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;