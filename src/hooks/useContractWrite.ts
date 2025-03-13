import { useState } from "react";
import proofOfRegret from "../contracts/ProofOfRegret";
import { ethers } from "ethers";

export default function useContractWrite() {
    const [signerAddress, setSignerAddress] = useState<string>('');
    const [activeWallet, setActiveWallet] = useState<string>('');

    // New function to get the MetaMask provider using EIP-6963
    async function getMetaMaskProviderWithEIP6963() {
        return new Promise((resolve, reject) => {
            window.addEventListener("eip6963:announceProvider", (event: any) => {
                const { detail } = event;
                const { provider, info } = detail;

                if (info.name === "MetaMask") {
                    console.log("MetaMask provider detected:", info);
                    resolve(provider); // Return the MetaMask provider
                } else {
                    console.log("Ignoring provider:", info.name);
                }
            });

            // Trigger providers to announce themselves
            window.dispatchEvent(new Event("eip6963:requestProvider"));

            // Optional: Add a timeout to reject if no MetaMask is found
            setTimeout(() => reject(new Error("MetaMask not detected")), 5000);
        });
    }

    // Updated function to connect and get accounts
    async function connectToMetaMaskWithEIP6963() {
        try {
            const provider: any = await getMetaMaskProviderWithEIP6963();
            const accounts = await provider.request({ method: "eth_requestAccounts" });
            console.log("Connected with MetaMask:", accounts);
            setActiveWallet("MetaMask");
            setSignerAddress(accounts[0]);
            localStorage.setItem("lastSignerAddress", accounts[0]);
            return accounts;
        } catch (error) {
            console.error("Error connecting with MetaMask:", error);
            throw error;
        }
    }

    // Updated helper to get the signer
    async function getSigner() {
        const provider: any = await getMetaMaskProviderWithEIP6963();
        const ethersProvider = new ethers.BrowserProvider(provider);
        const accounts = await provider.request({ method: "eth_requestAccounts" });
        const signer = await ethersProvider.getSigner(accounts[0]);
        setSignerAddress(accounts[0]);
        setActiveWallet("MetaMask");
        return signer;
    }

    const handleConfession = async (confession: string) => {
        try {
            const signer = await getSigner();
            const contractInstance = new ethers.Contract(
                proofOfRegret.contractAddress,
                proofOfRegret.contractABI,
                signer
            );

            const amount = await contractInstance.CONFESSION_COST();
            const tx = await contractInstance.confess(confession, { value: amount });
            await tx.wait();
            return tx;
        } catch (err: any) {
            console.error("Error handling confession:", err.message);
            throw err;
        }
    };

    const handleForgive = async (id: number) => {
        try {
            const signer = await getSigner();
            const contractInstance = new ethers.Contract(
                proofOfRegret.contractAddress,
                proofOfRegret.contractABI,
                signer
            );
            const fee = await contractInstance.FORGIVENESS_FEE();
            const tx = await contractInstance.forgive(id, { value: fee });
            await tx.wait();
            return tx;
        } catch (err: any) {
            console.error("Error handling forgive:", err.message);
            throw err;
        }
    };

    const handleResolve = async (id: any) => {
        try {
            const signer = await getSigner();
            const contractInstance = new ethers.Contract(
                proofOfRegret.contractAddress,
                proofOfRegret.contractABI,
                signer
            );
            const tx = await contractInstance.resolve(id);
            await tx.wait();
            return tx;
        } catch (err: any) {
            console.error("Error handling resolve:", err.message);
            throw err;
        }
    };

    const disconnect = () => {
        setSignerAddress('');
        setActiveWallet('');
        localStorage.removeItem('lastSignerAddress');
    };

    return {
        handleConfession,
        handleForgive,
        handleResolve,
        activeWallet,
        signerAddress,
        getSigner,
        connectToMetaMaskWithEIP6963,
        disconnect,
    };
}