import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="container-page flex flex-col items-center py-24 text-center">
      <p className="font-serif text-7xl font-bold text-brand-700">404</p>
      <h1 className="mt-4 text-2xl font-bold">We can't find that page</h1>
      <p className="mt-2 text-muted">The link may be broken or the page may have moved.</p>
      <Link to="/" className="btn-primary mt-6">
        Go to courses
      </Link>
    </div>
  );
}
