import { Component, lazy, Suspense, useEffect } from "react";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import { Header } from "./components/layout/Header.jsx";
import { Footer } from "./components/layout/Footer.jsx";
import { Spinner } from "./components/ui/primitives.jsx";
import { useSeo } from "./hooks/useSeo.js";
import Home from "./pages/Home.jsx";
import Privacy from "./pages/Privacy.jsx";
import Terms from "./pages/Terms.jsx";
import NotFound from "./pages/NotFound.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";

const Onboarding = lazy(() => import("./pages/Onboarding.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
// Public company & AWS Activate information page.
const ApplicationCenter = lazy(() => import("./pages/ApplicationCenter.jsx"));

class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="wrap py-32 text-center">
        <h1 className="text-2xl font-bold">Something went wrong.</h1>
        <p className="mt-2 text-muted">Please reload the page. If it keeps happening, email us.</p>
        <button className="btn btn-primary mt-6" onClick={() => location.reload()}>Reload</button>
      </div>
    );
  }
}

function Site() {
  return (<><a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-blue focus:px-4 focus:py-2">Skip to content</a><Header /><main id="main"><Outlet /></main><Footer /></>);
}

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useSeo(pathname);
  useEffect(() => {
    if (hash) { const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" }), 40); return () => clearTimeout(t); }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

const Loading = () => <div className="grid min-h-[60vh] place-items-center text-muted"><Spinner className="size-6" /></div>;

export default function App() {
  return (
    <ErrorBoundary>
      <ScrollManager />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<Site />}>
            <Route path="/" element={<Home />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/app" element={<ApplicationCenter />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
