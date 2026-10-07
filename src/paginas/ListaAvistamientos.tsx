/**
 * paginas/ListaAvistamientos.tsx
 * -----------------------------------
 * Lista TODOS los avistamientos. Como el backend usa populate("criatura"),
 * cada avistamiento.criatura ya es el objeto completo.
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { eliminarAvistamiento, obtenerAvistamientos } from "../api/avistamientosApi";
import { Avistamiento } from "../tipos";

export function ListaAvistamientos() {
  const [avistamientos, setAvistamientos] = useState<Avistamiento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function cargar() {
    setCargando(true);
    setError(null);
    obtenerAvistamientos()
      .then(setAvistamientos)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Error al cargar los avistamientos."))
      .finally(() => setCargando(false));
  }

  useEffect(() => {
    cargar();
  }, []);

  async function manejarEliminar(id: string) {
    if (!window.confirm("¿Eliminar este avistamiento?")) return;
    try {
      await eliminarAvistamiento(id);
      cargar();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar el avistamiento.");
    }
  }

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-emerald-800">Bitácora de sucesos</p>
          <h1 className="page-title">Avistamientos</h1>
          <p className="page-description">Testimonios y observaciones recopilados por el Departamento de Investigación.</p>
        </div>
        <Link className="button action-primary no-underline" to="/avistamientos/nuevo">+ Registrar avistamiento</Link>
      </div>

      <div className="surface">
        <div className="mb-6 border-b border-stone-100 pb-5">
          <h2 className="text-lg font-extrabold text-stone-900">Últimos reportes</h2>
          <p className="mt-1 text-sm text-stone-500">Revisa cada testimonio y su ubicación.</p>
        </div>

        {cargando && <p className="py-10 text-center text-stone-500">Cargando avistamientos...</p>}
        {!cargando && error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800" role="alert">Error: {error}</div>}
        {!cargando && !error && avistamientos.length === 0 && (
          <p className="py-10 text-center text-stone-600">Todavía no hay avistamientos registrados.</p>
        )}

        {!cargando && !error && avistamientos.length > 0 && (
          <div className="overflow-x-auto">
            <table className="table is-fullwidth data-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Criatura</th>
                  <th>Testigo</th>
                  <th>Ubicación</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {avistamientos.map((avistamiento) => (
                  <tr key={avistamiento._id}>
                    <td className="whitespace-nowrap">{avistamiento.fecha.slice(0, 10)}</td>
                    <td>
                      <Link className="font-bold no-underline" to={`/criaturas/${avistamiento.criatura._id}`}>
                        {avistamiento.criatura.nombre}
                      </Link>
                    </td>
                    <td>{avistamiento.testigo}</td>
                    <td>{avistamiento.ubicacion}</td>
                    <td className="text-right">
                      <button className="button action-danger" type="button" onClick={() => manejarEliminar(avistamiento._id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
