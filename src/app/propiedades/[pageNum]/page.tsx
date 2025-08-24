"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import AdItem from "@/components/AdItem";
import Pagination from "@/components/Pagination";
import PropertySorter, { SortFilters } from "@/components/PropertySorter";
import { Post } from "@/types/postTypes";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/supabase/client";
import Loading from "@/components/Loading";

// Constants
const POSTS_PER_PAGE = 10;
const DEFAULT_FILTERS: SortFilters = {
  propertyType: "Todos",
  alquilerVenta: "Todos",
  sortBy: "Más recientes",
};

// Custom hook for URL synchronization
const useUrlSync = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const getPageFromUrl = useCallback(() => {
    return Number(pathname.match(/\d+$/)?.[0]) || 1;
  }, [pathname]);

  const getFiltersFromUrl = useCallback((): SortFilters => {
    return {
      propertyType:
        searchParams.get("propertyType") || DEFAULT_FILTERS.propertyType,
      alquilerVenta:
        searchParams.get("alquilerVenta") || DEFAULT_FILTERS.alquilerVenta,
      sortBy: searchParams.get("sortBy") || DEFAULT_FILTERS.sortBy,
    };
  }, [searchParams]);

  const updateUrl = useCallback(
    (page: number, filters: SortFilters) => {
      const params = new URLSearchParams();

      if (filters.propertyType !== DEFAULT_FILTERS.propertyType) {
        params.set("propertyType", filters.propertyType);
      }
      if (filters.alquilerVenta !== DEFAULT_FILTERS.alquilerVenta) {
        params.set("alquilerVenta", filters.alquilerVenta);
      }
      if (filters.sortBy !== DEFAULT_FILTERS.sortBy) {
        params.set("sortBy", filters.sortBy);
      }

      const queryString = params.toString();
      const url = queryString
        ? `/propiedades/${page}?${queryString}`
        : `/propiedades/${page}`;
      router.push(url);
    },
    [router]
  );

  return { getPageFromUrl, getFiltersFromUrl, updateUrl };
};

// Custom hook for data fetching
const usePostsData = () => {
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [postData, setPostData] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("posts")
          .select()
          .order("created_at", { ascending: false });

        if (error) {
          setFetchError("Could not fetch the post data");
          setPostData([]);
          console.error("Fetch error:", error);
        } else if (data) {
          setPostData(data);
          setFetchError(null);
        }
      } catch (error) {
        setFetchError("An unexpected error occurred");
        console.error("Unexpected error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { postData, fetchError, isLoading };
};

// Utility functions
const extractPrice = (message: string): number => {
  const priceMatch = message.match(/\$(\d{1,4}(,\d{3})*(\.\d{3})*(\.\d+)?)/);
  if (priceMatch) {
    return parseFloat(priceMatch[1].replace(/,/g, ""));
  }
  return 0;
};

const extractAlquilerVenta = (message: string): string | null => {
  const alquilerVentaMatch = message.match(
    /(alquil[oó]|alquiler|vendo|venta|negociable)/i
  );

  if (alquilerVentaMatch) {
    const matchValue = alquilerVentaMatch[1].toLowerCase();
    switch (matchValue) {
      case "alquilo":
      case "alquiló":
      case "alquiler":
        return "Alquiler";
      case "vendo":
      case "venta":
      case "negociable":
        return "Venta";
      default:
        return null;
    }
  }
  return null;
};

const filterByPropertyType = (posts: Post[], propertyType: string): Post[] => {
  if (propertyType === "Todos") return posts;

  return posts.filter((post) => {
    const propertyMatch = post.message.match(
      /\b(residencial|lote|bodega|casa|apartamento|terreno|local)\b/gi
    );
    if (propertyMatch && propertyMatch.length > 0) {
      const matchedType =
        propertyMatch[0].charAt(0).toUpperCase() + propertyMatch[0].slice(1);
      return matchedType === propertyType;
    }
    return false;
  });
};

const filterByAlquilerVenta = (
  posts: Post[],
  alquilerVenta: string
): Post[] => {
  if (alquilerVenta === "Todos") return posts;

  return posts.filter((post) => {
    const extractedValue = extractAlquilerVenta(post.message);
    return extractedValue === alquilerVenta;
  });
};

const sortPosts = (posts: Post[], sortBy: string): Post[] => {
  const sortedPosts = [...posts];

  switch (sortBy) {
    case "Precio: Menor a Mayor":
      return sortedPosts.sort(
        (a, b) => extractPrice(a.message) - extractPrice(b.message)
      );
    case "Precio: Mayor a Menor":
      return sortedPosts.sort(
        (a, b) => extractPrice(b.message) - extractPrice(a.message)
      );
    default: // "Más recientes" - keep original order
      return sortedPosts;
  }
};

const Propiedades = () => {
  const { getPageFromUrl, getFiltersFromUrl, updateUrl } = useUrlSync();
  const { postData, fetchError, isLoading } = usePostsData();

  const [currentPage, setCurrentPage] = useState(getPageFromUrl());
  const [sortFilters, setSortFilters] = useState<SortFilters>(
    getFiltersFromUrl()
  );

  // Sync state with URL changes
  useEffect(() => {
    const pageFromUrl = getPageFromUrl();
    const filtersFromUrl = getFiltersFromUrl();

    setCurrentPage(pageFromUrl);
    setSortFilters(filtersFromUrl);
  }, [getPageFromUrl, getFiltersFromUrl]);

  // Apply filters and sorting
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = filterByPropertyType(postData, sortFilters.propertyType);
    filtered = filterByAlquilerVenta(filtered, sortFilters.alquilerVenta);
    return sortPosts(filtered, sortFilters.sortBy);
  }, [postData, sortFilters]);

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      updateUrl(page, sortFilters);
    },
    [updateUrl, sortFilters]
  );

  // Handle filter changes
  const handleFilterChange = useCallback(
    (newFilters: SortFilters) => {
      setSortFilters(newFilters);
      setCurrentPage(1);
      updateUrl(1, newFilters);
    },
    [updateUrl]
  );

  // Calculate pagination
  const lastPostIndex = Math.min(
    currentPage * POSTS_PER_PAGE,
    filteredAndSortedPosts.length
  );
  const firstPostIndex = lastPostIndex - POSTS_PER_PAGE;
  const currentPosts = filteredAndSortedPosts.slice(
    firstPostIndex,
    lastPostIndex
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen">
      {fetchError && (
        <p className="text-red-500 text-center p-4">{fetchError}</p>
      )}

      <PropertySorter
        onSortChange={handleFilterChange}
        currentFilters={sortFilters}
      />

      <AdItem postData={currentPosts} />

      <Pagination
        totalPosts={filteredAndSortedPosts.length}
        postsPerPage={POSTS_PER_PAGE}
        setCurrentPage={handlePageChange}
        currentPage={currentPage}
      />
    </div>
  );
};

export default Propiedades;
