function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="apple-error-state">
      <div className="apple-error-state__icon">
        <i className="fas fa-exclamation-circle" />
      </div>
      <h3 className="apple-error-state__title">{message}</h3>
      {onRetry && (
        <button className="apple-btn apple-btn--secondary" onClick={onRetry}>
          <i className="fas fa-redo" /> Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorState;
