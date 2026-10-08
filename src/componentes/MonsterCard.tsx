import { Link } from "react-router-dom";
import { Criatura } from "../tipos";
import { MonsterImage } from "./MonsterImage";

interface MonsterCardProps {
  criatura: Criatura;
  index: number;
}

export function MonsterCard({ criatura, index }: MonsterCardProps) {
  const numeroArchivo = String(index + 1).padStart(3, "0");
  const variant = index === 0 ? "featured" : index % 3 === 1 ? "editorial" : "standard";

  return (
    <article className={`creature-card creature-card--${variant}`}>
      <Link className="creature-card__image-link" to={`/criaturas/${criatura._id}`} aria-label={`Ver expediente de ${criatura.nombre}`}>
        <MonsterImage archiveNumber={`CREATURE_${numeroArchivo}`} variant={variant} />
      </Link>
      <div className="creature-card__content">
        <div className="creature-card__eyebrow">
          <span>ARCHIVE / {numeroArchivo}</span>
          <span className="creature-card__type">{criatura.tipo}</span>
        </div>
        <h3 className="creature-card__title">
          <Link to={`/criaturas/${criatura._id}`}>{criatura.nombre}</Link>
        </h3>
        <div className="creature-card__facts">
          <span>PELIGRO <strong>{criatura.nivelPeligro}<small> / 10</small></strong></span>
          <span>ESTADO <strong>{criatura.estado.replace(/_/g, " ")}</strong></span>
        </div>
        {criatura.habilidades.length > 0 && (
          <p className="creature-card__skills">{criatura.habilidades.slice(0, 3).join(" · ")}</p>
        )}
        <div className="creature-card__actions">
          <Link to={`/criaturas/${criatura._id}`}>Abrir expediente <span aria-hidden="true">↗</span></Link>
          <Link className="creature-card__edit" to={`/criaturas/${criatura._id}/editar`}>Editar</Link>
        </div>
      </div>
      {variant === "editorial" && <span className="creature-card__index" aria-hidden="true">{numeroArchivo}</span>}
    </article>
  );
}
