export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden print:hidden" aria-hidden="true">
      <div
        className="absolute -top-1/4 -left-1/4 h-[60vw] w-[60vw] max-w-[600px] max-h-[600px] rounded-full opacity-[0.10] blur-3xl"
        style={{ background: '#0B6E4F', animation: 'derive-lente-1 22s ease-in-out infinite' }}
      />
      <div
        className="absolute top-1/3 -right-1/4 h-[50vw] w-[50vw] max-w-[500px] max-h-[500px] rounded-full opacity-[0.08] blur-3xl"
        style={{ background: '#E8A33D', animation: 'derive-lente-2 26s ease-in-out infinite' }}
      />
      <div
        className="absolute bottom-0 left-1/4 h-[45vw] w-[45vw] max-w-[450px] max-h-[450px] rounded-full opacity-[0.08] blur-3xl"
        style={{ background: '#2B3A67', animation: 'derive-lente-3 30s ease-in-out infinite' }}
      />
    </div>
  );
}
