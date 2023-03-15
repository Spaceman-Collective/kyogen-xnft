export const GamePausedScreen = () => {
    return  <div
    className="flex"
    style={{
      width: "100vw",
      height: "100vh",
      background: "#323232d3",
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 60,
    }}
  >
    <p className="mx-auto my-auto font-extrabold uppercase text-6xl">
      Game Paused
    </p>
  </div>
}