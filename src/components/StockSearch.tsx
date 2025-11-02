import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SearchResult {
  symbol: string;
  name: string;
  exchange: string;
  price: number;
}

interface StockSearchProps {
  onSelectStock: (symbol: string) => void;
}

// Mock search data - in production this would call a real API
const mockStocks: SearchResult[] = [
  { symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ", price: 195.42 },
  { symbol: "MSFT", name: "Microsoft Corporation", exchange: "NASDAQ", price: 412.55 },
  { symbol: "NVDA", name: "NVIDIA Corporation", exchange: "NASDAQ", price: 875.28 },
  { symbol: "GOOGL", name: "Alphabet Inc.", exchange: "NASDAQ", price: 142.30 },
  { symbol: "AMZN", name: "Amazon.com Inc.", exchange: "NASDAQ", price: 178.25 },
  { symbol: "TSLA", name: "Tesla Inc.", exchange: "NASDAQ", price: 242.84 },
  { symbol: "META", name: "Meta Platforms Inc.", exchange: "NASDAQ", price: 485.50 },
  { symbol: "AMD", name: "Advanced Micro Devices", exchange: "NASDAQ", price: 142.15 },
];

export const StockSearch = ({ onSelectStock }: StockSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const filteredStocks = searchQuery.trim().length > 0
    ? mockStocks.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelect = (symbol: string) => {
    onSelectStock(symbol);
    setSearchQuery("");
    setShowResults(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search stocks (e.g., AAPL, Microsoft...)"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          className="pl-10 bg-card border-border"
          maxLength={50}
        />
      </div>

      {showResults && filteredStocks.length > 0 && (
        <Card className="absolute top-full mt-2 w-full z-50 max-h-96 overflow-y-auto border-border bg-popover">
          <div className="p-2 space-y-1">
            {filteredStocks.map((stock) => (
              <button
                key={stock.symbol}
                onClick={() => handleSelect(stock.symbol)}
                className="w-full p-3 text-left hover:bg-accent rounded-lg transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{stock.symbol}</span>
                    <Badge variant="secondary" className="text-xs">
                      {stock.exchange}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{stock.name}</p>
                </div>
                <span className="font-mono-num font-semibold text-foreground">
                  ${stock.price.toFixed(2)}
                </span>
              </button>
            ))}
          </div>
        </Card>
      )}

      {showResults && searchQuery.trim().length > 0 && filteredStocks.length === 0 && (
        <Card className="absolute top-full mt-2 w-full z-50 border-border bg-popover">
          <div className="p-4 text-center text-muted-foreground">
            No stocks found for "{searchQuery}"
          </div>
        </Card>
      )}
    </div>
  );
};
