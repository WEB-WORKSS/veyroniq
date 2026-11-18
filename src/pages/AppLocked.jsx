import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { Logo } from "../components/ui/Logo.jsx";

/** Shown at /app in public production builds. The application center is not shipped in this bundle. */
export default function AppLocked() {
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="card w-full max-w-md p-8 text-center">
        <div className="flex justify-center"><Logo /></div>
        <Lock className="mx-auto mt-8 size-8 text-faint" />
        <h1 className="mt-4 text-2xl font-bold">Private area</h1>
        <p className="mt-2 text-sm text-muted">This page is only available to Veyroniq administrators.</p>
        <Link to="/" className="btn btn-line mt-6">Back to home</Link>
      </div>
    </div>
  );
}
