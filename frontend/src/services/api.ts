// Servicio de API para conectar con el backend

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Helper para obtener el token de autenticación
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Helper para headers con autenticación
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// ============= REQUESTS =============

export const requestsService = {
  // Obtener solicitudes del técnico
  async getRequestsByTechnician(technicianId: string) {
    const response = await fetch(
      `${API_BASE_URL}/requests?technicianId=${technicianId}`,
      {
        headers: getAuthHeaders()
      }
    );
    
    if (!response.ok) {
      throw new Error('Error al cargar solicitudes');
    }
    
    return response.json();
  },

  // Aceptar solicitud
  async acceptRequest(requestId: string) {
    const response = await fetch(
      `${API_BASE_URL}/requests/${requestId}`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: 'accepted' })
      }
    );
    
    if (!response.ok) {
      throw new Error('Error al aceptar solicitud');
    }
    
    return response.json();
  },

  // Rechazar solicitud (cambiar a cancelled)
  async rejectRequest(requestId: string) {
    const response = await fetch(
      `${API_BASE_URL}/requests/${requestId}`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: 'cancelled' })
      }
    );
    
    if (!response.ok) {
      throw new Error('Error al rechazar solicitud');
    }
    
    return response.json();
  },

  // Completar solicitud
  async completeRequest(requestId: string) {
    const response = await fetch(
      `${API_BASE_URL}/requests/${requestId}`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: 'completed' })
      }
    );
    
    if (!response.ok) {
      throw new Error('Error al completar solicitud');
    }
    
    return response.json();
  },

  // Eliminar solicitud
  async deleteRequest(requestId: string) {
    const response = await fetch(
      `${API_BASE_URL}/requests/${requestId}`,
      {
        method: 'DELETE',
        headers: getAuthHeaders()
      }
    );
    
    if (!response.ok) {
      throw new Error('Error al eliminar solicitud');
    }
    
    return response.json();
  }
};

// ============= TECHNICIANS =============

export const techniciansService = {
  // Obtener perfil del técnico
  async getTechnicianProfile(technicianId: string) {
    const response = await fetch(
      `${API_BASE_URL}/technicians/${technicianId}`,
      {
        headers: getAuthHeaders()
      }
    );
    
    if (!response.ok) {
      throw new Error('Error al cargar perfil');
    }
    
    return response.json();
  },

  // Actualizar perfil del técnico
  async updateTechnicianProfile(technicianId: string, data: any) {
    const response = await fetch(
      `${API_BASE_URL}/technicians/${technicianId}`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      }
    );
    
    if (!response.ok) {
      throw new Error('Error al actualizar perfil');
    }
    
    return response.json();
  },

  // Actualizar disponibilidad
  async updateAvailability(technicianId: string, isAvailable: boolean) {
    const response = await fetch(
      `${API_BASE_URL}/technicians/${technicianId}`,
      {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isAvailable })
      }
    );
    
    if (!response.ok) {
      throw new Error('Error al actualizar disponibilidad');
    }
    
    return response.json();
  },

  // Obtener top técnicos
  async getTopTechnicians() {
    const response = await fetch(
      `${API_BASE_URL}/technicians/top`,
      {
        headers: getAuthHeaders()
      }
    );
    
    if (!response.ok) {
      throw new Error('Error al cargar técnicos');
    }
    
    return response.json();
  }
};

// ============= AUTH =============

export const authService = {
  // Login
  async login(email: string, password: string) {
    const response = await fetch(
      `${API_BASE_URL}/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      }
    );
    
    if (!response.ok) {
      throw new Error('Error de autenticación');
    }
    
    const data = await response.json();
    
    // Guardar token
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('userType', data.user.type); // 'technician' o 'client'
    }
    
    return data;
  },

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
  },

  // Obtener usuario actual
  getCurrentUser() {
    return {
      id: localStorage.getItem('userId'),
      type: localStorage.getItem('userType'),
      token: localStorage.getItem('token')
    };
  },

  // Verificar si está autenticado
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};

export default {
  requests: requestsService,
  technicians: techniciansService,
  auth: authService
};
