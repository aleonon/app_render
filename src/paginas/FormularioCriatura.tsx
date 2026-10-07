/**
 * paginas/FormularioCriatura.tsx
 * ----------------------------------
 * Un solo componente para CREAR y EDITAR, según la ruta.
 */

import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { crearCriatura, actualizarCriatura, obtenerCriaturaPorId } from "../api/criaturasApi";
import { CriaturaFormulario, TIPOS_CRIATURA, ESTADOS_INVESTIGACION } from "../tipos";

const FORM_VACIO: CriaturaFormulario = {
  nombre: "",
  tipo: "mitica",
  habilidades: [],
  nivelPeligro: 5,
  estado: "activa",
};

export function FormularioCriatura() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const esEdicion = Boolean(id);

  const [form, setForm] = useState<CriaturaFormulario>(FORM_VACIO);
  const [habilidadesTexto, setHabilidadesTexto] = useState("");
  const [cargando, setCargando] = useState(esEdicion);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    obtenerCriaturaPorId(id)
      .then((criatura) => {
        setForm({
          nombre: criatura.nombre,
          tipo: criatura.tipo,
          habilidades: criatura.habilidades,
          nivelPeligro: criatura.nivelPeligro,
          estado: criatura.estado,
        });
        setHabilidadesTexto(criatura.habilidades.join(", "));
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "No se pudo cargar la criatura."))
      .finally(() => setCargando(false));
  }, [id]);

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);

    if (!form.nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }

    const datosAEnviar: CriaturaFormulario = {
      ...form,
      habilidades: habilidadesTexto
        .split(",")
        .map((h) => h.trim())
        .filter((h) => h.length > 0),
    };

    try {
      setGuardando(true);
      if (esEdicion && id) {
        await actualizarCriatura(id, datosAEnviar);
      } else {
        await crearCriatura(datosAEnviar);
      }
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la criatura.");
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) return <p className="py-10 text-center text-stone-500">Cargando datos de la criatura...</p>;

  return (
    <section className="mx-auto max-w-3xl">
      <div className="mb-7">
        <Link className="text-sm font-bold no-underline" to="/">← Volver a criaturas</Link>
        <p className="mb-2 mt-6 text-sm font-black uppercase tracking-[0.18em] text-emerald-800">Expediente de campo</p>
        <h1 className="page-title">{esEdicion ? "Editar criatura" : "Registrar criatura"}</h1>
        <p className="page-description">Completa los datos para mantener actualizado el archivo de Pawnee.</p>
      </div>

      <form className="surface space-y-5" onSubmit={manejarEnvio}>
        {error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800" role="alert">Error: {error}</div>}
        <div>
          <label className="field-label" htmlFor="nombre">Nombre</label>
          <input
            className="input field-control"
            id="nombre"
            type="text"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            placeholder="Ej. Criatura del bosque"
            required
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="tipo">Tipo</label>
            <div className="select is-fullwidth">
              <select
                className="field-control"
                id="tipo"
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value as CriaturaFormulario["tipo"] })}
              >
                {TIPOS_CRIATURA.map((tipo) => <option key={tipo} value={tipo}>{tipo}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="field-label" htmlFor="estado">Estado de investigación</label>
            <div className="select is-fullwidth">
              <select
                className="field-control"
                id="estado"
                value={form.estado}
                onChange={(e) => setForm({ ...form, estado: e.target.value as CriaturaFormulario["estado"] })}
              >
                {ESTADOS_INVESTIGACION.map((estado) => <option key={estado} value={estado}>{estado}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="habilidades">Habilidades</label>
          <input
            className="input field-control"
            id="habilidades"
            type="text"
            value={habilidadesTexto}
            onChange={(e) => setHabilidadesTexto(e.target.value)}
            placeholder="Separadas por comas"
          />
        </div>

        <div>
          <label className="field-label" htmlFor="nivelPeligro">Nivel de peligro: {form.nivelPeligro} / 10</label>
          <input
            className="w-full accent-emerald-800"
            id="nivelPeligro"
            type="range"
            min={1}
            max={10}
            value={form.nivelPeligro}
            onChange={(e) => setForm({ ...form, nivelPeligro: Number(e.target.value) })}
          />
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-stone-100 pt-5 sm:flex-row sm:justify-end">
          <Link className="button action-secondary no-underline" to="/">Cancelar</Link>
          <button className="button action-primary" type="submit" disabled={guardando}>
            {guardando ? "Guardando..." : esEdicion ? "Guardar cambios" : "Crear criatura"}
          </button>
        </div>
      </form>
    </section>
  );
}
