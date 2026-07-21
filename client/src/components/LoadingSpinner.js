function LoadingSpinner({ text = "Loading...", fullPage = false }) {
  const style = fullPage
    ? { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh" }
    : { display: "flex", justifyContent: "center", alignItems: "center", padding: "60px 0" };

  return (
    <div style={style}>
      <div className="text-center">
        <div
          className="spinner-border text-primary mb-3"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted">{text}</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;
