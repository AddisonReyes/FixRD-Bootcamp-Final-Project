import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./TechnicianDashboard.css";
import TechnicianNavbar from "../../components/layout/Topbar/TechnicianNavbar";
import ProfileCard from "../../components/dashboard/ProfileCard";
import StatsCard from "../../components/dashboard/StatsCard";
import RequestsList from "../../components/dashboard/RequestsList";
import LoadingSpinner from "../../components/dashboard/LoadingSpinner";
import { Request, TechnicianProfile, NotificationSettings } from "../../types/dashboard";
import { requestsService, techniciansService, authService } from "../../services/api";

// Mock data para desarrollo - Reemplazar con datos reales del backend
const mockProfile: TechnicianProfile = {
  id: "tech-001",
  name: "Carlos Méndez Rivera",
  role: "Electricista Certificado",
  avatar: "https://i.pravatar.cc/150?img=14",
  certifications: ["Licensed Pro", "Insured", "Top Rated"],
  isAvailable: true,
};

const mockRequests: Request[] = [
  {
    _id: "1",
    clientName: "María Santos",
    clientAvatar: "https://i.pravatar.cc/100?img=47",
    location: "Piantini, Santo Domingo",
    description: "Necesito actualización del panel eléctrico y reemplazo de breakers. La casa experimenta cortes frecuentes de energía.",
    date: new Date().toISOString(),
    time: "Mañana, 2:00 PM",
    status: "pending",
    tag: "Urgent",
    priceRange: "RD$3,500 - 5,000",
  },
  {
    _id: "2",
    clientName: "Roberto Jiménez",
    clientAvatar: "https://i.pravatar.cc/100?img=12",
    location: "Gazcue, Santo Domingo",
    description: "Instalación de ventilador de techo y enchufes adicionales en la sala. Trabajo residencial simple.",
    date: new Date(Date.now() - 86400000).toISOString(),
    time: "Dic 22, 10:00 AM",
    status: "accepted",
    tag: "Standard",
    priceRange: "RD$1,800 - 2,500",
  },
  {
    _id: "3",
    clientName: "Ana Rodríguez",
    clientAvatar: "https://i.pravatar.cc/100?img=22",
    location: "Naco, Santo Domingo",
    description: "Problemas de iluminación en cocina y baño. Luces parpadeando intermitentemente.",
    date: new Date(Date.now() - 172800000).toISOString(),
    time: "Dic 23, 3:00 PM",
    status: "completed",
    tag: "Standard",
    priceRange: "RD$1,200 - 2,000",
  },
];

export default function TechnicianDashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<Request[]>([]);
  const [profile, setProfile] = useState<TechnicianProfile>(mockProfile);
  const [notifications, setNotifications] = useState<NotificationSettings>({
    newRequests: true,
    messages: true,
    reviews: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener ID del técnico autenticado
  const currentUser = authService.getCurrentUser();
  const technicianId = currentUser.id || "ID_DEL_TECNICO";

  // Cargar datos del backend
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Cargar perfil del técnico
        const profileData = await techniciansService.getTechnicianProfile(technicianId);
        setProfile({
          id: profileData._id,
          name: profileData.name,
          role: profileData.categories?.join(", ") || "Técnico",
          avatar: profileData.photo || "https://i.pravatar.cc/150?img=14",
          certifications: ["Licensed Pro", "Insured", "Verified"],
          isAvailable: profileData.isAvailable ?? true,
        });

        // Cargar solicitudes
        const requestsData = await requestsService.getRequestsByTechnician(technicianId);
        setRequests(requestsData);
      } catch (err) {
        console.warn("Usando datos de ejemplo:", err);
        // Usar datos mock si falla la API
        setRequests(mockRequests);
        setProfile(mockProfile);
        setError("Mostrando datos de ejemplo. Conexión con el servidor no disponible.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [technicianId]);

  // Calcular estadísticas con useMemo
  const stats = useMemo(() => ({
    pending: requests.filter((r) => r.status === "pending").length,
    accepted: requests.filter((r) => r.status === "accepted").length,
    completed: requests.filter((r) => r.status === "completed").length,
  }), [requests]);

  // Handlers con useCallback
  const handleAcceptRequest = useCallback(async (requestId: string) => {
    try {
      await requestsService.acceptRequest(requestId);
      
      setRequests(prev => 
        prev.map(req => 
          req._id === requestId ? { ...req, status: "accepted" as const } : req
        )
      );
      
      console.log("✓ Solicitud aceptada:", requestId);
      // TODO: Agregar toast.success('Solicitud aceptada exitosamente');
    } catch (err) {
      console.error("Error al aceptar solicitud:", err);
      setError("No se pudo aceptar la solicitud. Intenta nuevamente.");
      // TODO: Agregar toast.error('Error al aceptar solicitud');
    }
  }, []);

  const handleRejectRequest = useCallback(async (requestId: string) => {
    try {
      await requestsService.rejectRequest(requestId);
      
      setRequests(prev => prev.filter(req => req._id !== requestId));
      
      console.log("✓ Solicitud rechazada:", requestId);
      // TODO: Agregar toast.success('Solicitud rechazada');
    } catch (err) {
      console.error("Error al rechazar solicitud:", err);
      setError("No se pudo rechazar la solicitud. Intenta nuevamente.");
      // TODO: Agregar toast.error('Error al rechazar solicitud');
    }
  }, []);

  const handleCompleteRequest = useCallback(async (requestId: string) => {
    try {
      await requestsService.completeRequest(requestId);
      
      setRequests(prev => 
        prev.map(req => 
          req._id === requestId ? { ...req, status: "completed" as const } : req
        )
      );
      
      console.log("✓ Solicitud completada:", requestId);
      // TODO: Agregar toast.success('Solicitud marcada como completada');
    } catch (err) {
      console.error("Error al completar solicitud:", err);
      setError("No se pudo completar la solicitud. Intenta nuevamente.");
      // TODO: Agregar toast.error('Error al completar solicitud');
    }
  }, []);

  const handleToggleAvailability = useCallback(async (isAvailable: boolean) => {
    try {
      await techniciansService.updateAvailability(technicianId, isAvailable);
      
      setProfile(prev => ({ ...prev, isAvailable }));
      console.log("✓ Disponibilidad actualizada:", isAvailable);
    } catch (err) {
      console.error("Error al actualizar disponibilidad:", err);
      setError("No se pudo actualizar la disponibilidad.");
    }
  }, [technicianId]);

  const handleToggleNotification = useCallback(
    async (key: keyof NotificationSettings, value: boolean) => {
      try {
        // TODO: Implementar endpoint de notificaciones en el backend
        setNotifications(prev => ({ ...prev, [key]: value }));
        console.log(`✓ Notificación ${key} actualizada:`, value);
      } catch (err) {
        console.error("Error al actualizar notificaciones:", err);
      }
    },
    []
  );

  const handleEditProfile = useCallback(() => {
    navigate("/tecnico/perfil");
  }, [navigate]);

  if (loading) {
    return (
      <div className="dashboard-container">
        <main className="dashboard-main">
          <TechnicianNavbar />
          <LoadingSpinner message="Cargando dashboard..." />
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        <TechnicianNavbar />

        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <div className="dashboard-content">
          {/* Perfil y Estadísticas */}
          <div className="dashboard-sidebar">
            <ProfileCard
              profile={profile}
              notifications={notifications}
              onToggleAvailability={handleToggleAvailability}
              onToggleNotification={handleToggleNotification}
              onEditProfile={handleEditProfile}
            />
          </div>

          <div className="dashboard-main-content">
            {/* Cards de estadísticas */}
            <section className="stats-section">
              <StatsCard
                title="Pendientes"
                count={stats.pending}
                icon="⏳"
                color="#f59e0b"
              />
              <StatsCard
                title="Aceptadas"
                count={stats.accepted}
                icon="✓"
                color="#2563eb"
              />
              <StatsCard
                title="Completadas"
                count={stats.completed}
                icon="✓✓"
                color="#16a34a"
              />
            </section>

            {/* Lista de solicitudes con filtros */}
            <RequestsList
              requests={requests}
              onAccept={handleAcceptRequest}
              onReject={handleRejectRequest}
              onComplete={handleCompleteRequest}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
