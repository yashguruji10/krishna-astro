export default function SaturnLoader({ label }) {
  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center gap-4 bg-cream/90 backdrop-blur-sm">
      <div className="saturn-loader-wrap">
        <div className="saturn-loader">
          <div className="ring" />
          <div className="planet" />
        </div>
      </div>
      <p className="text-maroon font-semibold text-sm tracking-wide">
        {label || '🪐 Loading...'}
      </p>
    </div>
  );
}
