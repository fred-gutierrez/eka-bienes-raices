import Link from "next/link";

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
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const pageRange = 7;
  let pages: number[] = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  const renderPageLinks = () => {
    const buttons = [];
    const halfPageRange = Math.floor(pageRange / 2);
    const startPage =
      currentPage - halfPageRange > 0 ? currentPage - halfPageRange : 1;
    const endPage =
      startPage + pageRange - 1 <= totalPages
        ? startPage + pageRange - 1
        : totalPages;

    const adjustedStartPage =
      startPage > totalPages - pageRange ? totalPages - pageRange + 1 : startPage;

    for (let i = adjustedStartPage; i <= endPage; i++) {
      buttons.push(
        <Link
          key={i}
          onClick={() => setCurrentPage(i)}
          href={`/propiedades/${i}`}
          className={`px-3 py-2.5 leading-tight h-10
            ${i === currentPage
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
          href={`/propiedades/${currentPage > 1 ? currentPage - 1 : currentPage
            }`}
          className={`
            dark:bg-neutral-700 dark:text-white dark:border-neutral-400 dark:hover:bg-neutral-600
            text-gray-500 border-gray-300 hover:bg-gray-100 hover:text-gray-700
            block px-4 py-2.5 h-10 leading-tight bg-white border rounded-l-lg`}
        >
          <span className="sr-only">Previous</span>
          <i className="fa-solid fa-chevron-left"></i>
        </Link>

        {renderPageLinks()}

        {/* {pages.map((page, index) => ( */}
        {/*   <Link */}
        {/*     key={index} */}
        {/*     onClick={() => setCurrentPage(page)} */}
        {/*     href={`/propiedades/${page}`} */}
        {/*     className={`px-3 py-2.5 leading-tight h-10 */}
        {/*       ${page === currentPage */}
        {/*         ? `dark:text-orange-500 dark:border-orange-500 dark:bg-orange-900 dark:hover:bg-orange-800 */}
        {/*              text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-70 font-bold` */}
        {/*         : `dark:text-neutral-400 dark:border-neutral-400 dark:hover:text-orange-500 dark:bg-neutral-700 */}
        {/*              text-gray-500 border-gray-300 hover:bg-gray-100 hover:text-gray-700 bg-white border` */}
        {/*       }`} */}
        {/*   > */}
        {/*     {page} */}
        {/*   </Link> */}
        {/* ))} */}

        <Link
          onClick={() =>
            currentPage < Math.ceil(totalPosts / postsPerPage) &&
            setCurrentPage(currentPage + 1)
          }
          href={`/propiedades/${currentPage < Math.ceil(totalPosts / postsPerPage)
            ? currentPage + 1
            : currentPage
            }`}
          className={`
            dark:bg-neutral-700 dark:text-white dark:border-neutral-400 dark:hover:bg-neutral-600
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
