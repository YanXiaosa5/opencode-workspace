function Pagination({
  currentPage,
  totalPages,
  onPageChange
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}): React.JSX.Element {
  return (
    <div className="pagination">
      <button
        className="btn-page"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        上一页
      </button>
      <span className="page-info">
        第 {currentPage} / {totalPages} 页
      </span>
      <button
        className="btn-page"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        下一页
      </button>
    </div>
  )
}

export default Pagination
