function LoadingSpinner({ text = "Loading...", fullPage = false }) {
  return (
    <div
      className="apple-loading"
      style={{
        minHeight: fullPage ? "70vh" : "200px",
      }}
    >
      <div className="text-center">
        <div className="apple-spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
        <p className="apple-loading__text">{text}</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;
