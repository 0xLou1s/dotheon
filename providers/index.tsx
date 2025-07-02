import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/providers/theme-provider";
import { WalletProviders } from "@/providers/wallet-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WalletProviders>
      <ThemeProvider defaultTheme="light">
        <SidebarProvider>{children}</SidebarProvider>
      </ThemeProvider>
    </WalletProviders>
  );
}
