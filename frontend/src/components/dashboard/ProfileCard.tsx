import React, { useState } from "react";
import { TechnicianProfile, NotificationSettings } from "../../types/dashboard";
import "./ProfileCard.css";

interface ProfileCardProps {
  profile: TechnicianProfile;
  notifications: NotificationSettings;
  onToggleAvailability: (available: boolean) => void;
  onToggleNotification: (key: keyof NotificationSettings, value: boolean) => void;
  onEditProfile: () => void;
}

export default function ProfileCard({ 
  profile, 
  notifications, 
  onToggleAvailability,
  onToggleNotification,
  onEditProfile 
}: ProfileCardProps) {
  const [isAvailable, setIsAvailable] = useState(profile.isAvailable);

  const handleAvailabilityToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    setIsAvailable(newValue);
    onToggleAvailability(newValue);
  };

  return (
    <div className="profile-card">
      <img
        src={profile.avatar}
        alt={`Foto de ${profile.name}`}
        className="profile-avatar"
      />

      <h3 className="profile-name">{profile.name}</h3>
      <p className="profile-role">{profile.role}</p>

      <span className={`profile-status ${isAvailable ? 'available' : 'unavailable'}`}>
        {isAvailable ? 'Disponible Hoy' : 'No Disponible'}
      </span>

      <div className="certs">
        {profile.certifications.map((cert, index) => (
          <span key={index}>{cert}</span>
        ))}
      </div>

      <button className="profile-btn" onClick={onEditProfile}>
        Editar Perfil
      </button>

      <div className="toggles">
        <div className="toggle-section">
          <h4>Estado de disponibilidad</h4>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={isAvailable}
              onChange={handleAvailabilityToggle}
            />
            <span className="slider"></span>
          </label>
        </div>

        <h4>Notificaciones</h4>

        <div className="notif-item">
          <span>Nuevas Solicitudes</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={notifications.newRequests}
              onChange={(e) => onToggleNotification('newRequests', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="notif-item">
          <span>Mensajes</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={notifications.messages}
              onChange={(e) => onToggleNotification('messages', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="notif-item">
          <span>Reseñas</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={notifications.reviews}
              onChange={(e) => onToggleNotification('reviews', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );
}
