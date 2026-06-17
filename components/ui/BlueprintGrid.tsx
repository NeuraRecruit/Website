export function BlueprintGrid() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-[0.06]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(46,107,255,0.4) 1px, transparent 1px),
          linear-gradient(90deg, rgba(46,107,255,0.4) 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
      }}
    />
  );
}
