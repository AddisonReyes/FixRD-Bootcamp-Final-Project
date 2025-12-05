import React, { useState } from "react";
import { Request } from "../../types/dashboard";
import "./RequestCard.css";

interface RequestCardProps {
  request: Request;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onComplete?: (id: string) => void;
}

export default function RequestCard({ request, onAccept, onReject, onComplete }: RequestCardProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [actionType, setActionType] = useState<'accept' | 'reject' | null>(null);

  const handleAction = (type: 'accept' | 'reject') => {
    setActionType(type);
    setShowConfirmation(true);
  };

  const confirmAction = () => {
    if (actionType === 'accept') {
      onAccept(request._id);
    } else if (actionType === 'reject') {
      onReject(request._id);
    }
    setShowConfirmation(false);
    setActionType(null);
  };

  const cancelAction = () => {
    setShowConfirmation(false);
    setActionType(null);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-DO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="request-card">
      <div className="client-info">
        <img 
          src={request.clientAvatar || `https://i.pravatar.cc/100?img=${request._id}`} 
          className="client-avatar" 
          alt={request.clientName} 
        />
        <div className="client-details">
          <h3>{request.clientName}</h3>
          <p className="location">📍 {request.location}</p>
        </div>
        {request.tag && (
          <span className={`tag ${request.tag.toLowerCase()}`}>
            {request.tag}
          </span>
        )}
      </div>

      <p className="description">{request.description}</p>

      <div className="request-meta">
        <span className="time">🗓 {request.time || formatDate(request.date)}</span>
        {request.priceRange && (
          <span className="price">{request.priceRange}</span>
        )}
      </div>

      <div className="request-footer">
        {request.status === "pending" && (
          <>
            <button 
              className="btn-accept" 
              onClick={() => handleAction('accept')}
              aria-label={`Aceptar solicitud de ${request.clientName}`}
            >
              ✔ Aceptar
            </button>
            <button 
              className="btn-reject" 
              onClick={() => handleAction('reject')}
              aria-label={`Rechazar solicitud de ${request.clientName}`}
            >
              ✖ Rechazar
            </button>
          </>
        )}

        {request.status === "accepted" && onComplete && (
          <button 
            className="btn-complete" 
            onClick={() => onComplete(request._id)}
            aria-label={`Marcar como completado solicitud de ${request.clientName}`}
          >
            ✓ Marcar Completado
          </button>
        )}

        {request.status === "completed" && (
          <span className="status-badge completed">✓ Completado</span>
        )}
      </div>

      {showConfirmation && (
        <div className="confirmation-modal">
          <div className="modal-content">
            <h3>Confirmar Acción</h3>
            <p>
              ¿Estás seguro de que deseas {actionType === 'accept' ? 'aceptar' : 'rechazar'} 
              esta solicitud de {request.clientName}?
            </p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={cancelAction}>
                Cancelar
              </button>
              <button 
                className={actionType === 'accept' ? 'btn-confirm-accept' : 'btn-confirm-reject'} 
                onClick={confirmAction}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
