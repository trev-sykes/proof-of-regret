import { create } from "zustand";
import { ethers } from "ethers";

interface ProviderState {
    provider: ethers.JsonRpcProvider | null;
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
        console.log("Conecting wallet");
        const provider = new ethers.JsonRpcProvider(rpcUrl, {
            name: 'https://sepolia-rollup.arbitrum.io/rpc',
            chainId: 421614
        })
        set({ provider: provider });
        console.log("✅ Provider connected:", provider);
    },

    // 🔵 Connects the Signer (For Transactions)
    connectSigner: async () => {
        const { provider } = get();
        if (!provider) {
            console.error("Provider not connected. Call connectProvider() first.");
            return;
        }

        await provider.send("eth_requestAccounts", []); // Request wallet connection
        const signer = await provider.getSigner();
        const signerAddress = await signer.getAddress();

        set({ signer, signerAddress });
        console.log("✅ Signer connected:", signerAddress);
    },

    // 🔴 Disconnect Everything
    disconnect: () => {
        set({ provider: null, signer: null, signerAddress: "" });
        console.log("🛑 Disconnected from provider & signer");
    },
}));

export default useProviderStore;
