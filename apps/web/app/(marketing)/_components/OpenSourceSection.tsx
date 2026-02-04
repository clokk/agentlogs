export function OpenSourceSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Fully Open Source */}
          <div className="bg-panel rounded-lg p-6 border border-border text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-chronicle-green/20 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-chronicle-green"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">
              Fully Open Source
            </h3>
            <p className="text-muted text-sm">
              MIT licensed. Read every line. Fork it, extend it, make it yours.
            </p>
          </div>

          {/* Your Data, Verified */}
          <div className="bg-panel rounded-lg p-6 border border-border text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-chronicle-blue/20 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-chronicle-blue"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">
              Your Data, Verified
            </h3>
            <p className="text-muted text-sm">
              Self-host or use our cloud. Export anytime. No lock-in.
            </p>
          </div>

          {/* Built in Public */}
          <div className="bg-panel rounded-lg p-6 border border-border text-center sm:col-span-2 md:col-span-1">
            <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-chronicle-purple/20 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-chronicle-purple"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">
              Built in Public
            </h3>
            <p className="text-muted text-sm">
              Star us, watch the roadmap, contribute PRs.
            </p>
            <a
              href="https://github.com/clokk/tuhnr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-chronicle-purple hover:underline mt-3"
            >
              View repository →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
