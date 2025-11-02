import { useState } from "react";
import { z } from "zod";
import { TrendingUp, TrendingDown, DollarSign, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const tradeSchema = z.object({
  quantity: z.number()
    .positive({ message: "Quantity must be positive" })
    .max(10000, { message: "Maximum quantity is 10,000 shares" })
    .refine((val) => Number.isInteger(val), { message: "Quantity must be a whole number" }),
  price: z.number()
    .positive({ message: "Price must be positive" })
    .max(1000000, { message: "Price seems unrealistic" }),
});

interface TradeDialogProps {
  open: boolean;
  onClose: () => void;
  symbol: string;
  currentPrice: number;
  action: "BUY" | "SELL";
  onConfirm?: (symbol: string, action: "BUY" | "SELL", quantity: number, price: number) => void;
}

export const TradeDialog = ({
  open,
  onClose,
  symbol,
  currentPrice,
  action,
  onConfirm,
}: TradeDialogProps) => {
  const [quantity, setQuantity] = useState("");
  const [limitPrice, setLimitPrice] = useState(currentPrice.toFixed(2));
  const [orderType, setOrderType] = useState<"MARKET" | "LIMIT">("MARKET");
  const [errors, setErrors] = useState<{ quantity?: string; price?: string }>({});

  const totalCost = parseFloat(quantity || "0") * (orderType === "MARKET" ? currentPrice : parseFloat(limitPrice));

  const handleSubmit = () => {
    setErrors({});

    try {
      const validation = tradeSchema.safeParse({
        quantity: parseInt(quantity),
        price: orderType === "MARKET" ? currentPrice : parseFloat(limitPrice),
      });

      if (!validation.success) {
        const fieldErrors: { quantity?: string; price?: string } = {};
        validation.error.errors.forEach((err) => {
          if (err.path[0] === "quantity") fieldErrors.quantity = err.message;
          if (err.path[0] === "price") fieldErrors.price = err.message;
        });
        setErrors(fieldErrors);
        return;
      }

      const finalPrice = orderType === "MARKET" ? currentPrice : parseFloat(limitPrice);
      
      toast.success(
        `${action} order placed`,
        {
          description: `${quantity} shares of ${symbol} at $${finalPrice.toFixed(2)} (${orderType})`,
        }
      );

      if (onConfirm) {
        onConfirm(symbol, action, parseInt(quantity), finalPrice);
      }

      // Reset and close
      setQuantity("");
      setLimitPrice(currentPrice.toFixed(2));
      setOrderType("MARKET");
      onClose();
    } catch (error) {
      toast.error("Invalid input", {
        description: "Please check your entries and try again",
      });
    }
  };

  const Icon = action === "BUY" ? TrendingUp : TrendingDown;
  const color = action === "BUY" ? "text-success" : "text-destructive";
  const bgColor = action === "BUY" ? "bg-success/10" : "bg-destructive/10";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${color}`} />
            {action} {symbol}
          </DialogTitle>
          <DialogDescription>
            Current market price: <span className="font-mono-num font-semibold">${currentPrice.toFixed(2)}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Order Type Selection */}
          <div className="space-y-2">
            <Label>Order Type</Label>
            <div className="flex gap-2">
              <Button
                variant={orderType === "MARKET" ? "default" : "outline"}
                onClick={() => setOrderType("MARKET")}
                className="flex-1"
              >
                Market
              </Button>
              <Button
                variant={orderType === "LIMIT" ? "default" : "outline"}
                onClick={() => setOrderType("LIMIT")}
                className="flex-1"
              >
                Limit
              </Button>
            </div>
          </div>

          {/* Quantity Input */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity (Shares)</Label>
            <Input
              id="quantity"
              type="number"
              placeholder="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value.trim())}
              min="1"
              max="10000"
              step="1"
              className={errors.quantity ? "border-destructive" : ""}
            />
            {errors.quantity && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.quantity}
              </p>
            )}
          </div>

          {/* Limit Price Input (only for limit orders) */}
          {orderType === "LIMIT" && (
            <div className="space-y-2">
              <Label htmlFor="limitPrice">Limit Price ($)</Label>
              <Input
                id="limitPrice"
                type="number"
                placeholder="0.00"
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value.trim())}
                step="0.01"
                min="0.01"
                className={errors.price ? "border-destructive" : ""}
              />
              {errors.price && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.price}
                </p>
              )}
            </div>
          )}

          {/* Total Cost */}
          <div className={`p-4 rounded-lg ${bgColor} border border-border/50`}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Estimated Total</span>
              <div className="flex items-center gap-1">
                <DollarSign className={`h-4 w-4 ${color}`} />
                <span className={`text-xl font-bold font-mono-num ${color}`}>
                  {totalCost.toFixed(2)}
                </span>
              </div>
            </div>
            {orderType === "MARKET" && (
              <p className="text-xs text-muted-foreground mt-2">
                Market orders execute immediately at current market price
              </p>
            )}
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/30 rounded-lg">
            <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
            <p className="text-xs text-warning-foreground">
              This is a demo interface. No real trades will be executed.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1"
            variant={action === "BUY" ? "default" : "destructive"}
            disabled={!quantity || parseInt(quantity) <= 0}
          >
            Confirm {action}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
