import { useEffect, useMemo, useState } from 'react'
import Button from './Button'
import { useLanguage } from '../../hooks/useLanguage'

export default function Table({
  columns,
  data,
  emptyMessage,
  renderRow,
  pageSizeOptions = [10, 25, 50],
  initialPageSize = 10,
}) {
  const { language } = useLanguage()
  const defaultPageSize = pageSizeOptions.includes(initialPageSize)
    ? initialPageSize
    : pageSizeOptions[0]
  const [pageSize, setPageSize] = useState(defaultPageSize)
  const [currentPage, setCurrentPage] = useState(1)
  const rowsLabel = language === 'ar' ? 'الصفوف' : 'Rows'
  const prevLabel = language === 'ar' ? 'السابق' : 'Prev'
  const nextLabel = language === 'ar' ? 'التالي' : 'Next'

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize))
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return data.slice(startIndex, startIndex + pageSize)
  }, [currentPage, data, pageSize])

  useEffect(() => {
    setCurrentPage(1)
  }, [data, pageSize])

  return (
    <div className="table-stack">
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length ? (
              paginatedData.map(renderRow)
            ) : (
              <tr>
                <td colSpan={columns.length} className="table-empty">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {data.length ? (
        <div className="table-pagination">
          <div className="table-pagination-summary">
            {`${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, data.length)} / ${data.length}`}
          </div>
          <div className="table-pagination-controls">
            <label className="table-page-size">
              <span>{rowsLabel}</span>
              <select
                className="form-control"
                value={pageSize}
                onChange={(event) => setPageSize(Number(event.target.value))}
              >
                {pageSizeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <Button
              type="button"
              variant="ghost"
              className="btn-sm"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
            >
              {prevLabel}
            </Button>
            <span className="table-page-indicator">{`${currentPage} / ${totalPages}`}</span>
            <Button
              type="button"
              variant="ghost"
              className="btn-sm"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
            >
              {nextLabel}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
