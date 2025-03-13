interface Window {
    ethereum?: {
        isMetaMask?: boolean;
        isCoinbaseWallet?: boolean;
        isUniWallet?: boolean;
        isUniswap?: boolean;
        providers?: Array<{
            isMetaMask?: boolean;
            isCoinbaseWallet?: boolean;
            isUniWallet?: boolean;
            isUniswap?: boolean;
            request?: (...args: any[]) => Promise<any>;
            send?: (...args: any[]) => Promise<any>;
        }>;
        request?: (...args: any[]) => Promise<any>;
        send?: (...args: any[]) => Promise<any>;
    };
}