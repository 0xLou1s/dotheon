"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ProtocolsTableProps {
  data: any;
}

export default function ProtocolsTable({ data }: ProtocolsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  }>({
    key: "apy",
    direction: "descending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const protocols = data.protocols;

  // Format numbers for display
  const formatCurrency = (value: number) => {
    if (value >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(2)}B`;
    } else if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(2)}M`;
    } else if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(2)}K`;
    } else {
      return `$${value.toFixed(2)}`;
    }
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getClassNamesFor = (name: string) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  const sortedProtocols = [...protocols].sort((a, b) => {
    if (sortConfig.key === "pools.length") {
      if (sortConfig.direction === "ascending") {
        return a.pools.length - b.pools.length;
      }
      return b.pools.length - a.pools.length;
    }

    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const filteredProtocols = sortedProtocols.filter((protocol) =>
    protocol.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProtocols.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedProtocols = filteredProtocols.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold">Liquid Staking Protocols</h2>
        <div className="w-full sm:w-64">
          <Input
            placeholder="Search protocols..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="rounded-md border">
        <div className="w-full overflow-x-auto">
          <div className="min-w-[640px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">#</TableHead>
                  <TableHead className="w-[200px]">Protocol</TableHead>
                  <TableHead
                    className="w-[120px] cursor-pointer hover:bg-muted/50"
                    onClick={() => requestSort("tvl")}
                  >
                    TVL{" "}
                    {getClassNamesFor("tvl") === "ascending" ? (
                      <ArrowUp className="inline h-4 w-4" />
                    ) : (
                      <ArrowDown className="inline h-4 w-4" />
                    )}
                  </TableHead>
                  <TableHead
                    className="w-[100px] cursor-pointer hover:bg-muted/50"
                    onClick={() => requestSort("apy")}
                  >
                    APY{" "}
                    {getClassNamesFor("apy") === "ascending" ? (
                      <ArrowUp className="inline h-4 w-4" />
                    ) : (
                      <ArrowDown className="inline h-4 w-4" />
                    )}
                  </TableHead>
                  <TableHead
                    className="hidden md:table-cell w-[120px] cursor-pointer hover:bg-muted/50"
                    onClick={() => requestSort("change_24h")}
                  >
                    24h{" "}
                    {getClassNamesFor("change_24h") === "ascending" ? (
                      <ArrowUp className="inline h-4 w-4" />
                    ) : (
                      <ArrowDown className="inline h-4 w-4" />
                    )}
                  </TableHead>
                  <TableHead
                    className="hidden md:table-cell w-[120px] cursor-pointer hover:bg-muted/50"
                    onClick={() => requestSort("change_7d")}
                  >
                    7d{" "}
                    {getClassNamesFor("change_7d") === "ascending" ? (
                      <ArrowUp className="inline h-4 w-4" />
                    ) : (
                      <ArrowDown className="inline h-4 w-4" />
                    )}
                  </TableHead>
                  <TableHead
                    className="hidden md:table-cell w-[80px] cursor-pointer hover:bg-muted/50"
                    onClick={() => requestSort("pools.length")}
                  >
                    Pools{" "}
                    {getClassNamesFor("pools.length") === "ascending" ? (
                      <ArrowUp className="inline h-4 w-4" />
                    ) : (
                      <ArrowDown className="inline h-4 w-4" />
                    )}
                  </TableHead>
                  <TableHead className="w-[60px] text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedProtocols.map((protocol, index) => (
                  <TableRow
                    key={protocol.name}
                    className={
                      protocol.name.toLowerCase().includes("bifrost")
                        ? "bg-primary/5"
                        : ""
                    }
                  >
                    <TableCell className="font-medium">
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span className="truncate">{protocol.name}</span>
                        {protocol.name.toLowerCase().includes("bifrost") && (
                          <Badge
                            variant="outline"
                            className="shrink-0 bg-primary/10 text-primary hover:bg-primary/20"
                          >
                            Bifrost
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(protocol.tvl)}</TableCell>
                    <TableCell>{formatPercentage(protocol.apy)}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span
                        className={
                          protocol.change_24h >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {protocol.change_24h >= 0 ? "+" : ""}
                        {formatPercentage(protocol.change_24h)}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span
                        className={
                          protocol.change_7d >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {protocol.change_7d >= 0 ? "+" : ""}
                        {formatPercentage(protocol.change_7d)}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {protocol.pools.length}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      {totalPages > 1 && (
        <Pagination className="w-full justify-end py-2">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              // Show first page, last page, current page, and pages around current page
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      onClick={() => handlePageChange(pageNumber)}
                      isActive={currentPage === pageNumber}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              } else if (
                pageNumber === currentPage - 2 ||
                pageNumber === currentPage + 2
              ) {
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }
              return null;
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
