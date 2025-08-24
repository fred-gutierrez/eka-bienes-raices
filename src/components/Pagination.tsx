import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Props {
  totalPosts: number;
  postsPerPage: number;
  setCurrentPage: any;
  currentPage: number;
}

export default function Pagination({
  postsPerPage,
  totalPosts,
  setCurrentPage,
  currentPage,
}: Props) {
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const pageRange = 7;

  // Don't render pagination if there's only 1 page or no posts
  if (totalPages <= 1) {
    return null;
  }

  let pages: number[] = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  // Helper function to build URL with current filters (without page param)
  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page"); // Remove the page parameter
    const queryString = params.toString();
    return queryString
      ? `/propiedades/${page}?${queryString}`
      : `/propiedades/${page}`;
  };

  const renderPageLinks = () => {
    const buttons = [];
    const halfPageRange = Math.floor(pageRange / 2);

    // Calculate start and end pages
    let startPage = Math.max(1, currentPage - halfPageRange);
    let endPage = Math.min(totalPages, startPage + pageRange - 1);

    // Adjust start page if near the end
    if (endPage - startPage + 1 < pageRange) {
      startPage = Math.max(1, endPage - pageRange + 1);
    }

    startPage = Math.max(1, startPage);
    endPage = Math.min(totalPages, endPage);

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Link
          key={i}
          onClick={() => setCurrentPage(i)}
          href={buildPageUrl(i)}
          className={`px-3 py-2.5 leading-tight h-10
            ${
              i === currentPage
                ? `dark:text-orange-500 dark:border-orange-500 dark:bg-orange-900 dark:hover:bg-orange-800
                 text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-70 font-bold`
                : `dark:text-neutral-400 dark:border-neutral-400 dark:hover:text-orange-500 dark:bg-neutral-700
                 text-gray-500 border-gray-300 hover:bg-gray-100 hover:text-gray-700 bg-white border`
            }`}
        >
          {i}
        </Link>
      );
    }

    return buttons;
  };

  return (
    <nav className="text-center" aria-label="Page navigation">
      <div className="flex items-center justify-center">
        <Link
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          href={
            currentPage > 1
              ? buildPageUrl(currentPage - 1)
              : buildPageUrl(currentPage)
          }
          className={`
            dark:bg-neutral-700 dark:text-white dark:border-neutral-400 dark:hover:bg-neutral-600
            text-gray-500 border-gray-300 hover:bg-gray-100 hover:text-gray-700
            block px-4 py-2.5 h-10 leading-tight bg-white border rounded-l-lg`}
        >
          <span className="sr-only">Previous</span>
          <i className="fa-solid fa-chevron-left"></i>
        </Link>

        {renderPageLinks()}

        <Link
          onClick={() =>
            currentPage < totalPages && setCurrentPage(currentPage + 1)
          }
          href={
            currentPage < totalPages
              ? buildPageUrl(currentPage + 1)
              : buildPageUrl(currentPage)
          }
          className={`
            dark:text-neutral-400 dark:border-neutral-400 dark:hover:text-orange-500 dark:bg-neutral-700
            text-gray-500 border-gray-300 hover:bg-gray-100 hover:text-gray-700
            block px-4 py-2.5 h-10 leading-tight bg-white border rounded-r-lg`}
        >
          <span className="sr-only">Next</span>
          <i className="fa-solid fa-chevron-right"></i>
        </Link>
      </div>
    </nav>
  );
}
