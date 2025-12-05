
import { useNavigate } from "react-router-dom";
import LOGO from "../../../assets/images/LOGO-fixrd.png";
import "./TechnicianNavbar.css";

export default function TechnicianNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Limpiar sesión/token de autenticación
    // localStorage.removeItem('token');
    // clearAuthContext();
    
    if (window.confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      navigate("/login");
    }
  };

  return (
    <nav className="technician-navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <img src={LOGO} width={130} height={130} alt="FixRD Logo" />
          <h1>Dashboard del Técnico</h1>
        </div>
        <div className="navbar-right">
          <button className="logout-btn" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
}

