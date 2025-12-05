import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TechnicianNavbar from "../../components/layout/Topbar/TechnicianNavbar";
import LoadingSpinner from "../../components/dashboard/LoadingSpinner";
import { techniciansService, authService } from "../../services/api";
import "./ProfileSettings.css";

export default function ProfileSettings() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    pricePerHour: "",
    categories: "",
    photo: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener ID del técnico autenticado
  const currentUser = authService.getCurrentUser();
  const technicianId = currentUser.id || "ID_DEL_TECNICO";

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const t = await techniciansService.getTechnicianProfile(technicianId);
        
        setForm({
          name: t.name || "",
          description: t.description || "",
          pricePerHour: t.pricePerHour?.toString() || "",
          categories: t.categories?.join(", ") || "",
          photo: t.photo || "",
        });
      } catch (err) {
        console.warn("Usando perfil de ejemplo:", err);
        setError("No se pudo cargar el perfil. Mostrando datos de ejemplo.");
        // Datos de ejemplo
        setForm({
          name: "Carlos Méndez Rivera",
          description: "Electricista certificado con más de 10 años de experiencia en instalaciones residenciales y comerciales.",
          pricePerHour: "500",
          categories: "Electricidad, Instalaciones, Reparaciones",
          photo: "https://i.pravatar.cc/150?img=14",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [technicianId]);

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!form.description.trim()) {
      setError("La descripción es requerida");
      return;
    }
    
    if (!form.pricePerHour || Number(form.pricePerHour) <= 0) {
      setError("El precio por hora debe ser mayor a 0");
      return;
    }
    
    if (!form.categories.trim()) {
      setError("Debes especificar al menos un servicio");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const body = {
        name: form.name,
        description: form.description,
        pricePerHour: Number(form.pricePerHour),
        categories: form.categories.split(",").map(c => c.trim()).filter(c => c),
        photo: form.photo,
      };

      await techniciansService.updateTechnicianProfile(technicianId, body);

      // Éxito - redirigir al dashboard
      alert("✓ Perfil actualizado correctamente");
      navigate("/tecnico");
    } catch (err) {
      console.error("Error al guardar:", err);
      setError("No se pudo actualizar el perfil. Intenta nuevamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/tecnico");
  };

  if (loading) {
    return (
      <div className="profile-container">
        <main className="profile-main">
          <TechnicianNavbar />
          <LoadingSpinner message="Cargando perfil..." />
        </main>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <main className="profile-main">
        <TechnicianNavbar />

        <section className="profile-content">
          <div className="profile-header">
            <div>
              <h2>Configuración del Perfil</h2>
              <p className="profile-subtitle">Actualiza tu información profesional</p>
            </div>
            <button className="back-btn" onClick={handleCancel}>
              ← Volver al Dashboard
            </button>
          </div>

          {error && (
            <div className="error-banner">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Nombre Completo</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ej: Juan Pérez"
                  required
                />
              </div>

              <div className="form-group">
                <label>Precio por hora (RD$)</label>
                <input
                  type="number"
                  name="pricePerHour"
                  value={form.pricePerHour}
                  onChange={handleChange}
                  placeholder="Ej: 500"
                  min="0"
                  step="50"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Foto de Perfil (URL)</label>
              <input
                type="url"
                name="photo"
                value={form.photo}
                onChange={handleChange}
                placeholder="https://ejemplo.com/foto.jpg"
              />
              {form.photo && (
                <div className="photo-preview">
                  <img 
                    src={form.photo} 
                    className="preview-img" 
                    alt="Vista previa"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/120?text=Error";
                    }}
                  />
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Descripción Profesional</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                placeholder="Describe tu experiencia, especialidades y certificaciones..."
                required
              />
              <small>{form.description.length} caracteres</small>
            </div>

            <div className="form-group">
              <label>Servicios Ofrecidos</label>
              <input
                type="text"
                name="categories"
                value={form.categories}
                onChange={handleChange}
                placeholder="Ej: Electricidad, Plomería, Carpintería"
                required
              />
              <small>Separar por comas. Ej: Electricidad, Plomería, Climatización</small>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={handleCancel}
                disabled={saving}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="save-btn"
                disabled={saving}
              >
                {saving ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
