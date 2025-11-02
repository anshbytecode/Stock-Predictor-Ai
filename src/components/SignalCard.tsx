import { TrendingUp, TrendingDown, Minus, Target, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface SignalCardProps {
  ticker: string;
  signal: "BUY" | "SELL" | "HOLD";
  confidence: number;
  predictedReturn: number;
  horizon: string;
  positionSize: number;
  stopLoss?: number;
  takeProfit?: number;
  reason: string;
  timestamp: string;
}

export const SignalCard = ({
  ticker,
  signal,
  confidence,
  predictedReturn,
  horizon,
  positionSize,
  stopLoss,
  takeProfit,
  reason,
  timestamp,
}: SignalCardProps) => {
  const signalColor = {
    BUY: "text-success",
    SELL: "text-destructive",
    HOLD: "text-muted-foreground",
  };

  const signalBg = {
    BUY: "bg-success/10 border-success/30",
    SELL: "bg-destructive/10 border-destructive/30",
    HOLD: "bg-muted/10 border-muted/30",
  };

  const SignalIcon = {
    BUY: TrendingUp,
    SELL: TrendingDown,
    HOLD: Minus,
  }[signal];

  return (
    <Card className={`p-5 border-2 transition-all duration-300 hover:shadow-xl ${signalBg[signal]}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-foreground">{ticker}</h3>
            <Badge variant={signal === "BUY" ? "default" : signal === "SELL" ? "destructive" : "secondary"} className="font-semibold">
              {signal}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground font-mono-num">{new Date(timestamp).toLocaleTimeString()}</p>
        </div>
        <SignalIcon className={`h-8 w-8 ${signalColor[signal]}`} />
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-muted-foreground">Confidence</span>
            <span className={`text-sm font-bold font-mono-num ${signalColor[signal]}`}>
              {(confidence * 100).toFixed(0)}%
            </span>
          </div>
          <Progress value={confidence * 100} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Predicted Return</p>
            <p className={`text-lg font-bold font-mono-num ${predictedReturn >= 0 ? 'text-success' : 'text-destructive'}`}>
              {predictedReturn >= 0 ? '+' : ''}{(predictedReturn * 100).toFixed(2)}%
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Horizon</p>
            <p className="text-lg font-bold font-mono-num text-foreground">{horizon}</p>
          </div>
        </div>

        <div className="pt-2 border-t border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Position Size</span>
            <span className="text-sm font-bold font-mono-num text-foreground ml-auto">
              {(positionSize * 100).toFixed(1)}%
            </span>
          </div>
          
          {(stopLoss || takeProfit) && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              {stopLoss && (
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3 text-destructive" />
                  <span className="text-xs text-muted-foreground">SL:</span>
                  <span className="text-xs font-mono-num text-destructive">${stopLoss.toFixed(2)}</span>
                </div>
              )}
              {takeProfit && (
                <div className="flex items-center gap-1">
                  <Target className="h-3 w-3 text-success" />
                  <span className="text-xs text-muted-foreground">TP:</span>
                  <span className="text-xs font-mono-num text-success">${takeProfit.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground mb-1">Analysis</p>
          <p className="text-sm text-foreground/80 italic">{reason}</p>
        </div>
      </div>
    </Card>
  );
};
