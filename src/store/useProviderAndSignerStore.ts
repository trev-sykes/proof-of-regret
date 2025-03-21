import { create } from "zustand";
import { ethers } from "ethers";
import useWalletStore from "./useWalletStore";

interface ProviderState {
    provider: any;
    signer: ethers.JsonRpcSigner | null;
    signerAddress: string;
    connectProvider: () => Promise<void>;
    connectSigner: () => Promise<void>;
    disconnect: () => void;
}

const rpcUrl = import.meta.env.VITE_INFURA_RPC_URL;
const useProviderStore = create<ProviderState>((set, get) => ({
    provider: null,
    signer: null,
    signerAddress: "",

    // 🟢 Connects the Provider (Read-Only Access)
    connectProvider: async () => {
        console.log("Connecting provider");
        const provider = new ethers.JsonRpcProvider(rpcUrl, {
            name: 'https://sepolia-rollup.arbitrum.io/rpc',
            chainId: 421614
        });
        set({ provider });
        console.log("✅ Provider connected:", provider);
    },

    // 🔵 Connects the Signer (For Transactions)
    connectSigner: async () => {
        try {
            // Get the active wallet from the wallet store
            const { activeWallet, availableWallets } = useWalletStore.getState();
            console.log(`Connecting signer using ${activeWallet} wallet`);

            if (!activeWallet) {
                throw new Error("No wallet selected. Please select a wallet first.");
            }

            // Find the selected wallet from available wallets
            const selectedWallet = availableWallets.find(w => w.info.name === activeWallet);

            if (!selectedWallet || !selectedWallet.provider) {
                throw new Error(`Selected wallet ${activeWallet} not found or provider not available.`);
            }

            // Create browser provider with the wallet's provider
            const ethersProvider = new ethers.BrowserProvider(selectedWallet.provider);

            // Request accounts access
            await selectedWallet.provider.request({ method: "eth_requestAccounts" });

            // Get signer and address
            const signer = await ethersProvider.getSigner();
            const signerAddress = await signer.getAddress();

            set({ signer, signerAddress });
            console.log("✅ Signer connected:", signerAddress);
        } catch (error) {
            console.error("Failed to connect signer:", error);
            throw error;
        }
    },

    // 🔴 Disconnect Everything
    disconnect: () => {
        set({ provider: null, signer: null, signerAddress: "" });
        console.log("🛑 Disconnected from provider & signer");
    },
}));

export default useProviderStore;