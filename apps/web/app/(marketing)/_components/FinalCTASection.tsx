import Link from "next/link";

export function FinalCTASection() {
  return (
    <section className="py-24 px-6 bg-panel border-t border-border">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-primary mb-4">
          Start your journey
        </h2>
        <p className="text-lg text-muted mb-8">
          Free forever. Open source. Your first streak starts now.
        </p>

        <Link
          href="/login"
          className="inline-flex px-8 py-4 bg-accent text-black rounded-lg font-medium text-lg hover:bg-accent-hover transition-colors"
        >
          Start tracking free
        </Link>

        <p className="text-sm text-subtle mt-4">No credit card required</p>
      </div>
    </section>
  );
}
