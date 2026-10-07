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

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-emerald-800">Registro de campo</p>
          <h1 className="page-title">Criaturas de Pawnee</h1>
          <p className="page-description">Un archivo vivo de las criaturas que habitan los rincones menos ordinarios de Indiana.</p>
        </div>
        <Link className="button action-primary no-underline" to="/criaturas/nueva">+ Registrar criatura</Link>
      </div>

      <div className="surface">
        <div className="mb-6 flex flex-col gap-4 border-b border-stone-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-stone-900">Expedientes</h2>
            <p className="mt-1 text-sm text-stone-500">Consulta y administra los registros existentes.</p>
          </div>
          <div className="w-full sm:w-64">
            <label className="field-label" htmlFor="filtro-tipo">Filtrar por tipo</label>
            <div className="select is-fullwidth">
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
          </div>
        </div>

        {cargando && <p className="py-10 text-center text-stone-500">Cargando criaturas...</p>}
        {!cargando && error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800" role="alert">Ocurrió un error: {error}</div>}
        {!cargando && !error && criaturas.length === 0 && (
          <div className="py-10 text-center">
            <p className="text-lg font-bold text-stone-800">Todavía no hay criaturas registradas.</p>
            <p className="mt-2 text-sm text-stone-500">Cuando encuentres una, puedes crear su primer expediente.</p>
          </div>
        )}

        {!cargando && !error && criaturas.length > 0 && (
          <div className="overflow-x-auto">
            <table className="table is-fullwidth data-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Nivel de peligro</th>
                  <th>Estado</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {criaturas.map((criatura) => (
                  <tr key={criatura._id}>
                    <td className="font-bold text-stone-900">{criatura.nombre}</td>
                    <td><span className="tag is-success is-light status-tag">{criatura.tipo}</span></td>
                    <td>
                      <span className="font-bold">{criatura.nivelPeligro}</span>
                      <span className="ml-1 text-stone-400">/ 10</span>
                    </td>
                    <td><span className="tag is-warning is-light status-tag">{criatura.estado}</span></td>
                    <td className="text-right">
                      <div className="flex justify-end gap-3">
                        <Link className="font-bold no-underline" to={`/criaturas/${criatura._id}`}>Ver</Link>
                        <Link className="font-medium text-stone-500 no-underline hover:text-emerald-800" to={`/criaturas/${criatura._id}/editar`}>Editar</Link>
                      </div>
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
