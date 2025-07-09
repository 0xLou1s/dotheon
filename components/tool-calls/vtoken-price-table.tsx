import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TokenPriceTableProps {
  token: string;
  price: number;
}

const formatPrice = (price: number) => {
  if (price >= 1000) {
    return `$${price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return `$${price.toFixed(price < 0.01 ? 6 : 4)}`;
};

const TokenPriceTable: React.FC<TokenPriceTableProps> = ({ token, price }) => {
  console.log("TokenPriceTable props:", { token, price });

  if (!token || !price) {
    return (
      <Card className="w-full max-w-3xl mx-auto shadow-xl">
        <CardContent className="p-4 text-center text-muted-foreground">
          <p>📭 No price data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl">
      <CardContent className="p-4">
        <h2 className="text-xl font-bold mb-4">📊 Token Price</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Token</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">
                {token.toUpperCase()}
              </TableCell>
              <TableCell className="text-right font-mono">
                {formatPrice(price)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TokenPriceTable;
