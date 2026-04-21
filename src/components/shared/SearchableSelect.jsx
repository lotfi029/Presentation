import { useEffect, useMemo, useRef, useState } from 'react'

export default function SearchableSelect({
  value,
  onChange,
  options,
  placeholder,
  searchPlaceholder,
  error,
  disabled,
}) {
  const containerRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [isFiltering, setIsFiltering] = useState(false)
  const selectedOption = useMemo(
    () => options.find((option) => String(option.value) === String(value)),
    [options, value],
  )
  const [query, setQuery] = useState(selectedOption?.label ?? '')

  useEffect(() => {
    setQuery(selectedOption?.label ?? '')
    setIsFiltering(false)
  }, [selectedOption])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false)
        setQuery(selectedOption?.label ?? '')
        setIsFiltering(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [selectedOption])

  const filteredOptions = useMemo(() => {
    if (!isFiltering) return options

    const normalized = query.trim().toLowerCase()
    if (!normalized) return options

    return options.filter((option) => option.label.toLowerCase().includes(normalized))
  }, [isFiltering, options, query])

  return (
    <div
      ref={containerRef}
      className={`searchable-select ${error ? 'searchable-select-error' : ''} ${
        disabled ? 'searchable-select-disabled' : ''
      }`}
    >
      <input
        className={`form-control ${error ? 'form-control-error' : ''}`}
        value={query}
        placeholder={open ? searchPlaceholder || placeholder : placeholder}
        disabled={disabled}
        onFocus={() => {
          setOpen(true)
          setIsFiltering(false)
        }}
        onChange={(event) => {
          setOpen(true)
          setIsFiltering(true)
          setQuery(event.target.value)
          if (!event.target.value) {
            onChange('')
          }
        }}
      />
      {open ? (
        <div className="searchable-select-menu">
          {filteredOptions.length ? (
            filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`searchable-select-option ${
                  String(option.value) === String(value) ? 'active' : ''
                }`}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  onChange(String(option.value))
                  setQuery(option.label)
                  setIsFiltering(false)
                  setOpen(false)
                }}
              >
                {option.label}
              </button>
            ))
          ) : (
            <div className="searchable-select-empty">{searchPlaceholder || placeholder}</div>
          )}
        </div>
      ) : null}
    </div>
  )
}
