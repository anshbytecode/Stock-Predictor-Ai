import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

interface PriceDataPoint {
  time: string;
  price: number;
}

interface PriceChartProps {
  data: PriceDataPoint[];
  symbol: string;
}

export const PriceChart = ({ data, symbol }: PriceChartProps) => {
  const isPositive = data.length > 1 && data[data.length - 1].price >= data[0].price;

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-card/80 border border-border/50">
      <h3 className="text-lg font-bold text-foreground mb-4">{symbol} Price Chart</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={isPositive ? "hsl(var(--success))" : "hsl(var(--destructive))"} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={isPositive ? "hsl(var(--success))" : "hsl(var(--destructive))"} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="time" 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
            domain={['auto', 'auto']}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px',
              color: 'hsl(var(--foreground))'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke={isPositive ? "hsl(var(--success))" : "hsl(var(--destructive))"}
            strokeWidth={2}
            fill="url(#colorPrice)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};
