export function VideoFeed() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: "rgba(4,3,14,0.85)",
      }}
    >
      {/* Subtle scan lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(139,92,246,0.03) 0px, rgba(139,92,246,0.03) 1px, transparent 1px, transparent 4px)",
        }}
      />

      {/* Corner brackets */}
      {[
        {
          top: 18,
          left: 18,
          borderTop: "1.5px solid var(--border-orange)",
          borderLeft: "1.5px solid var(--border-orange)",
        },
        {
          top: 18,
          right: 18,
          borderTop: "1.5px solid var(--border-orange)",
          borderRight: "1.5px solid var(--border-orange)",
        },
        {
          bottom: 18,
          left: 18,
          borderBottom: "1.5px solid var(--border-orange)",
          borderLeft: "1.5px solid var(--border-orange)",
        },
        {
          bottom: 18,
          right: 18,
          borderBottom: "1.5px solid var(--border-orange)",
          borderRight: "1.5px solid var(--border-orange)",
        },
      ].map((s, i) => (
        <div
          key={i}
          style={{ position: "absolute", width: 16, height: 16, ...s }}
        />
      ))}

      {/* LIVE badge */}
      <div
        style={{
          position: "absolute",
          top: 22,
          left: 22,
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          gap: 7,
          background: "rgba(7,5,26,0.80)",
          border: "1px solid rgba(139,92,246,0.35)",
          padding: "5px 12px",
          borderRadius: 99,
        }}
      >
        <span
          style={{ position: "relative", display: "flex", width: 6, height: 6 }}
        >
          <span
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: "var(--violet)",
              opacity: 0.6,
              animation: "ping 1.4s cubic-bezier(0,0,0.2,1) infinite",
            }}
          />
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--violet)",
              position: "relative",
            }}
          />
        </span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: "var(--violet)",
            letterSpacing: "0.14em",
          }}
        >
          LIVE
        </span>
      </div>

      {/* Placeholder text */}
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <p
          style={{
            fontSize: 13,
            color: "rgba(139,92,246,0.15)",
            letterSpacing: "0.3em",
          }}
        >
          NO SIGNAL
        </p>
        <p
          style={{
            fontSize: 9,
            color: "rgba(139,92,246,0.08)",
            letterSpacing: "0.12em",
          }}
        >
          awaiting camera feed
        </p>
      </div>
    </div>
  );
}
