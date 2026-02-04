const oranges = [
  { name: "Current", hex: "#e07b39", desc: "Burnt orange" },
  { name: "Brighter", hex: "#e88a4d", desc: "More pop" },
  { name: "Warmer", hex: "#d68545", desc: "Golden amber" },
  { name: "Bolder", hex: "#ea7e35", desc: "More saturated" },
];

export function ColorComparison() {
  return (
    <section className="py-12 px-6 bg-bg border-y border-border">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-xl font-bold text-primary mb-6 text-center">
          Orange Comparison
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {oranges.map((color) => (
            <div key={color.hex} className="text-center">
              {/* Swatch */}
              <div
                className="w-full h-20 rounded-lg mb-3"
                style={{ backgroundColor: color.hex }}
              />
              {/* Button preview */}
              <button
                className="w-full py-2 rounded-lg font-semibold text-black mb-2"
                style={{ backgroundColor: color.hex }}
              >
                Start tracking
              </button>
              {/* Label */}
              <p className="text-primary font-medium">{color.name}</p>
              <p className="text-muted text-sm">{color.hex}</p>
              <p className="text-subtle text-xs">{color.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
