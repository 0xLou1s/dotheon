import { Card } from "@/components/ui/card";
import DigitalWallets from "./digital-wallets";
import Overview from "./overview";
import Trading from "./trading";
import RecentActivities from "./recent-activities";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import BalanceSummary from "./balance-summary";

export default function Portfolio() {
  return (
    <div className="space-y-4 relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold">Portfolio</h1>
          <p className="text-muted-foreground">
            Manage your portfolio and track your assets.
          </p>
        </div>
        <Button>
          <Download className="size-4" />
          Download Report
        </Button>
      </div>
      <div className="space-y-4">
        <div className="grid gap-4 xl:grid-cols-6 lg:space-y-0 space-y-4">
          <div className="col-span-12 xl:col-span-2">
            <Overview />
          </div>
          <div className="col-span-12 xl:col-span-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <DigitalWallets />
            </div>
            <div>
              <Trading />
            </div>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-6 lg:space-y-0 space-y-4">
          <div className="col-span-12 xl:col-span-2">
            <RecentActivities />
          </div>
          <div className="col-span-12 xl:col-span-4">
            <BalanceSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
