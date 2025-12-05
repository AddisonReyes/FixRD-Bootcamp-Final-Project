# 🔌 Dashboard Técnico - Guía de Conexión con Backend

## ✅ Archivos Modificados

### Frontend:
1. ✅ `frontend/.env` - Variables de entorno (crear)
2. ✅ `frontend/src/services/api.ts` - Servicio de API (creado)
3. ✅ `frontend/src/pages/TechnicianDashboard/TechnicianDashboard.tsx` - Conectado
4. ✅ `frontend/src/pages/ProfileSettings/ProfileSettings.tsx` - Conectado

### Backend:
5. ✅ `backend/src/index.ts` - CORS configurado

---

## 🚀 Pasos para Levantar el Proyecto

### 1. Variables de Entorno

**Frontend** - Crear `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:3001/api
```

**Backend** - Verificar `backend/.env`:
```env
NODE_ENV=dev
PORT=3001
MONGO_URL_DEV=mongodb://localhost:27017/fixrd
JWT_SECRET=tu_secreto_jwt
```

---

### 2. Instalar Dependencias

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

### 3. Levantar el Backend

```bash
cd backend
npm run dev
```

Deberías ver:
```
 + Database connected.
Server listening on port 3001
```

---

### 4. Levantar el Frontend

```bash
cd frontend
npm start
```

Se abrirá automáticamente en `http://localhost:3000`

---

## 🔐 Flujo de Autenticación

### 1. Login del Técnico

El usuario debe hacer login primero:

```typescript
import { authService } from './services/api';

// En tu componente de Login
const handleLogin = async (email: string, password: string) => {
  try {
    const data = await authService.login(email, password);
    
    // Guarda automáticamente:
    // - token en localStorage
    // - userId en localStorage
    // - userType ('technician' o 'client')
    
    // Redirigir al dashboard
    if (data.user.type === 'technician') {
      navigate('/tecnico');
    }
  } catch (error) {
    console.error('Error de login:', error);
  }
};
```

### 2. Proteger Rutas

Crea un componente `ProtectedRoute`:

```typescript
// frontend/src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { authService } from '../services/api';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}
```

Úsalo en `App.tsx`:
```typescript
<Route 
  path="/tecnico" 
  element={
    <ProtectedRoute>
      <TechnicianDashboard />
    </ProtectedRoute>
  } 
/>
```

---

## 📡 Endpoints Disponibles

### Requests (Solicitudes)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/requests?technicianId={id}` | Obtener solicitudes |
| PUT | `/api/requests/:id` | Actualizar estado |
| DELETE | `/api/requests/:id` | Eliminar solicitud |

**Ejemplo de respuesta:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "technicianId": "tech123",
    "clientId": "client456",
    "description": "Reparación de tubería",
    "date": "2025-12-04T10:00:00.000Z",
    "status": "pending"
  }
]
```

### Technicians (Técnicos)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/technicians/:id` | Obtener perfil |
| PUT | `/api/technicians/:id` | Actualizar perfil |
| PATCH | `/api/technicians/:id` | Actualizar disponibilidad |
| GET | `/api/technicians/top` | Top 10 técnicos |

**Ejemplo de respuesta:**
```json
{
  "_id": "tech123",
  "name": "Carlos Méndez",
  "description": "Electricista certificado...",
  "pricePerHour": 500,
  "categories": ["Electricidad", "Plomería"],
  "photo": "https://...",
  "rating": 4.8,
  "isAvailable": true
}
```

### Auth (Autenticación)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/register` | Registrar usuario |

**Body de login:**
```json
{
  "email": "tecnico@example.com",
  "password": "password123"
}
```

**Respuesta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "tech123",
    "email": "tecnico@example.com",
    "type": "technician",
    "name": "Carlos Méndez"
  }
}
```

---

## 🧪 Pruebas

### Probar con datos Mock (sin backend)

El dashboard funciona automáticamente con datos de ejemplo si el backend no está disponible.

### Probar con Backend

1. Asegúrate de tener MongoDB corriendo
2. Crea un técnico de prueba:

```bash
# Usando MongoDB Compass o CLI
db.technicians.insertOne({
  name: "Carlos Méndez",
  email: "carlos@test.com",
  password: "hashed_password",
  categories: ["Electricidad"],
  pricePerHour: 500,
  isAvailable: true,
  rating: 4.5
})
```

3. Haz login con esas credenciales
4. El dashboard cargará automáticamente

---

## 🔧 Troubleshooting

### Error: CORS blocked
**Solución:** Verifica que backend esté en puerto 3001 y frontend en 3000

### Error: Cannot read property 'id' of null
**Solución:** El usuario no está autenticado. Redirige a `/login`

### Error: Network request failed
**Solución:** 
- Verifica que el backend esté corriendo
- Revisa `.env` tenga `REACT_APP_API_URL` correcto

### Dashboard muestra "datos de ejemplo"
**Solución:** 
- Backend no está respondiendo
- Revisa consola del navegador para ver el error exacto
- Verifica que el token JWT sea válido

---

## 📝 TODO: Mejoras Pendientes

### Alta Prioridad:
- [ ] Implementar AuthContext para manejar estado global de autenticación
- [ ] Agregar Toast Notifications (react-hot-toast)
- [ ] Implementar endpoint de notificaciones en backend
- [ ] Agregar validación de token en cada request

### Media Prioridad:
- [ ] Sistema de refresh token
- [ ] WebSockets para actualizaciones en tiempo real
- [ ] Caché de datos con React Query
- [ ] Paginación de solicitudes

### Baja Prioridad:
- [ ] PWA con notificaciones push
- [ ] Modo offline con Service Workers
- [ ] Exportar reportes PDF

---

## 🎯 Próximos Pasos

1. **Crear usuario de prueba** en tu base de datos
2. **Implementar pantalla de Login** funcional
3. **Probar flujo completo:**
   - Login → Dashboard → Ver solicitudes → Aceptar/Rechazar
4. **Agregar Toast Notifications** para mejor UX
5. **Implementar AuthContext** para persistencia

---

## 📚 Recursos

- [React Router - Protected Routes](https://reactrouter.com/docs/en/v6)
- [JWT Authentication Guide](https://jwt.io/introduction)
- [React Hot Toast](https://react-hot-toast.com/)
- [MongoDB Atlas](https://www.mongodb.com/atlas)

---

**¡El dashboard está listo para conectarse con tu backend! 🎉**

Si tienes dudas, revisa los comentarios `// TODO:` en el código.
