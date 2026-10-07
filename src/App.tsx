/**
 * App.tsx
 * -------
 * Configura las 6 rutas de React Router.
 */

import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import { ListaCriaturas } from "./paginas/ListaCriaturas";
import { DetalleCriatura } from "./paginas/DetalleCriatura";
import { FormularioCriatura } from "./paginas/FormularioCriatura";
import { ListaAvistamientos } from "./paginas/ListaAvistamientos";
import { FormularioAvistamiento } from "./paginas/FormularioAvistamiento";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        <header className="border-b border-stone-200 bg-white/90">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <NavLink to="/" className="flex items-center gap-3 no-underline">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-800 text-xl text-white">P</span>
              <span>
                <span className="block text-lg font-black tracking-tight text-stone-900">Pawnee</span>
                <span className="block text-xs font-medium uppercase tracking-[0.18em] text-stone-500">Archivo de campo</span>
              </span>
            </NavLink>
            <nav aria-label="Navegación principal" className="flex gap-2">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `rounded-xl px-4 py-2 text-sm font-bold no-underline transition ${
                    isActive ? "bg-emerald-50 text-emerald-900" : "text-stone-600 hover:bg-stone-100"
                  }`
                }
              >
                Criaturas
              </NavLink>
              <NavLink
                to="/avistamientos"
                className={({ isActive }) =>
                  `rounded-xl px-4 py-2 text-sm font-bold no-underline transition ${
                    isActive ? "bg-emerald-50 text-emerald-900" : "text-stone-600 hover:bg-stone-100"
                  }`
                }
              >
                Avistamientos
              </NavLink>
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:py-14">
          <Routes>
            <Route path="/" element={<ListaCriaturas />} />
            <Route path="/criaturas/nueva" element={<FormularioCriatura />} />
            <Route path="/criaturas/:id" element={<DetalleCriatura />} />
            <Route path="/criaturas/:id/editar" element={<FormularioCriatura />} />
            <Route path="/avistamientos" element={<ListaAvistamientos />} />
            <Route path="/avistamientos/nuevo" element={<FormularioAvistamiento />} />
          </Routes>
        </main>

        <footer className="border-t border-stone-200 bg-white">
          <div className="mx-auto max-w-6xl px-5 py-5 text-sm text-stone-500">
            Departamento de Investigación · Pawnee, Indiana
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
