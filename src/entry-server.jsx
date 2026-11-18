import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import Home from "./pages/Home.jsx";
import Privacy from "./pages/Privacy.jsx";
import Terms from "./pages/Terms.jsx";
import { Header } from "./components/layout/Header.jsx";
import { Footer } from "./components/layout/Footer.jsx";
import { AuthProvider } from "./hooks/useAuth.jsx";
import { ToastProvider } from "./hooks/useToast.jsx";

const PAGES = { "/": Home, "/privacy": Privacy, "/terms": Terms };

/** Renders a public route to static HTML for crawlers (used by scripts/prerender.mjs). */
export function render(path) {
  const Page = PAGES[path];
  return renderToString(
    <StaticRouter location={path}>
      <AuthProvider><ToastProvider>
        <Header /><main id="main"><Page /></main><Footer />
      </ToastProvider></AuthProvider>
    </StaticRouter>
  );
}
