function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
        padding: "40px 20px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          background: "#fef2f2",
          color: "#dc2626",
          fontSize: 24,
          marginBottom: 16,
        }}
      >
        <i className="fas fa-exclamation-circle" />
      </div>
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-lead)",
          fontWeight: "var(--text-lead-weight)",
          color: "var(--color-ink)",
          margin: "0 0 8px",
        }}
      >
        {message}
      </h3>
      {onRetry && (
        <button
          className="apple-btn apple-btn--secondary"
          onClick={onRetry}
          style={{ marginTop: 16 }}
        >
          <i className="fas fa-redo" style={{ marginRight: 6 }} /> Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorState;
