/**
 * paginas/FormularioAvistamiento.tsx
 * ---------------------------------------
 * Crea un avistamiento nuevo. Si se llega desde el detalle de una
 * criatura (?criaturaId=...), ese campo se precarga.
 */

import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { crearAvistamiento } from "../api/avistamientosApi";
import { obtenerCriaturas } from "../api/criaturasApi";
import { AvistamientoFormulario, Criatura } from "../tipos";

const FORM_VACIO: AvistamientoFormulario = {
  criatura: "",
  testigo: "",
  ubicacion: "",
  descripcion: "",
  fecha: "",
};

export function FormularioAvistamiento() {
  const [parametros] = useSearchParams();
  const navigate = useNavigate();

  const [criaturas, setCriaturas] = useState<Criatura[]>([]);
  const [form, setForm] = useState<AvistamientoFormulario>({
    ...FORM_VACIO,
    criatura: parametros.get("criaturaId") ?? "",
  });
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    obtenerCriaturas()
      .then((lista) => {
        setCriaturas(lista);
        if (!form.criatura && lista.length > 0) {
          setForm((actual) => ({ ...actual, criatura: lista[0]._id }));
        }
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "No se pudieron cargar las criaturas."))
      .finally(() => setCargando(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);

    if (!form.criatura || !form.testigo.trim() || !form.ubicacion.trim() || !form.fecha) {
      setError("Criatura, testigo, ubicación y fecha son obligatorios.");
      return;
    }

    try {
      setGuardando(true);
      await crearAvistamiento(form);
      navigate("/avistamientos");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar el avistamiento.");
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) return <p className="py-10 text-center text-stone-500">Cargando formulario...</p>;

  return (
    <section className="mx-auto max-w-3xl">
      <div className="mb-7">
        <Link className="text-sm font-bold no-underline" to="/avistamientos">← Volver a avistamientos</Link>
        <p className="mb-2 mt-6 text-sm font-black uppercase tracking-[0.18em] text-emerald-800">Bitácora de campo</p>
        <h1 className="page-title">Registrar avistamiento</h1>
        <p className="page-description">Anota los detalles del encuentro para que el equipo pueda investigarlo.</p>
      </div>

      <form className="surface space-y-5" onSubmit={manejarEnvio}>
        {error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800" role="alert">Error: {error}</div>}
        <div>
          <label className="field-label" htmlFor="criatura">Criatura observada</label>
          <div className="select is-fullwidth">
            <select
              className="field-control"
              id="criatura"
              value={form.criatura}
              onChange={(e) => setForm({ ...form, criatura: e.target.value })}
              required
            >
              {criaturas.map((criatura) => <option key={criatura._id} value={criatura._id}>{criatura.nombre}</option>)}
            </select>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="testigo">Testigo</label>
            <input
              className="input field-control"
              id="testigo"
              type="text"
              value={form.testigo}
              onChange={(e) => setForm({ ...form, testigo: e.target.value })}
              placeholder="Nombre de quien reporta"
              required
            />
          </div>
          <div>
            <label className="field-label" htmlFor="fecha">Fecha</label>
            <input
              className="input field-control"
              id="fecha"
              type="date"
              value={form.fecha}
              onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="ubicacion">Ubicación</label>
          <input
            className="input field-control"
            id="ubicacion"
            type="text"
            value={form.ubicacion}
            onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
            placeholder="Lugar del avistamiento"
            required
          />
        </div>

        <div>
          <label className="field-label" htmlFor="descripcion">Descripción <span className="font-normal text-stone-400">(opcional)</span></label>
          <textarea
            className="textarea field-control"
            id="descripcion"
            rows={4}
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            placeholder="¿Qué ocurrió durante el encuentro?"
          />
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-stone-100 pt-5 sm:flex-row sm:justify-end">
          <Link className="button action-secondary no-underline" to="/avistamientos">Cancelar</Link>
          <button className="button action-primary" type="submit" disabled={guardando || criaturas.length === 0}>
            {guardando ? "Guardando..." : "Guardar avistamiento"}
          </button>
        </div>
      </form>
    </section>
  );
}
