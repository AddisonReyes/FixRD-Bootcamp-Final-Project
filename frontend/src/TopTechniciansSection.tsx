// ------------------------ricky---------------------------
import React, { useEffect, useState } from "react"; 
import { Technician } from "./types";
import { techniciansMock } from "./mocks/techniciansMock"; 
import { fetchTechniciansFromApi } from "./api/techniciansApi"; 

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const TopTechniciansSection: React.FC = () => {
  const [technicians, setTechnicians] = useState<Technician[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [usingMock, setUsingMock] = useState(false); 

  useEffect(() => {
    const loadTechnicians = async () => {
      try {
        const data = await fetchTechniciansFromApi(); 
        const sorted = [...data]
          .sort(
            (a, b) => (b.rating || 0) - (a.rating || 0) 
          )
          .slice(0, 3); // top 3 técnicos
        setTechnicians(sorted); 
      } catch (error) {
        console.error("Usando técnicos estáticos por error en API", error); 
        setTechnicians(techniciansMock); 
        setUsingMock(true); 
      } finally {
        setLoading(false); 
      }
    };

    loadTechnicians(); 
  }, []);

  return (
    <section className="home-section technicians-section" id="top-technicians">
      <div className="section-header">
        <h2 className="section-title">
          <span className="section-title-main">Top</span>{" "}
          <span className="section-title-highlight">Técnicos</span>
        </h2>
        <p className="section-subtitle">
          Conoce a nuestros técnicos mejor valorados. Todos están verificados,
          certificados y listos para ayudarte.
        </p>
        {usingMock && (
          <p className="section-note">
            * Mostrando datos de ejemplo mientras se conecta la base de datos.
          </p>
        )}
      </div>

      {loading ? (
        <p className="loading-text">Cargando técnicos...</p>
      ) : (
        <div className="cards-grid">
          {technicians.map((tech) => (
            <article key={tech._id || tech.name} className="technician-card">
              
              <div className="technician-content">
                <div className="technician-header">
                  <img
                    src={tech.photo || "https://via.placeholder.com/80x80.png?text=FX"}
                    alt={tech.name}
                    className="technician-photo"
                  />
                  <div>
                    <h3 className="technician-name">{tech.name}</h3>
                    <p className="technician-role">
                      {tech.categories?.join(" • ")}
                    </p>
                    <div className="technician-rating">
                      ⭐ {tech.rating?.toFixed(1) || "N/A"}{" "}
                      <span className="technician-reviews">
                        ({tech.reviewsCount ?? 0} reseñas)
                      </span>
                    </div>
                  </div>
                </div>

                <p className="technician-description">{tech.description}</p>

                <div className="technician-tags">
                  {tech.tags?.map((tag) => (
                    <span key={tag} className="technician-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="technician-footer">
                <div className="technician-price">
                  Desde{" "}
                  <span className="price-amount">
                    {formatCurrency((tech as any).pricePerDay || 0)}
                  </span>
                  /Día
                </div>
                <button className="btn-primary">Solicitar servicio</button>
              </div>

            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default TopTechniciansSection; 
