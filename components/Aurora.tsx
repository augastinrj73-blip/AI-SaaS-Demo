"use client";

/**
 * Aurora — five independent animated gradient blobs that produce a
 * living, breathing northern-lights effect across the full viewport.
 * Each blob uses a different colour, size, duration, and keyframe path
 * so the overlapping gradients shift and mix organically.
 */
export default function Aurora() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {/* Blob 1 – indigo, top-left */}
      <div
        className="aurora-1 absolute"
        style={{
          top: "-15%",
          left: "-10%",
          width: "70vw",
          height: "70vw",
          maxWidth: 900,
          maxHeight: 900,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(99,102,241,0.14) 0%, rgba(99,102,241,0.06) 40%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Blob 2 – violet, top-right */}
      <div
        className="aurora-2 absolute"
        style={{
          top: "-5%",
          right: "-15%",
          width: "65vw",
          height: "65vw",
          maxWidth: 850,
          maxHeight: 850,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(139,92,246,0.13) 0%, rgba(139,92,246,0.05) 45%, transparent 70%)",
          filter: "blur(90px)",
        }}
      />

      {/* Blob 3 – fuchsia, centre */}
      <div
        className="aurora-3 absolute"
        style={{
          top: "25%",
          left: "30%",
          width: "55vw",
          height: "45vw",
          maxWidth: 700,
          maxHeight: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(217,70,239,0.09) 0%, rgba(217,70,239,0.03) 50%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      {/* Blob 4 – cyan, bottom-right */}
      <div
        className="aurora-4 absolute"
        style={{
          bottom: "5%",
          right: "-5%",
          width: "55vw",
          height: "55vw",
          maxWidth: 750,
          maxHeight: 750,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(6,182,212,0.09) 0%, rgba(6,182,212,0.03) 45%, transparent 70%)",
          filter: "blur(85px)",
        }}
      />

      {/* Blob 5 – indigo-violet, bottom-left (accent) */}
      <div
        className="aurora-5 absolute"
        style={{
          bottom: "-10%",
          left: "5%",
          width: "45vw",
          height: "45vw",
          maxWidth: 600,
          maxHeight: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(79,70,229,0.11) 0%, rgba(124,58,237,0.04) 50%, transparent 70%)",
          filter: "blur(75px)",
        }}
      />

      {/* Subtle vignette to keep edges dark */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, rgba(3,3,5,0.7) 100%)",
        }}
      />
    </div>
  );
}
