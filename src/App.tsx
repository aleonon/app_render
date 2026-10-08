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
      <div className="site-frame">
        <header className="site-header">
          <NavLink to="/" className="site-brand">
            <span className="site-brand__mark" aria-hidden="true">B.</span>
            <span>
              <span className="site-brand__name">Bestiario</span>
              <span className="site-brand__descriptor">Pawnee · archivo de campo</span>
            </span>
          </NavLink>
          <nav aria-label="Navegación principal" className="site-nav">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `site-nav__link${isActive ? " is-active" : ""}`}
            >
              Archivo
            </NavLink>
            <NavLink
              to="/avistamientos"
              className={({ isActive }) => `site-nav__link${isActive ? " is-active" : ""}`}
            >
              Avistamientos
            </NavLink>
          </nav>
          <span className="site-header__issue">VOL. 01 / INDIANA</span>
        </header>

        <main className="site-main">
          <Routes>
            <Route path="/" element={<ListaCriaturas />} />
            <Route path="/criaturas/nueva" element={<FormularioCriatura />} />
            <Route path="/criaturas/:id" element={<DetalleCriatura />} />
            <Route path="/criaturas/:id/editar" element={<FormularioCriatura />} />
            <Route path="/avistamientos" element={<ListaAvistamientos />} />
            <Route path="/avistamientos/nuevo" element={<FormularioAvistamiento />} />
          </Routes>
        </main>

        <footer className="site-footer">
          <span>DEPARTAMENTO DE INVESTIGACIÓN · PAWNEE, INDIANA</span>
          <span>ARCHIVO DE CAMPO <b>✳</b> EST. MMXXIV</span>
        </footer>
      </div>
    </BrowserRouter>
  );
}
