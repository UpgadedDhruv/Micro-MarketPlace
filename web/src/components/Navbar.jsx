import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          Micro Marketplace
        </Link>
      </div>
      <nav className="navbar-nav">
        {isAuthenticated && (
          <>
            <NavLink to="/" className="nav-link">
              Products
            </NavLink>
            <NavLink to="/favorites" className="nav-link">
              Favorites
            </NavLink>
          </>
        )}
      </nav>
      <div className="navbar-right">
        {isAuthenticated ? (
          <>
            <span className="navbar-user">{user?.email}</span>
            <button
              type="button"
              className="primary-button subtle"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="nav-link">
              Login
            </NavLink>
            <NavLink to="/register" className="nav-link">
              Register
            </NavLink>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
