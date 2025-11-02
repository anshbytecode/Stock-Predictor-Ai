import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

export interface Position {
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
}

interface PortfolioProps {
  positions: Position[];
}

export const Portfolio = ({ positions }: PortfolioProps) => {
  const totalValue = positions.reduce((sum, pos) => sum + (pos.currentPrice * pos.quantity), 0);
  const totalCost = positions.reduce((sum, pos) => sum + (pos.avgPrice * pos.quantity), 0);
  const totalPnL = totalValue - totalCost;
  const totalPnLPercent = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-gradient-to-br from-card to-card/80 border border-border/50">
        <h3 className="text-lg font-bold text-foreground mb-4">Portfolio Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Value</p>
            <p className="text-2xl font-bold font-mono-num text-foreground">
              ${totalValue.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Cost</p>
            <p className="text-2xl font-bold font-mono-num text-foreground">
              ${totalCost.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total P&L</p>
            <p className={`text-2xl font-bold font-mono-num ${totalPnL >= 0 ? 'text-success' : 'text-destructive'}`}>
              ${totalPnL >= 0 ? '+' : ''}{totalPnL.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Return</p>
            <p className={`text-2xl font-bold font-mono-num ${totalPnLPercent >= 0 ? 'text-success' : 'text-destructive'}`}>
              {totalPnLPercent >= 0 ? '+' : ''}{totalPnLPercent.toFixed(2)}%
            </p>
          </div>
        </div>
      </Card>

      {positions.length > 0 ? (
        <div className="space-y-3">
          {positions.map((position) => {
            const isProfit = position.pnl >= 0;
            return (
              <Card key={position.symbol} className="p-4 hover:shadow-lg transition-all duration-300 border border-border/50 bg-card">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-bold text-foreground">{position.symbol}</h4>
                      <Badge variant={isProfit ? "default" : "destructive"} className="flex items-center gap-1">
                        {isProfit ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {isProfit ? '+' : ''}{position.pnlPercent.toFixed(2)}%
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        Qty: <span className="font-mono-num text-foreground">{position.quantity}</span>
                      </span>
                      <span className="text-muted-foreground">
                        Avg: <span className="font-mono-num text-foreground">${position.avgPrice.toFixed(2)}</span>
                      </span>
                      <span className="text-muted-foreground">
                        Current: <span className="font-mono-num text-foreground">${position.currentPrice.toFixed(2)}</span>
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">P&L</p>
                    <p className={`text-xl font-bold font-mono-num ${isProfit ? 'text-success' : 'text-destructive'}`}>
                      {isProfit ? '+' : ''}${position.pnl.toFixed(2)}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-8 text-center border border-border/50 bg-card">
          <p className="text-muted-foreground">No positions yet. Start trading to build your portfolio.</p>
        </Card>
      )}
    </div>
  );
};
