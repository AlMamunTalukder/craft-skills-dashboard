import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import SearchBar from "./SearchBar";
import { DataTableViewOptions } from "./DataTableViewOptions";
import { Button } from "../ui/button";
import { ListFilter, Trash2, Loader2 } from "lucide-react";
import DateFilters from "./DateFilters";
import DateRangeFilter from "./DateRangeFilter";
import { DataTablePagination } from "./DataTablePagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchPlaceholder?: string;
  dateField?: string;
  searchable?: boolean;
  enableRowSelection?: boolean;
  onRowSelectionChange?: (selectedIds: string[]) => void;
  onBulkDelete?: (selectedIds: string[]) => Promise<void>;
  getRowId?: (row: TData) => string;
  bulkDeleteLabel?: string;
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder = "Search",
  enableRowSelection = false,
  onRowSelectionChange,
  onBulkDelete,
  getRowId,
  bulkDeleteLabel = "items",
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [searchResults, setSearchResults] = React.useState<TData[]>(data);
  const [filteredData, setFilteredData] = React.useState<TData[]>(data);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [isSearch, setIsSearch] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  // ✅ Get selected row IDs
  const getSelectedIds = React.useCallback(() => {
    const selectedIndexes = Object.keys(rowSelection).filter(
      (key) => rowSelection[key as keyof typeof rowSelection]
    );
    const currentData = isSearch ? searchResults : filteredData;
    return selectedIndexes
      .map((index) => {
        const row = currentData[parseInt(index)];
        return getRowId ? getRowId(row) : (row as any)._id || (row as any).id;
      })
      .filter(Boolean);
  }, [rowSelection, isSearch, searchResults, filteredData, getRowId]);

  const selectedCount = Object.keys(rowSelection).filter(
    (key) => rowSelection[key as keyof typeof rowSelection]
  ).length;

  // ✅ Handle row selection change
  const prevSelectedIdsRef = React.useRef<string[]>([]);
  React.useEffect(() => {
    if (onRowSelectionChange) {
      const selectedIds = getSelectedIds();
      if (JSON.stringify(prevSelectedIdsRef.current) !== JSON.stringify(selectedIds)) {
        prevSelectedIdsRef.current = selectedIds;
        onRowSelectionChange(selectedIds);
      }
    }
  }, [rowSelection, onRowSelectionChange, getSelectedIds]);

  // ✅ Handle bulk delete
  const handleBulkDelete = async () => {
    if (!onBulkDelete) return;

    const selectedIds = getSelectedIds();
    if (selectedIds.length === 0) return;

    setIsDeleting(true);
    setShowDeleteDialog(false);

    try {
      await onBulkDelete(selectedIds);
      setRowSelection({});
    } catch (error) {
      console.error("Bulk delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const table = useReactTable({
    data: isSearch ? searchResults : filteredData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  React.useEffect(() => {
    setSearchResults(data);
    setFilteredData(data);
  }, [data]);

  // ✅ Check if selection is enabled and bulk delete is provided
  const hasBulkDelete = enableRowSelection && onBulkDelete;

  return (
    <div className="space-y-4">
      {/* ✅ Bulk Delete Toolbar */}
      {hasBulkDelete && selectedCount > 0 && (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
              className="flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete Selected ({selectedCount} {bulkDeleteLabel})
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-auto sm:flex-1">
          <SearchBar
            data={data}
            onSearch={setSearchResults}
            setIsSearch={setIsSearch}
            placeholder={searchPlaceholder}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DateRangeFilter
            data={data}
            onFilter={setFilteredData}
            setIsSearch={setIsSearch}
          />
          <DateFilters
            data={data}
            onFilter={setFilteredData}
            setIsSearch={setIsSearch}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Active
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DataTableViewOptions table={table} />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />

      {/* ✅ Delete Confirmation Dialog */}
      {hasBulkDelete && (
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                selected {selectedCount} {bulkDeleteLabel} and remove them from the database.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleBulkDelete}
                className="bg-red-600 hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}