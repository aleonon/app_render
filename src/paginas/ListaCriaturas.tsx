/**
 * paginas/ListaCriaturas.tsx
 * ------------------------------
 * Página de solo lectura: lista todas las criaturas en una <table> de
 * HTML plano, sin ninguna clase de CSS. Maneja los 3 estados: loading,
 * error y empty.
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { obtenerCriaturas } from "../api/criaturasApi";
import { Criatura, TipoCriatura, TIPOS_CRIATURA } from "../tipos";
import { MonsterCard } from "../componentes/MonsterCard";
import { MonsterImage } from "../componentes/MonsterImage";

export function ListaCriaturas() {
  const [criaturas, setCriaturas] = useState<Criatura[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<TipoCriatura | "">("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCargando(true);
    setError(null);

    obtenerCriaturas(filtroTipo || undefined)
      .then(setCriaturas)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Error al cargar las criaturas.");
      })
      .finally(() => setCargando(false));
  }, [filtroTipo]);

  const peligroMaximo = criaturas.length > 0 ? Math.max(...criaturas.map((criatura) => criatura.nivelPeligro)) : "—";
  const clasesPresentes = new Set(criaturas.map((criatura) => criatura.tipo)).size;

  return (
    <section className="archive-page">
      <section className="archive-hero" aria-labelledby="archive-title">
        <div className="archive-hero__copy">
          <p className="eyebrow"><span className="eyebrow__dot" /> SPECIMEN DATABASE <span>·</span> 41° 42′ N</p>
          <h1 id="archive-title" className="archive-hero__title">BESTIARIO<span>DIGITAL</span></h1>
          <p className="archive-hero__description">Una colección de criaturas, monstruos y formas de vida imposibles. Observadas, clasificadas y aún no del todo comprendidas.</p>
          <a className="archive-hero__cta" href="#catalogo">EXPLORAR ARCHIVO <span aria-hidden="true">↘</span></a>
          <span className="archive-hero__side-note">FIELD NOTES / PAWNEE COUNTY</span>
        </div>
        <div className="archive-hero__art">
          <span className="archive-hero__art-label">ARCHIVE / 001</span>
          <MonsterImage archiveNumber="SPECIMEN_001" variant="hero" />
          <span className="archive-hero__art-index">01—24</span>
        </div>
      </section>

      <section className="archive-facts" aria-label="Resumen del archivo">
        <div className="archive-fact">
          <span className="archive-fact__label">ESPECÍMENES</span>
          <strong>{cargando ? "···" : String(criaturas.length).padStart(2, "0")}</strong>
          <span className="archive-fact__note">REGISTROS ACTIVOS</span>
        </div>
        <div className="archive-fact">
          <span className="archive-fact__label">CLASIFICACIONES</span>
          <strong>{cargando ? "···" : String(clasesPresentes).padStart(2, "0")}</strong>
          <span className="archive-fact__note">TIPOS REPRESENTADOS</span>
        </div>
        <div className="archive-fact archive-fact--accent">
          <span className="archive-fact__label">PELIGRO MÁXIMO</span>
          <strong>{cargando ? "···" : peligroMaximo}<small>{typeof peligroMaximo === "number" ? " / 10" : ""}</small></strong>
          <span className="archive-fact__note">ESCALA DE RIESGO</span>
        </div>
      </section>

      <section className="archive-catalog" id="catalogo">
        <div className="catalog-heading">
          <div>
            <p className="eyebrow"><span className="eyebrow__dot" /> REGISTRO DE CAMPO / 01</p>
            <h2 className="section-title">EL ARCHIVO<span>VIVO</span></h2>
            <p className="catalog-heading__description">Expedientes reunidos en los rincones menos ordinarios de Indiana.</p>
          </div>
          <div className="catalog-controls">
            <label className="field-label" htmlFor="filtro-tipo">CLASIFICAR POR ESPECIE</label>
            <div className="select is-fullwidth catalog-filter">
              <select
                id="filtro-tipo"
                className="field-control"
                value={filtroTipo}
                onChange={(evento) => setFiltroTipo(evento.target.value as TipoCriatura | "")}
              >
                <option value="">Todos los tipos</option>
                {TIPOS_CRIATURA.map((tipo) => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>
            <Link className="action-primary catalog-add" to="/criaturas/nueva">+ NUEVO EXPEDIENTE</Link>
          </div>
        </div>

        {cargando && <p className="archive-message">REVISANDO LOS EXPEDIENTES...</p>}
        {!cargando && error && <div className="archive-error" role="alert">ERROR DE ARCHIVO: {error}</div>}
        {!cargando && !error && criaturas.length === 0 && (
          <div className="archive-empty">
            <MonsterImage archiveNumber="SPECIMEN_000" />
            <h3>Todavía no hay criaturas registradas.</h3>
            <p>Cuando encuentres una, puedes crear su primer expediente.</p>
            <Link className="action-primary" to="/criaturas/nueva">+ REGISTRAR CRIATURA</Link>
          </div>
        )}

        {!cargando && !error && criaturas.length > 0 && (
          <div className="creature-grid">
            {criaturas.map((criatura, index) => (
              <MonsterCard key={criatura._id} criatura={criatura} index={index} />
            ))}
          </div>
        )}
      </section>
      <div className="archive-endnote"><span>FIN DEL FRAGMENTO</span><span>CONTINÚA LA INVESTIGACIÓN <b>→</b></span></div>
    </section>
  );
}
