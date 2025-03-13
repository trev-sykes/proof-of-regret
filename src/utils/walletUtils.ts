// walletUtils.ts
export interface WalletInfo {
    id: string;
    name: string;
    icon: string;
    installed: boolean;
    provider?: any;
}

export const detectWallets = (): WalletInfo[] => {
    console.log("Detecting wallets...");
    const wallets: WalletInfo[] = [
        { id: 'metamask', name: 'MetaMask', icon: '🦊', installed: false },
        { id: 'uniwallet', name: 'UniWallet', icon: '🦄', installed: false },
        { id: 'walletconnect', name: 'WalletConnect', icon: '🔗', installed: false },
        { id: 'coinbase', name: 'Coinbase Wallet', icon: '💰', installed: false },
        { id: 'trust', name: 'Trust Wallet', icon: '🛡️', installed: false }
    ];

    if (window.ethereum) {
        console.log("window.ethereum detected:", window.ethereum);
        console.log("Flags:", {
            isMetaMask: window.ethereum.isMetaMask,
            isUniswapWallet: window.ethereum.isUniswapWallet,
            isCoinbaseWallet: window.ethereum.isCoinbaseWallet
        });

        if (window.ethereum.isMetaMask) {
            console.log("MetaMask detected");
            const metamaskWallet = wallets.find(w => w.id === 'metamask');
            if (metamaskWallet) {
                metamaskWallet.installed = true;
                metamaskWallet.provider = window.ethereum;
            }
        }

        if (!window.ethereum.isUniswapWallet) {
            console.log("UniWallet detected");
            const uniwallet = wallets.find(w => w.id === 'uniwallet');
            if (uniwallet) {
                uniwallet.installed = true;
                uniwallet.provider = window.ethereum;
            }
        }

        if (window.ethereum.isCoinbaseWallet) {
            console.log("Coinbase Wallet detected");
            const coinbaseWallet = wallets.find(w => w.id === 'coinbase');
            if (coinbaseWallet) {
                coinbaseWallet.installed = true;
                coinbaseWallet.provider = window.ethereum;
            }
        }
    }

    if (window.ethereum?.providers) {
        console.log("Multiple providers detected:", window.ethereum.providers);
        window.ethereum.providers.forEach((provider: any, index: any) => {
            console.log(`Provider ${index}:`, {
                isMetaMask: provider.isMetaMask,
                isUniWallet: provider.isUniWallet,
                isUniswap: provider.isUniswap,
                isUniswapWallet: provider.isUniswapWallet
            });
        });
    }

    console.log("Final detected wallets:", wallets);
    return wallets;
};