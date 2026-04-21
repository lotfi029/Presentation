export default function Button({
  children,
  className = '',
  variant = 'default',
  type = 'button',
  ...props
}) {
  return (
    <button type={type} className={`btn btn-${variant} ${className}`.trim()} {...props}>
      {children}
    </button>
  )
}
