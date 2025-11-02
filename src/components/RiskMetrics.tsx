import { Activity, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";

interface RiskMetricsProps {
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  totalPnL: number;
}

export const RiskMetrics = ({ sharpeRatio, maxDrawdown, winRate, totalPnL }: RiskMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4 bg-gradient-to-br from-card to-card/80 border border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Sharpe Ratio</p>
            <p className="text-2xl font-bold font-mono-num text-foreground">{sharpeRatio.toFixed(2)}</p>
          </div>
          <Activity className="h-8 w-8 text-info" />
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-card to-card/80 border border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Max Drawdown</p>
            <p className="text-2xl font-bold font-mono-num text-destructive">
              {(maxDrawdown * 100).toFixed(1)}%
            </p>
          </div>
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-card to-card/80 border border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Win Rate</p>
            <p className="text-2xl font-bold font-mono-num text-success">
              {(winRate * 100).toFixed(1)}%
            </p>
          </div>
          <TrendingUp className="h-8 w-8 text-success" />
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-card to-card/80 border border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total P&L</p>
            <p className={`text-2xl font-bold font-mono-num ${totalPnL >= 0 ? 'text-success' : 'text-destructive'}`}>
              ${totalPnL.toFixed(2)}
            </p>
          </div>
          <DollarSign className={`h-8 w-8 ${totalPnL >= 0 ? 'text-success' : 'text-destructive'}`} />
        </div>
      </Card>
    </div>
  );
};
