import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/providers/theme-provider";
import { WalletProviders } from "@/providers/wallet-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    // <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <SidebarProvider>
      {/* <WalletProviders> */}
      {children}
      {/* </WalletProviders> */}
    </SidebarProvider>
    // </ThemeProvider>
  );
}
