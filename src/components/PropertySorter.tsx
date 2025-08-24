interface PropertySorterProps {
  onSortChange: (filters: SortFilters) => void;
  currentFilters: SortFilters;
}

export interface SortFilters {
  propertyType: string;
  alquilerVenta: string;
  sortBy: string;
}

const PROPERTY_TYPES = [
  "Todos",
  "Casa",
  "Apartamento",
  "Bodega",
  "Residencial",
  "Local",
  "Terreno",
] as const;

const ALQUILER_VENTA_OPTIONS = ["Todos", "Alquiler", "Venta"] as const;

const SORT_OPTIONS = [
  "Más recientes",
  "Precio: Menor a Mayor",
  "Precio: Mayor a Menor",
] as const;

const DEFAULT_FILTERS: SortFilters = {
  propertyType: "Todos",
  alquilerVenta: "Todos",
  sortBy: "Más recientes",
};

export default function PropertySorter({
  onSortChange,
  currentFilters,
}: PropertySorterProps) {
  const handleFilterChange = (filterType: keyof SortFilters, value: string) => {
    const newFilters = { ...currentFilters, [filterType]: value };
    onSortChange(newFilters);
  };

  const handleClearFilters = () => {
    onSortChange(DEFAULT_FILTERS);
  };

  return (
    <div className="position-sticky bg-neutral-50 border-2 border-gray-200 shadow-md rounded-lg p-4 m-5 lg:mx-auto max-w-screen-lg">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Property Type Filter */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Propiedad
          </label>
          <select
            value={currentFilters.propertyType}
            onChange={(e) => handleFilterChange("propertyType", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Alquiler/Venta Filter */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Transacción
          </label>
          <select
            value={currentFilters.alquilerVenta}
            onChange={(e) =>
              handleFilterChange("alquilerVenta", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {ALQUILER_VENTA_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By Filter */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ordenar por
          </label>
          <select
            value={currentFilters.sortBy}
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button */}
        <div className="flex items-end">
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 bg-red-500 text-white font-bold rounded-md hover:bg-red-600 transition-colors"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>
    </div>
  );
}
