import { useState, useEffect } from "react";
import { StockTicker } from "@/components/StockTicker";
import { SignalCard } from "@/components/SignalCard";
import { RiskMetrics } from "@/components/RiskMetrics";
import { PriceChart } from "@/components/PriceChart";
import { StockSearch } from "@/components/StockSearch";
import { TradeDialog } from "@/components/TradeDialog";
import { Portfolio, Position } from "@/components/Portfolio";
import { Activity, Bell, Settings, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data generator for demo
const generateMockData = () => {
  const stocks = [
    { symbol: "AAPL", basePrice: 195.42 },
    { symbol: "MSFT", basePrice: 412.55 },
    { symbol: "NVDA", basePrice: 875.28 },
  ];

  return stocks.map(stock => ({
    ...stock,
    price: stock.basePrice + (Math.random() - 0.5) * 10,
    change: (Math.random() - 0.5) * 5,
    changePercent: (Math.random() - 0.5) * 2,
    volume: Math.random() * 50000000 + 10000000,
  }));
};

const generateSignals = () => {
  const signals: Array<"BUY" | "SELL" | "HOLD"> = ["BUY", "SELL", "HOLD"];
  const horizons = ["1s", "5s", "1m", "5m"];
  
  return [
    {
      ticker: "AAPL",
      signal: "BUY" as const,
      confidence: 0.78,
      predictedReturn: 0.0021,
      horizon: "5s",
      positionSize: 0.005,
      stopLoss: 194.45,
      takeProfit: 196.30,
      reason: "Strong momentum with volume spike. EMA(5) crossed above EMA(20). RSI indicates bullish divergence.",
      timestamp: new Date().toISOString(),
    },
    {
      ticker: "NVDA",
      signal: "SELL" as const,
      confidence: 0.65,
      predictedReturn: -0.0015,
      horizon: "1m",
      positionSize: 0.003,
      stopLoss: 876.50,
      takeProfit: 873.20,
      reason: "Resistance level reached. Decreasing volume suggests weakening momentum. Overbought RSI signal.",
      timestamp: new Date().toISOString(),
    },
  ];
};

const generateChartData = () => {
  const data = [];
  const now = Date.now();
  for (let i = 60; i >= 0; i--) {
    data.push({
      time: new Date(now - i * 1000).toLocaleTimeString(),
      price: 195 + Math.sin(i / 10) * 5 + Math.random() * 2,
    });
  }
  return data;
};

const Index = () => {
  const [stocks, setStocks] = useState(generateMockData());
  const [signals, setSignals] = useState(generateSignals());
  const [chartData, setChartData] = useState(generateChartData());
  const [isLive, setIsLive] = useState(true);
  const [tradeDialog, setTradeDialog] = useState<{
    open: boolean;
    symbol: string;
    price: number;
    action: "BUY" | "SELL";
  }>({ open: false, symbol: "", price: 0, action: "BUY" });
  const [positions, setPositions] = useState<Position[]>([]);
  const [watchlist, setWatchlist] = useState(["AAPL", "MSFT", "NVDA"]);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setStocks(generateMockData());
      
      // Add new data point to chart
      setChartData(prev => {
        const newData = [...prev.slice(1), {
          time: new Date().toLocaleTimeString(),
          price: prev[prev.length - 1].price + (Math.random() - 0.5) * 2,
        }];
        return newData;
      });

      // Randomly update signals
      if (Math.random() > 0.7) {
        setSignals(generateSignals());
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isLive]);

  const handleTrade = (symbol: string, action: "BUY" | "SELL") => {
    const stock = stocks.find((s) => s.symbol === symbol);
    if (stock) {
      setTradeDialog({
        open: true,
        symbol,
        price: stock.price,
        action,
      });
    }
  };

  const handleConfirmTrade = (symbol: string, action: "BUY" | "SELL", quantity: number, price: number) => {
    setPositions((prev) => {
      const existing = prev.find((p) => p.symbol === symbol);
      const currentStock = stocks.find((s) => s.symbol === symbol);
      const currentPrice = currentStock?.price || price;

      if (action === "BUY") {
        if (existing) {
          const newQuantity = existing.quantity + quantity;
          const newAvgPrice = ((existing.avgPrice * existing.quantity) + (price * quantity)) / newQuantity;
          const newPnL = (currentPrice - newAvgPrice) * newQuantity;
          const newPnLPercent = ((currentPrice - newAvgPrice) / newAvgPrice) * 100;

          return prev.map((p) =>
            p.symbol === symbol
              ? {
                  ...p,
                  quantity: newQuantity,
                  avgPrice: newAvgPrice,
                  currentPrice,
                  pnl: newPnL,
                  pnlPercent: newPnLPercent,
                }
              : p
          );
        } else {
          return [
            ...prev,
            {
              symbol,
              quantity,
              avgPrice: price,
              currentPrice,
              pnl: (currentPrice - price) * quantity,
              pnlPercent: ((currentPrice - price) / price) * 100,
            },
          ];
        }
      } else {
        // SELL
        if (existing) {
          if (existing.quantity <= quantity) {
            return prev.filter((p) => p.symbol !== symbol);
          } else {
            const newQuantity = existing.quantity - quantity;
            const newPnL = (currentPrice - existing.avgPrice) * newQuantity;
            const newPnLPercent = ((currentPrice - existing.avgPrice) / existing.avgPrice) * 100;

            return prev.map((p) =>
              p.symbol === symbol
                ? {
                    ...p,
                    quantity: newQuantity,
                    currentPrice,
                    pnl: newPnL,
                    pnlPercent: newPnLPercent,
                  }
                : p
            );
          }
        }
        return prev;
      }
    });
  };

  const handleAddToWatchlist = (symbol: string) => {
    if (!watchlist.includes(symbol)) {
      setWatchlist((prev) => [...prev, symbol]);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Activity className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Stock Predictor AI</h1>
              <p className="text-sm text-muted-foreground">Real-time signals & risk analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={isLive ? "default" : "secondary"} className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${isLive ? 'bg-success animate-pulse-glow' : 'bg-muted-foreground'}`} />
              {isLive ? "LIVE" : "PAUSED"}
            </Badge>
            <Button variant="outline" size="icon" onClick={() => setIsLive(!isLive)}>
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Stock Search */}
      <section className="mb-8">
        <StockSearch onSelectStock={handleAddToWatchlist} />
      </section>

      {/* Tabs for different views */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="portfolio">
            <Briefcase className="h-4 w-4 mr-2" />
            Portfolio
          </TabsTrigger>
          <TabsTrigger value="signals">Signals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          {/* Risk Metrics */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">Performance Metrics</h2>
            <RiskMetrics
              sharpeRatio={2.34}
              maxDrawdown={0.08}
              winRate={0.68}
              totalPnL={15234.67}
            />
          </section>

          {/* Stock Tickers */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">Market Watch</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stocks
                .filter((stock) => watchlist.includes(stock.symbol))
                .map((stock) => (
                  <StockTicker
                    key={stock.symbol}
                    {...stock}
                    onBuy={() => handleTrade(stock.symbol, "BUY")}
                    onSell={() => handleTrade(stock.symbol, "SELL")}
                  />
                ))}
            </div>
          </section>

          {/* Chart */}
          <section>
            <PriceChart data={chartData} symbol="AAPL" />
          </section>
        </TabsContent>

        <TabsContent value="portfolio">
          <Portfolio positions={positions} />
        </TabsContent>

        <TabsContent value="signals" className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Active Signals</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {signals.map((signal, idx) => (
              <SignalCard key={idx} {...signal} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Trade Dialog */}
      <TradeDialog
        open={tradeDialog.open}
        onClose={() => setTradeDialog({ ...tradeDialog, open: false })}
        symbol={tradeDialog.symbol}
        currentPrice={tradeDialog.price}
        action={tradeDialog.action}
        onConfirm={handleConfirmTrade}
      />
    </div>
  );
};

export default Index;
