"use client";

/**
 * Reusable pagination controls.
 *
 * Props:
 *   page       - current page (1-indexed)
 *   totalPages - total number of pages
 *   total      - total number of records
 *   limit      - items per page
 *   onPageChange(newPage) - callback
 */
export default function Pagination({ page, totalPages, total, limit, onPageChange }) {
  if (totalPages <= 1) return null;

  // Generate visible page numbers (max 5 around current page)
  const getPages = () => {
    const pages = [];
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, page + 2);

    // Ensure we always show 5 pages when possible
    if (end - start < 4) {
      if (start === 1) end = Math.min(totalPages, start + 4);
      else start = Math.max(1, end - 4);
    }

    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-2">
      {/* Record info */}
      <p className="text-sm text-slate-500">
        Showing <span className="font-semibold text-slate-700">{from}–{to}</span> of{" "}
        <span className="font-semibold text-slate-700">{total}</span> results
      </p>

      {/* Page buttons */}
      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          ← Prev
        </button>

        {/* Page numbers */}
        {getPages().map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`min-w-[40px] px-3 py-2 text-sm font-semibold rounded-lg transition-all ${
              p === page
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-600 bg-white border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {p}
          </button>
        ))}

        {/* Next */}
        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
