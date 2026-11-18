import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="wrap grid min-h-[60vh] place-items-center py-24 text-center">
      <div>
        <p className="font-mono text-sm text-cyan">404</p>
        <h1 className="mt-3 text-4xl font-extrabold">This page doesn't exist.</h1>
        <p className="mt-3 text-muted">The link may be broken or the page may have moved.</p>
        <div className="mt-8 flex justify-center gap-3"><Link to="/" className="btn btn-primary">Back to home</Link><Link to="/#contact" className="btn btn-line">Contact us</Link></div>
      </div>
    </section>
  );
}
