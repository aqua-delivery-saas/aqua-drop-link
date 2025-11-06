import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  mobileLabel?: string;
  hiddenOnMobile?: boolean;
}

type CellValue = string | number | boolean | ReactNode;

interface ResponsiveTableProps<T> {
  data: T[];
  columns: Column<T>[];
  getRowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

export function ResponsiveTable<T>({
  data,
  columns,
  getRowKey,
  onRowClick,
  emptyMessage = "Nenhum dado encontrado",
}: ResponsiveTableProps<T>) {
  const isMobile = useIsMobile();

  const getCellValue = (row: T, column: Column<T>): CellValue => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }
    return row[column.accessor] as CellValue;
  };

  if (isMobile) {
    return (
      <div className="space-y-4">
        {data.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">{emptyMessage}</p>
            </CardContent>
          </Card>
        ) : (
          data.map((row) => (
            <Card
              key={getRowKey(row)}
              className="hover:shadow-md transition-all duration-200 animate-fade-in"
              onClick={() => onRowClick?.(row)}
            >
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {columns
                    .filter(col => !col.hiddenOnMobile)
                    .map((column, idx) => (
                      <div key={idx} className="flex justify-between items-start gap-2">
                        <span className="text-sm text-muted-foreground font-medium min-w-[100px]">
                          {column.mobileLabel || column.header}:
                        </span>
                        <span className="text-sm font-medium text-right flex-1">
                          {getCellValue(row, column)}
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, idx) => (
                <TableHead key={idx}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-12">
                  <p className="text-muted-foreground">{emptyMessage}</p>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow
                  key={getRowKey(row)}
                  onClick={() => onRowClick?.(row)}
                  className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
                >
                  {columns.map((column, idx) => (
                    <TableCell key={idx}>{getCellValue(row, column)}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
