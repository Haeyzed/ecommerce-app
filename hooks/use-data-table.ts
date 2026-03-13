import {
  type ColumnFiltersState,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  type TableState,
  type Updater,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  type SingleParser,
  type UseQueryStateOptions,
  useQueryState,
  useQueryStates,
} from "nuqs"
import * as React from "react"

import { useDebouncedCallback } from "@/hooks/use-debounced-callback"
import { toLocalYYYYMMDD } from "@/lib/format"
import { getSortingStateParser } from "@/lib/parsers"
import type { ExtendedColumnSort, QueryKeys } from "@/types/data-table"

const PAGE_KEY = "page"
const PER_PAGE_KEY = "perPage"
const SORT_KEY = "sort"
const FILTERS_KEY = "filters"
const JOIN_OPERATOR_KEY = "joinOperator"
const ARRAY_SEPARATOR = ","
const DEBOUNCE_MS = 300
const THROTTLE_MS = 50
const DATE_RANGE_START_KEY = "start_date"
const DATE_RANGE_END_KEY = "end_date"

function dateRangeValueToYYYYMMDD(value: unknown): [string | null, string | null] {
  if (!value || !Array.isArray(value)) return [null, null]
  const from = value[0] != null ? new Date(Number(value[0])) : null
  const to = value[1] != null ? new Date(Number(value[1])) : null
  if (!from?.getTime() || !to?.getTime()) return [null, null]
  return [toLocalYYYYMMDD(from), toLocalYYYYMMDD(to)]
}

interface UseDataTableProps<TData>
  extends
    Omit<
      TableOptions<TData>,
      | "state"
      | "pageCount"
      | "getCoreRowModel"
      | "manualFiltering"
      | "manualPagination"
      | "manualSorting"
    >,
    Required<Pick<TableOptions<TData>, "pageCount">> {
  initialState?: Omit<Partial<TableState>, "sorting"> & {
    sorting?: ExtendedColumnSort<TData>[]
  }
  queryKeys?: Partial<QueryKeys>
  history?: "push" | "replace"
  debounceMs?: number
  throttleMs?: number
  clearOnDefault?: boolean
  enableAdvancedFilter?: boolean
  scroll?: boolean
  shallow?: boolean
  startTransition?: React.TransitionStartFunction
}

export function useDataTable<TData>(props: UseDataTableProps<TData>) {
  const {
    columns,
    pageCount = -1,
    initialState,
    queryKeys,
    history = "replace",
    debounceMs = DEBOUNCE_MS,
    throttleMs = THROTTLE_MS,
    clearOnDefault = false,
    enableAdvancedFilter = false,
    scroll = false,
    shallow = true,
    startTransition,
    ...tableProps
  } = props
  const pageKey = queryKeys?.page ?? PAGE_KEY
  const perPageKey = queryKeys?.perPage ?? PER_PAGE_KEY
  const sortKey = queryKeys?.sort ?? SORT_KEY
  const filtersKey = queryKeys?.filters ?? FILTERS_KEY
  const joinOperatorKey = queryKeys?.joinOperator ?? JOIN_OPERATOR_KEY

  const queryStateOptions = React.useMemo<
    Omit<UseQueryStateOptions<string>, "parse">
  >(
    () => ({
      history,
      scroll,
      shallow,
      throttleMs,
      debounceMs,
      clearOnDefault,
      startTransition,
    }),
    [
      history,
      scroll,
      shallow,
      throttleMs,
      debounceMs,
      clearOnDefault,
      startTransition,
    ]
  )

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
    initialState?.rowSelection ?? {}
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialState?.columnVisibility ?? {})

  const [page, setPage] = useQueryState(
    pageKey,
    parseAsInteger.withOptions(queryStateOptions).withDefault(1)
  )
  const [perPage, setPerPage] = useQueryState(
    perPageKey,
    parseAsInteger
      .withOptions(queryStateOptions)
      .withDefault(initialState?.pagination?.pageSize ?? 10)
  )

  const pagination: PaginationState = React.useMemo(() => {
    return {
      pageIndex: page - 1, // zero-based index -> one-based index
      pageSize: perPage,
    }
  }, [page, perPage])

  const onPaginationChange = React.useCallback(
    (updaterOrValue: Updater<PaginationState>) => {
      if (typeof updaterOrValue === "function") {
        const newPagination = updaterOrValue(pagination)
        void setPage(newPagination.pageIndex + 1)
        void setPerPage(newPagination.pageSize)
      } else {
        void setPage(updaterOrValue.pageIndex + 1)
        void setPerPage(updaterOrValue.pageSize)
      }
    },
    [pagination, setPage, setPerPage]
  )

  const columnIds = React.useMemo(() => {
    return new Set(
      columns.map((column) => column.id).filter(Boolean) as string[]
    )
  }, [columns])

  const [sorting, setSorting] = useQueryState(
    sortKey,
    getSortingStateParser<TData>(columnIds)
      .withOptions(queryStateOptions)
      .withDefault(initialState?.sorting ?? [])
  )

  const onSortingChange = React.useCallback(
    (updaterOrValue: Updater<SortingState>) => {
      if (typeof updaterOrValue === "function") {
        const newSorting = updaterOrValue(sorting)
        setSorting(newSorting as ExtendedColumnSort<TData>[])
      } else {
        setSorting(updaterOrValue as ExtendedColumnSort<TData>[])
      }
    },
    [sorting, setSorting]
  )

  const filterableColumns = React.useMemo(() => {
    if (enableAdvancedFilter) return []

    return columns.filter((column) => column.enableColumnFilter)
  }, [columns, enableAdvancedFilter])

  const dateRangeColumnId = React.useMemo(
    () =>
      filterableColumns.find(
        (col) => (col.meta as { variant?: string } | undefined)?.variant === "dateRange"
      )?.id ?? null,
    [filterableColumns]
  )

  const filterParsers = React.useMemo(() => {
    if (enableAdvancedFilter) return {}

    const acc = filterableColumns.reduce<
      Record<string, SingleParser<string> | SingleParser<string[]>>
    >((acc, column) => {
      const variant = (column.meta as { variant?: string } | undefined)?.variant
      if (variant === "dateRange") {
        if (!acc[DATE_RANGE_START_KEY]) {
          acc[DATE_RANGE_START_KEY] = parseAsString.withOptions(queryStateOptions)
          acc[DATE_RANGE_END_KEY] = parseAsString.withOptions(queryStateOptions)
        }
        return acc
      }
      if (column.meta?.options) {
        acc[column.id ?? ""] = parseAsArrayOf(
          parseAsString,
          ARRAY_SEPARATOR
        ).withOptions(queryStateOptions)
      } else {
        acc[column.id ?? ""] = parseAsString.withOptions(queryStateOptions)
      }
      return acc
    }, {})
    return acc
  }, [filterableColumns, queryStateOptions, enableAdvancedFilter])

  const [filterValues, setFilterValues] = useQueryStates(filterParsers)

  const debouncedSetFilterValues = useDebouncedCallback(
    (values: typeof filterValues) => {
      void setPage(1)
      void setFilterValues(values)
    },
    debounceMs
  )

  const initialColumnFilters: ColumnFiltersState = React.useMemo(() => {
    if (enableAdvancedFilter) return []

    const filters: ColumnFiltersState = []
    const startDate = filterValues[DATE_RANGE_START_KEY]
    const endDate = filterValues[DATE_RANGE_END_KEY]

    for (const [key, value] of Object.entries(filterValues)) {
      if (key === DATE_RANGE_START_KEY || key === DATE_RANGE_END_KEY) continue
      if (value !== null) {
        const processedValue = Array.isArray(value)
          ? value
          : typeof value === "string" && /[^a-zA-Z0-9]/.test(value)
            ? value.split(/[^a-zA-Z0-9]+/).filter(Boolean)
            : [value]
        filters.push({ id: key, value: processedValue })
      }
    }

    if (
      dateRangeColumnId &&
      typeof startDate === "string" &&
      startDate !== "" &&
      typeof endDate === "string" &&
      endDate !== ""
    ) {
      const from = new Date(startDate).getTime()
      const to = new Date(endDate).getTime()
      if (!Number.isNaN(from) && !Number.isNaN(to)) {
        filters.push({
          id: dateRangeColumnId,
          value: [from, to],
        })
      }
    }

    return filters
  }, [filterValues, enableAdvancedFilter, dateRangeColumnId])

  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>(initialColumnFilters)

  const onColumnFiltersChange = React.useCallback(
    (updaterOrValue: Updater<ColumnFiltersState>) => {
      if (enableAdvancedFilter) return

      setColumnFilters((prev) => {
        const next =
          typeof updaterOrValue === "function"
            ? updaterOrValue(prev)
            : updaterOrValue

        const filterUpdates: Record<string, string | string[] | null> = {}

        for (const filter of next) {
          if (filter.id === dateRangeColumnId) {
            const [start, end] = dateRangeValueToYYYYMMDD(filter.value)
            filterUpdates[DATE_RANGE_START_KEY] = start
            filterUpdates[DATE_RANGE_END_KEY] = end
          } else if (
            filterableColumns.some((column) => column.id === filter.id)
          ) {
            filterUpdates[filter.id] = filter.value as string | string[]
          }
        }

        for (const prevFilter of prev) {
          if (!next.some((f) => f.id === prevFilter.id)) {
            if (prevFilter.id === dateRangeColumnId) {
              filterUpdates[DATE_RANGE_START_KEY] = null
              filterUpdates[DATE_RANGE_END_KEY] = null
            } else {
              filterUpdates[prevFilter.id] = null
            }
          }
        }

        debouncedSetFilterValues(filterUpdates)
        return next
      })
    },
    [
      debouncedSetFilterValues,
      filterableColumns,
      enableAdvancedFilter,
      dateRangeColumnId,
    ]
  )

  const table = useReactTable({
    ...tableProps,
    columns,
    initialState,
    pageCount,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    defaultColumn: {
      ...tableProps.defaultColumn,
      enableColumnFilter: false,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    meta: {
      ...tableProps.meta,
      queryKeys: {
        page: pageKey,
        perPage: perPageKey,
        sort: sortKey,
        filters: filtersKey,
        joinOperator: joinOperatorKey,
      },
    },
  })

  return React.useMemo(
    () => ({ table, shallow, debounceMs, throttleMs }),
    [table, shallow, debounceMs, throttleMs]
  )
}
