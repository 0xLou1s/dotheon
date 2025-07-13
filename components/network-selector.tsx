import { useWallet } from "@/hooks/use-wallet";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useEffect, useState } from "react";
import { CheckIcon, ChevronDownIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type NetworkType = {
  id: string;
  name: string;
  namespace: "evm" | "substrate";
  token: string;
  icon?: string;
};

export default function NetworkSelector() {
  const { wallet, walletType, chains, connectedChain, chainInfo, switchChain } =
    useWallet();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availableNetworks, setAvailableNetworks] = useState<NetworkType[]>([]);
  const [currentNetwork, setCurrentNetwork] = useState<NetworkType | undefined>(
    undefined
  );

  // Debug logs
  useEffect(() => {
    console.log("NetworkSelector - wallet:", wallet?.label);
    console.log("NetworkSelector - walletType:", walletType);
    console.log("NetworkSelector - connectedChain:", connectedChain);
    console.log("NetworkSelector - chainInfo:", chainInfo);
  }, [wallet, walletType, connectedChain, chainInfo]);

  // Filter chains based on wallet type and update available networks
  useEffect(() => {
    if (!wallet || !walletType || !chains) {
      console.log(
        "NetworkSelector - Missing required data for filtering networks"
      );
      return;
    }

    console.log(
      "NetworkSelector - Filtering networks for wallet type:",
      walletType
    );

    const filteredNetworks = chains
      .filter((chain) => {
        const matches = chain.namespace === walletType;
        console.log(
          `Chain ${chain.label} (${chain.namespace}) matches wallet type ${walletType}: ${matches}`
        );
        return matches;
      })
      .map((chain) => ({
        id: chain.id,
        name: chain.label,
        namespace: chain.namespace as "evm" | "substrate",
        token: chain.token,
        icon: `/coins/${chain.token.toLowerCase()}.svg`,
      }));

    console.log("NetworkSelector - Available networks:", filteredNetworks);
    setAvailableNetworks(filteredNetworks);
  }, [wallet, walletType, chains]);

  // Update current network when connectedChain changes
  useEffect(() => {
    if (!connectedChain) {
      console.log("NetworkSelector - No connected chain");
      setCurrentNetwork(undefined);
      return;
    }

    console.log(
      "NetworkSelector - Updating current network for connected chain:",
      connectedChain.id
    );

    // Find the matching chain in the chains array
    const matchingChain = chains.find(
      (chain) =>
        chain.id === connectedChain.id &&
        chain.namespace === connectedChain.namespace
    );

    if (matchingChain) {
      const network = {
        id: matchingChain.id,
        name: matchingChain.label,
        namespace: matchingChain.namespace as "evm" | "substrate",
        token: matchingChain.token,
        icon: `/coins/${matchingChain.token.toLowerCase()}.svg`,
      };
      console.log("NetworkSelector - Current network set to:", network);
      setCurrentNetwork(network);
    } else {
      console.log(
        "NetworkSelector - No matching chain found for connectedChain:",
        connectedChain
      );
    }
  }, [connectedChain, chains]);

  const handleNetworkChange = async (network: NetworkType) => {
    if (!wallet || network.id === currentNetwork?.id) {
      setOpen(false);
      return;
    }

    console.log("NetworkSelector - Switching to network:", network);
    setIsLoading(true);
    try {
      await switchChain(network.id);
    } catch (error) {
      console.error("Failed to switch network:", error);
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  if (!wallet || !walletType) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex items-center justify-between w-full"
          disabled={isLoading}
        >
          <div className="flex items-center gap-2 truncate">
            {currentNetwork?.icon && (
              <img
                src={currentNetwork.icon}
                alt={currentNetwork.name}
                className="w-4 h-4"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
            <span className="truncate">
              {isLoading
                ? "Switching..."
                : currentNetwork?.name || "Select Network"}
            </span>
          </div>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ChevronDownIcon className="h-4 w-4 opacity-50" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Network</DialogTitle>
        </DialogHeader>
        <Command>
          <CommandInput placeholder="Search network..." />
          <CommandList>
            <CommandEmpty>No network found.</CommandEmpty>
            <CommandGroup>
              {availableNetworks.map((network) => (
                <CommandItem
                  key={network.id}
                  value={network.name}
                  onSelect={() => handleNetworkChange(network)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  {network.icon && (
                    <img
                      src={network.icon}
                      alt={network.name}
                      className="w-5 h-5"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  )}
                  <span>{network.name}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {network.token}
                  </span>
                  {currentNetwork?.id === network.id && (
                    <CheckIcon className="h-4 w-4 text-primary ml-2" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
