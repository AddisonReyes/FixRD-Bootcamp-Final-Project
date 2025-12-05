import React, { useState, useMemo } from "react";
import { Request } from "../../types/dashboard";
import RequestCard from "./RequestCard";
import "./RequestsList.css";

interface RequestsListProps {
  requests: Request[];
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onComplete: (id: string) => void;
}

export default function RequestsList({ requests, onAccept, onReject, onComplete }: RequestsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "accepted" | "completed">("all");
  const [sortBy, setSortBy] = useState<"date" | "price">("date");

  const filteredAndSortedRequests = useMemo(() => {
    let filtered = requests;

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(req => 
        req.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por estado
    if (statusFilter !== "all") {
      filtered = filtered.filter(req => req.status === statusFilter);
    }

    // Ordenar
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    });

    return sorted;
  }, [requests, searchTerm, statusFilter, sortBy]);

  const pendingCount = requests.filter(r => r.status === "pending").length;

  return (
    <section className="requests-list-section">
      <div className="requests-header">
        <h2 className="requests-title">
          Solicitudes de Servicio
          {pendingCount > 0 && (
            <span className="pending-badge">{pendingCount} nuevas</span>
          )}
        </h2>
      </div>

      <div className="requests-filters">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar por cliente, ubicación o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="clear-search"
              onClick={() => setSearchTerm("")}
              aria-label="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </div>

        <div className="filter-group">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="filter-select"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="accepted">Aceptadas</option>
            <option value="completed">Completadas</option>
          </select>

          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="filter-select"
          >
            <option value="date">Más recientes</option>
            <option value="price">Por precio</option>
          </select>
        </div>
      </div>

      <div className="requests-count">
        Mostrando {filteredAndSortedRequests.length} de {requests.length} solicitudes
      </div>

      {filteredAndSortedRequests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No se encontraron solicitudes</h3>
          <p>
            {searchTerm || statusFilter !== "all" 
              ? "Intenta ajustar los filtros de búsqueda"
              : "Aún no tienes solicitudes de servicio"}
          </p>
        </div>
      ) : (
        <div className="requests-grid">
          {filteredAndSortedRequests.map(request => (
            <RequestCard
              key={request._id}
              request={request}
              onAccept={onAccept}
              onReject={onReject}
              onComplete={onComplete}
            />
          ))}
        </div>
      )}
    </section>
  );
}
