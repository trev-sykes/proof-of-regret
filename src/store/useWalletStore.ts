import { create } from "zustand";

interface WalletState {
    activeWallet: string;
    availableWallets: any[];
    detectWallets: () => Promise<any>;
    setWallet: (walletName: string) => void;
    clearWallet: () => void;
}

const useWalletStore = create<WalletState>((set) => ({
    activeWallet: "",
    availableWallets: [],

    detectWallets: async () => {
        return new Promise((resolve) => {
            const wallets: any[] = [];
            const handler = (event: any) => wallets.push(event.detail);

            window.addEventListener("eip6963:announceProvider", handler);
            window.dispatchEvent(new Event("eip6963:requestProvider"));

            setTimeout(() => {
                window.removeEventListener("eip6963:announceProvider", handler);
                set({ availableWallets: wallets });
                resolve(wallets);
            }, 2000);
        });
    },

    setWallet: (walletName) => {
        set({ activeWallet: walletName });
    },

    clearWallet: () => set({ activeWallet: "" }),
}));

export default useWalletStore;
