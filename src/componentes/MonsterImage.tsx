interface MonsterImageProps {
  archiveNumber: string;
  variant?: "hero" | "featured" | "standard" | "editorial";
}

export function MonsterImage({ archiveNumber, variant = "standard" }: MonsterImageProps) {
  return (
    <div
      className={`monster-image monster-image--${variant}`}
      role="img"
      aria-label={`Placeholder de imagen ${archiveNumber}`}
    >
      <span className="monster-image__orbit" aria-hidden="true" />
      <span className="monster-image__cross" aria-hidden="true">✳</span>
      <span className="monster-image__caption">MONSTER / ARCHIVE</span>
      <span className="monster-image__number">{archiveNumber}</span>
    </div>
  );
}
