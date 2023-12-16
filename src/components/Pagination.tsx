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
  let pages = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pages.push(i);
  }

  return (
    <nav className="text-center" aria-label="Page navigation">
      <ul className="inline-flex items-center -space-x-px">
        <li>
          <Link
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            href={`/propiedades/${
              currentPage > 1 ? currentPage - 1 : currentPage
            }`}
            className={`
            dark:bg-neutral-700 dark:text-white dark:border-neutral-400 dark:hover:bg-neutral-600
            text-gray-500 border-gray-300 hover:bg-gray-100 hover:text-gray-700
            block px-3 py-2 ml-0 leading-tight bg-white border rounded-l-lg `}
          >
            <span className="sr-only">Previous</span>
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </Link>
        </li>
        {pages.map((page, index) => (
          <li key={index}>
            <Link
              onClick={() => setCurrentPage(page)}
              href={`/propiedades/${page}`}
              className={`px-3 py-2 leading-tight
              ${
                page === currentPage
                  ? `dark:text-orange-500 dark:border-white dark:hover:text-orange-500 dark:bg-neutral-700
                     text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-70 font-bold`
                  : `dark:text-neutral-400 dark:border-neutral-400 dark:hover:text-orange-500 dark:bg-neutral-700
                     text-gray-500 border-gray-300 hover:bg-gray-100 hover:text-gray-700 bg-white border`
              }`}
            >
              {page}
            </Link>
          </li>
        ))}
        <li>
          <Link
            onClick={() =>
              currentPage < Math.ceil(totalPosts / postsPerPage) &&
              setCurrentPage(currentPage + 1)
            }
            href={`/propiedades/${
              currentPage < Math.ceil(totalPosts / postsPerPage)
                ? currentPage + 1
                : currentPage
            }`}
            className={`
            dark:bg-neutral-700 dark:text-white dark:border-neutral-400 dark:hover:bg-neutral-600
            text-gray-500 border-gray-300 hover:bg-gray-100 hover:text-gray-700
            block px-3 py-2 ml-0 leading-tight bg-white border rounded-r-lg `}
          >
            <span className="sr-only">Next</span>
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
