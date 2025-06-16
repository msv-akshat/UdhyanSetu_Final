import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

function SubNavbar() {
  const { role } = useContext(AuthContext);

  const subnavStyle = {
    link: {
      transition: 'all 0.2s ease-in-out',
      padding: '8px 12px',
      borderRadius: '8px',
      color: 'white',
      fontWeight: '600',
      textDecoration: 'none'
    },
    hover: {
      backgroundColor: 'rgba(255,255,255,0.2)',
    }
  };


  return (
    <nav className="navbar navbar-expand-sm bg-success px-4 shadow-sm">
      <ul className="navbar-nav me-auto gap-3">
        <li className="nav-item">
          <Link
            to="/download"
            className="nav-link"
            style={subnavStyle.link}
            onMouseOver={(e) => (e.target.style.backgroundColor = subnavStyle.hover.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = 'transparent')}
          >
            📥 Download Data
          </Link>

        </li>
        {role === 'admin' && (
          <li className="nav-item">
            <Link
              to="/analytics"
              className="nav-link"
              style={subnavStyle.link}
              onMouseOver={(e) => (e.target.style.backgroundColor = subnavStyle.hover.backgroundColor)}
              onMouseOut={(e) => (e.target.style.backgroundColor = 'transparent')}
            >
              📊 Analytics
            </Link>

          </li>
        )}
        {role === 'employee' && (
          <li className="nav-item">
            <Link
              to="/uploads"
              className="nav-link"
              style={subnavStyle.link}
              onMouseOver={(e) => (e.target.style.backgroundColor = subnavStyle.hover.backgroundColor)}
              onMouseOut={(e) => (e.target.style.backgroundColor = 'transparent')}
            >
              ⬆️ Uploads
            </Link>

          </li>
        )}
      </ul>
    </nav>
  );
}

export default SubNavbar;
