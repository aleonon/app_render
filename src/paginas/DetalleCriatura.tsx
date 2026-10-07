/**
 * paginas/DetalleCriatura.tsx
 * -------------------------------
 * Muestra una criatura completa y la lista de sus avistamientos, usando
 * la ruta anidada del backend. También permite eliminar la criatura.
 */

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { eliminarCriatura, obtenerCriaturaPorId } from "../api/criaturasApi";
import { obtenerAvistamientosDeCriatura } from "../api/avistamientosApi";
import { Criatura } from "../tipos";

// El backend anida los avistamientos bajo /criaturas/:id/avistamientos
// SIN populate (ver criaturas.controller.ts de la Semana 6) — por eso aquí
// el campo `criatura` es un string, no un objeto.
interface AvistamientoSinPopular {
  _id: string;
  testigo: string;
  ubicacion: string;
  descripcion?: string;
  fecha: string;
}

export function DetalleCriatura() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [criatura, setCriatura] = useState<Criatura | null>(null);
  const [avistamientos, setAvistamientos] = useState<AvistamientoSinPopular[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    Promise.all([obtenerCriaturaPorId(id), obtenerAvistamientosDeCriatura(id)])
      .then(([criaturaCargada, avistamientosCargados]) => {
        setCriatura(criaturaCargada);
        setAvistamientos(avistamientosCargados as unknown as AvistamientoSinPopular[]);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Error al cargar la criatura."))
      .finally(() => setCargando(false));
  }, [id]);

  async function manejarEliminar() {
    if (!id) return;
    if (!window.confirm("¿Seguro que quieres eliminar esta criatura?")) return;

    try {
      await eliminarCriatura(id);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar la criatura.");
    }
  }

  if (cargando) return <p className="py-10 text-center text-stone-500">Cargando expediente...</p>;
  if (error) return <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800" role="alert">Error: {error}</div>;
  if (!criatura) return <p className="py-10 text-center text-stone-600">No se encontró la criatura.</p>;

  return (
    <section>
      <Link className="text-sm font-bold no-underline" to="/">← Volver a criaturas</Link>

      <div className="surface mt-6">
        <div className="flex flex-col gap-6 border-b border-stone-100 pb-7 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="tag is-success is-light status-tag mb-4">{criatura.tipo}</span>
            <h1 className="page-title">{criatura.nombre}</h1>
            <p className="mt-3 text-stone-500">Expediente de investigación de Pawnee</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="button action-secondary no-underline" to={`/criaturas/${criatura._id}/editar`}>Editar expediente</Link>
            <button className="button action-danger" type="button" onClick={manejarEliminar}>Eliminar</button>
          </div>
        </div>

        <div className="grid gap-4 py-7 sm:grid-cols-3">
          <div className="rounded-xl bg-stone-50 p-5">
            <p className="text-xs font-black uppercase tracking-wider text-stone-500">Peligro</p>
            <p className="mt-2 text-2xl font-black text-stone-900">{criatura.nivelPeligro}<span className="ml-1 text-sm font-medium text-stone-400">/ 10</span></p>
          </div>
          <div className="rounded-xl bg-stone-50 p-5">
            <p className="text-xs font-black uppercase tracking-wider text-stone-500">Estado</p>
            <p className="mt-2"><span className="tag is-warning is-light status-tag">{criatura.estado}</span></p>
          </div>
          <div className="rounded-xl bg-stone-50 p-5">
            <p className="text-xs font-black uppercase tracking-wider text-stone-500">Avistamientos</p>
            <p className="mt-2 text-2xl font-black text-stone-900">{avistamientos.length}</p>
          </div>
        </div>

        <div className="border-t border-stone-100 pt-6">
          <h2 className="text-lg font-extrabold text-stone-900">Habilidades conocidas</h2>
          {criatura.habilidades.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {criatura.habilidades.map((habilidad) => (
                <span className="tag is-light status-tag" key={habilidad}>{habilidad}</span>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-stone-500">No hay habilidades registradas.</p>
          )}
        </div>
      </div>

      <div className="surface mt-6">
        <div className="flex flex-col gap-4 border-b border-stone-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-stone-900">Avistamientos registrados</h2>
            <p className="mt-1 text-sm text-stone-500">Observaciones asociadas a este expediente.</p>
          </div>
          <Link
            className="button action-primary no-underline"
            to={`/avistamientos/nuevo?criaturaId=${criatura._id}`}
          >
            + Registrar avistamiento
          </Link>
        </div>

        {avistamientos.length === 0 ? (
          <p className="py-8 text-center text-stone-600">Todavía no hay avistamientos registrados para esta criatura.</p>
        ) : (
          <ul className="divide-y divide-stone-100">
            {avistamientos.map((avistamiento) => (
              <li className="py-4" key={avistamiento._id}>
                <div className="flex flex-col justify-between gap-1 sm:flex-row">
                  <p className="font-bold text-stone-800">{avistamiento.testigo} <span className="font-normal text-stone-500">en {avistamiento.ubicacion}</span></p>
                  <time className="text-sm text-stone-500">{avistamiento.fecha.slice(0, 10)}</time>
                </div>
                {avistamiento.descripcion && <p className="mt-2 text-sm leading-6 text-stone-600">{avistamiento.descripcion}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
