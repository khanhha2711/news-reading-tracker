"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ArticlesPaginationProps {
  page: number;
  limit: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function ArticlesPagination({
  page,
  limit,
  totalPages,
  onPageChange,
  onLimitChange,
}: ArticlesPaginationProps) {
  const canPrevious = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="flex items-center justify-between px-2">
      {/* Rows per page */}
      <div className="flex items-center gap-2">
        <Label htmlFor="rows-per-page" className="text-sm font-medium">
          Rows per page
        </Label>

        <Select
          value={String(limit)}
          onValueChange={(value) => onLimitChange(Number(value))}
        >
          <SelectTrigger id="rows-per-page" size="sm" className="w-18">
            <SelectValue />
          </SelectTrigger>

          <SelectContent side="top">
            {[10, 20, 30, 50].map((value) => (
              <SelectItem key={value} value={String(value)}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Page */}
      <div className="flex items-center gap-6">
        <span className="text-sm font-medium">
          Page {page} of {totalPages}
        </span>

        <div className="flex items-center gap-2">
          {/* First */}
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => onPageChange(1)}
            disabled={!canPrevious}
          >
            <ChevronsLeft />
            <span className="sr-only">Go to first page</span>
          </Button>

          {/* Previous */}
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => onPageChange(page - 1)}
            disabled={!canPrevious}
          >
            <ChevronLeft />
            <span className="sr-only">Go to previous page</span>
          </Button>

          {/* Next */}
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => onPageChange(page + 1)}
            disabled={!canNext}
          >
            <ChevronRight />
            <span className="sr-only">Go to next page</span>
          </Button>

          {/* Last */}
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => onPageChange(totalPages)}
            disabled={!canNext}
          >
            <ChevronsRight />
            <span className="sr-only">Go to last page</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
