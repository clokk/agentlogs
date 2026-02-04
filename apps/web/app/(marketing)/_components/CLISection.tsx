export function CLISection() {
  return (
    <section className="py-20 px-6 bg-panel-alt border-y border-border">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-primary mb-8">One command</h2>

        {/* Terminal mock */}
        <div className="bg-bg rounded-lg p-6 border border-border font-mono text-left">
          <div className="flex items-center gap-2 mb-4 text-muted">
            <span className="w-3 h-3 rounded-full bg-chronicle-red"></span>
            <span className="w-3 h-3 rounded-full bg-chronicle-amber"></span>
            <span className="w-3 h-3 rounded-full bg-chronicle-green"></span>
            <span className="ml-2">Terminal</span>
          </div>

          <div className="space-y-2">
            <p>
              <span className="text-chronicle-green">$</span>{" "}
              <span className="text-primary">tuhnr push</span>
            </p>
            <p className="text-muted">Scanning sessions...</p>
            <p className="text-chronicle-green">
              Pushed 3 commits to cloud
            </p>
          </div>
        </div>

        <p className="text-muted mt-6">
          Install with{" "}
          <code className="text-chronicle-blue bg-panel px-2 py-1 rounded font-mono">
            npm i -g tuhnr
          </code>
        </p>
      </div>
    </section>
  );
}
