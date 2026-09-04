

export function BarLoader({ height = 3, color = "#2563eb" }) {
console.log(color)
console.log("hhh")
  const container = {
    position: "relative",
    width: "100%",
    overflow: "hidden",
    background: "rgba(148,163,184,0.35)",
    borderRadius: 9999,
    height,
  }

  const bar = {
    position: "absolute",
    left: "-40%",
    top: 0,
    height: "100%",
    width: "40%",
    background: `linear-gradient(90deg, rgba(191,219,254,0.1), ${color})`,
    borderRadius: 9999,
    animation: "bar-loader 1.2s ease-in-out infinite",
  }

  return (
    <>
      <style>
        {`
        @keyframes bar-loader {
          0%   { transform: translateX(0%); }
          50%  { transform: translateX(180%); }
          100% { transform: translateX(260%); }
        }
      `}
      </style>
      <div style={container}>
        <div style={bar} />
      </div>
    </>
  )
}