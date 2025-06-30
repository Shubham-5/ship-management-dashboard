import type { Ship } from '../../../../store/shipStore';
import type { FilterState } from '../../types';

export interface JobFiltersProps {
  filters: FilterState;
  ships: Ship[];
  onFilterChange: (field: keyof FilterState) => (event: { target: { value: string } }) => void;
  onClearFilters: () => void;
}
