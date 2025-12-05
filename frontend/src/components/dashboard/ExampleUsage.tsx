// Ejemplo de uso de los nuevos componentes

import { Request, TechnicianProfile, NotificationSettings } from "../../types/dashboard";

// ============= DATOS DE EJEMPLO =============

// Perfil del técnico
const exampleProfile: TechnicianProfile = {
  id: "tech-001",
  name: "Juan Pérez",
  role: "Plomero Certificado",
  avatar: "https://i.pravatar.cc/150?img=10",
  certifications: ["Licensed", "Insured", "Verified"],
  isAvailable: true,
};

// Configuración de notificaciones
const exampleNotifications: NotificationSettings = {
  newRequests: true,
  messages: true,
  reviews: false,
};

// Solicitudes de ejemplo
const exampleRequests: Request[] = [
  {
    _id: "req-001",
    clientName: "María García",
    clientAvatar: "https://i.pravatar.cc/100?img=20",
    location: "Bella Vista, Santo Domingo",
    description: "Fuga en tubería de la cocina. Necesito reparación urgente.",
    date: new Date().toISOString(),
    time: "Hoy, 3:00 PM",
    status: "pending",
    tag: "Urgent",
    priceRange: "RD$2,000 - 3,500",
    category: "Plomería"
  },
  {
    _id: "req-002",
    clientName: "Carlos Rodríguez",
    clientAvatar: "https://i.pravatar.cc/100?img=15",
    location: "Naco, Santo Domingo",
    description: "Instalación de lavamanos nuevo en el baño principal.",
    date: new Date(Date.now() - 86400000).toISOString(),
    time: "Mañana, 10:00 AM",
    status: "accepted",
    tag: "Standard",
    priceRange: "RD$1,500 - 2,000",
    category: "Plomería"
  }
];

// ============= HANDLERS DE EJEMPLO =============

const handleAcceptRequest = async (requestId: string) => {
  console.log("Aceptando solicitud:", requestId);
  // Aquí va la lógica para llamar a la API
  // await api.acceptRequest(requestId);
  // Actualizar estado local
  // Mostrar notificación de éxito
};

const handleRejectRequest = async (requestId: string) => {
  console.log("Rechazando solicitud:", requestId);
  // await api.rejectRequest(requestId);
};

const handleCompleteRequest = async (requestId: string) => {
  console.log("Completando solicitud:", requestId);
  // await api.completeRequest(requestId);
};

const handleToggleAvailability = async (isAvailable: boolean) => {
  console.log("Cambiando disponibilidad:", isAvailable);
  // await api.updateAvailability(isAvailable);
};

const handleToggleNotification = async (
  key: keyof NotificationSettings, 
  value: boolean
) => {
  console.log(`Actualizando notificación ${key}:`, value);
  // await api.updateNotificationSettings({ [key]: value });
};

const handleEditProfile = () => {
  console.log("Navegando a edición de perfil");
  // navigate('/tecnico/perfil/editar');
};

// ============= EJEMPLO DE USO EN COMPONENTE =============

export const ExampleUsage = () => {
  return (
    <div>
      {/* Ejemplo 1: ProfileCard */}
      {/* 
      <ProfileCard
        profile={exampleProfile}
        notifications={exampleNotifications}
        onToggleAvailability={handleToggleAvailability}
        onToggleNotification={handleToggleNotification}
        onEditProfile={handleEditProfile}
      />
      */}

      {/* Ejemplo 2: StatsCard */}
      {/* 
      <div style={{ display: 'flex', gap: '20px' }}>
        <StatsCard
          title="Pendientes"
          count={5}
          icon="⏳"
          color="#f59e0b"
        />
        <StatsCard
          title="Aceptadas"
          count={12}
          icon="✓"
          color="#2563eb"
        />
        <StatsCard
          title="Completadas"
          count={48}
          icon="✓✓"
          color="#16a34a"
        />
      </div>
      */}

      {/* Ejemplo 3: RequestCard individual */}
      {/* 
      <RequestCard
        request={exampleRequests[0]}
        onAccept={handleAcceptRequest}
        onReject={handleRejectRequest}
        onComplete={handleCompleteRequest}
      />
      */}

      {/* Ejemplo 4: RequestsList completo */}
      {/* 
      <RequestsList
        requests={exampleRequests}
        onAccept={handleAcceptRequest}
        onReject={handleRejectRequest}
        onComplete={handleCompleteRequest}
      />
      */}

      {/* Ejemplo 5: LoadingSpinner */}
      {/* 
      <LoadingSpinner message="Cargando solicitudes..." />
      */}
    </div>
  );
};

// ============= INTEGRACIÓN CON API REAL =============

/*
import { technicianService } from '../../services/api';

// En tu useEffect:
useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true);
      const data = await technicianService.getRequests(technicianId);
      setRequests(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  loadData();
}, [technicianId]);

// Handlers con API real:
const handleAcceptRequest = async (requestId: string) => {
  try {
    await technicianService.acceptRequest(requestId);
    setRequests(prev => 
      prev.map(req => 
        req._id === requestId 
          ? { ...req, status: "accepted" } 
          : req
      )
    );
    showToast("Solicitud aceptada exitosamente", "success");
  } catch (error) {
    showToast("Error al aceptar solicitud", "error");
  }
};
*/

export default ExampleUsage;
