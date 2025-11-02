import { TrendingUp, TrendingDown, ShoppingCart, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface StockTickerProps {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  onBuy?: () => void;
  onSell?: () => void;
}

export const StockTicker = ({ symbol, price, change, changePercent, volume, onBuy, onSell }: StockTickerProps) => {
  const isPositive = change >= 0;

  return (
    <Card className="p-4 hover:shadow-lg transition-all duration-300 border border-border/50 bg-gradient-to-br from-card to-card/80">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-foreground">{symbol}</h3>
          <p className="text-2xl font-mono-num font-bold text-foreground">
            ${price.toFixed(2)}
          </p>
        </div>
        <div className={`flex items-center gap-1 ${isPositive ? 'text-success' : 'text-destructive'}`}>
          {isPositive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm">
        <span className={`font-mono-num font-semibold ${isPositive ? 'text-success' : 'text-destructive'}`}>
          {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
        </span>
        {volume && (
          <span className="text-muted-foreground font-mono-num">
            Vol: {(volume / 1000000).toFixed(2)}M
          </span>
        )}
      </div>
      
      {/* Trade Actions */}
      {(onBuy || onSell) && (
        <div className="mt-4 pt-3 border-t border-border/50 flex gap-2">
          {onBuy && (
            <Button
              variant="default"
              size="sm"
              onClick={onBuy}
              className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              Buy
            </Button>
          )}
          {onSell && (
            <Button
              variant="destructive"
              size="sm"
              onClick={onSell}
              className="flex-1"
            >
              <DollarSign className="h-3 w-3 mr-1" />
              Sell
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};
