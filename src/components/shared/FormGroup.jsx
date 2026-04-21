export default function FormGroup({ label, error, actions, children, required }) {
  return (
    <div className="form-group">
      {(label || actions) && (
        <div className="form-group-header">
          {label ? (
            <label className="form-label">
              {label}
              {required ? <span className="required"> *</span> : null}
            </label>
          ) : (
            <span />
          )}
          {actions}
        </div>
      )}
      {children}
      {error ? <div className="form-error">{error}</div> : null}
    </div>
  )
}
