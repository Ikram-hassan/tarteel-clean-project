import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, CheckCircle, AlertCircle, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

interface DynamicPaymentGatewayProps {
  studentLevel: "beginner" | "intermediate" | "ijaza";
  selectedDays: string[];
  paymentStatus?: "paid" | "pending" | "overdue";
  onPayNow?: () => void;
}

export function DynamicPaymentGateway({
  studentLevel,
  selectedDays,
  paymentStatus = "pending",
  onPayNow,
}: DynamicPaymentGatewayProps) {
  // Calculate monthly fee based on track and days
  const calculateMonthlyFee = (): number => {
    const daysCount = selectedDays.length;

    // General Track (Beginner/Intermediate)
    if (studentLevel === "beginner" || studentLevel === "intermediate") {
      if (daysCount >= 2 && daysCount <= 3) return 15;
      if (daysCount >= 4 && daysCount <= 5) return 20;
      if (daysCount >= 6 && daysCount <= 7) return 25;
    }

    // Ijaza Track
    if (studentLevel === "ijaza") {
      if (daysCount >= 2 && daysCount <= 3) return 20;
      if (daysCount >= 4 && daysCount <= 5) return 30;
      if (daysCount >= 6 && daysCount <= 7) return 40;
    }

    return 0; // Default if no match
  };

  const monthlyFee = calculateMonthlyFee();
  const trackName = studentLevel === "ijaza" ? "Ijaza Track" : "General Track";

  const getStatusColor = () => {
    switch (paymentStatus) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-300";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "overdue":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case "paid":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "pending":
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case "overdue":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <DollarSign className="w-5 h-5 text-slate-600" />;
    }
  };

  const getStatusText = () => {
    switch (paymentStatus) {
      case "paid":
        return "Payment Complete ✓";
      case "pending":
        return "Payment Pending";
      case "overdue":
        return "Payment Overdue!";
      default:
        return "Payment Status";
    }
  };

  return (
    <Card className="rounded-[2.5rem] p-8 bg-gradient-to-br from-tarteel-maroon to-slate-900 text-white shadow-xl border-none relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 opacity-10">
        <CreditCard size={200} />
      </div>

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-6 h-6 text-tarteel-gold" />
              <h3 className="font-black text-2xl">Monthly Payment</h3>
            </div>
            <Badge className="bg-tarteel-gold text-slate-900 px-3 py-1 text-xs font-bold">
              {trackName}
            </Badge>
          </div>
          <div className={`px-4 py-2 rounded-xl border-2 ${getStatusColor()}`}>
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className="text-sm font-bold">{getStatusText()}</span>
            </div>
          </div>
        </div>

        {/* Fee Breakdown */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/80">Track Type:</span>
              <span className="font-bold text-lg">{trackName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/80">Days per Week:</span>
              <span className="font-bold text-lg">
                {selectedDays.length} Days
              </span>
            </div>
            <div className="h-px bg-white/20 my-2" />
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-tarteel-gold">
                Monthly Fee:
              </span>
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-4xl font-black text-tarteel-gold"
              >
                ${monthlyFee}
              </motion.span>
            </div>
          </div>
        </div>

        {/* Pricing Table Reference */}
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <p className="text-xs text-white/60 font-bold mb-3 uppercase tracking-wide">
            Pricing Structure:
          </p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <p className="text-white/80 font-bold">General Track:</p>
              <p className="text-white/60">2-3 Days: $15</p>
              <p className="text-white/60">4-5 Days: $20</p>
              <p className="text-white/60">6-7 Days: $25</p>
            </div>
            <div className="space-y-1">
              <p className="text-white/80 font-bold">Ijaza Track:</p>
              <p className="text-white/60">2-3 Days: $20</p>
              <p className="text-white/60">4-5 Days: $30</p>
              <p className="text-white/60">6-7 Days: $40</p>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        {paymentStatus !== "paid" && (
          <Button
            onClick={onPayNow}
            className="w-full bg-tarteel-gold hover:bg-tarteel-gold/90 text-slate-900 h-14 rounded-2xl font-black text-lg shadow-lg"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Pay ${monthlyFee} Now
          </Button>
        )}

        {paymentStatus === "paid" && (
          <div className="bg-green-500/20 border-2 border-green-500 rounded-2xl p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="font-bold text-green-300">
              Your payment is up to date!
            </p>
            <p className="text-xs text-green-400 mt-1">
              Next payment due: Next month
            </p>
          </div>
        )}

        {/* Note */}
        <div className="text-center">
          <p className="text-xs text-white/50 italic">
            💡 Your fee is automatically calculated based on your selected days
            and track level.
          </p>
        </div>
      </div>
    </Card>
  );
}
