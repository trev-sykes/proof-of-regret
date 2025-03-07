import { useState } from "react";
import proofOfRegret from "../contracts/ProofOfRegret";
import { ethers } from "ethers";

export default function useContractWrite() {
    const [signerAddress, setSignerAddress] = useState<string>('');

    const getSigner = async () => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.send('eth_requestAccounts', []);
            const signer = await provider.getSigner(accounts[0]);
            const address = ethers.getAddress(signer.address); // Normalize to checksummed address
            setSignerAddress(address);
            console.log("Signer Address:", address);
            return address; // Return address directly for consistency
        } catch (error) {
            console.error("Error getting signer:", error);
            throw error;
        }
    };

    const handleConfession = async (confession: string) => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.send('eth_requestAccounts', []);
            const signer = await provider.getSigner(accounts[0]);
            const contractInstance = new ethers.Contract(
                proofOfRegret.contractAddress,
                proofOfRegret.contractABI,
                signer
            );

            const amount = await contractInstance.CONFESSION_COST();
            const tx = await contractInstance.confess(confession, { value: amount });
            await tx.wait(); // Wait for transaction confirmation
            return tx;
        } catch (err: any) {
            console.error("Error handling confession:", err.message);
            throw err;
        }
    };

    const handleForgive = async (id: number) => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.send('eth_requestAccounts', []);
            const signer = await provider.getSigner(accounts[0]);
            const contractInstance = new ethers.Contract(
                proofOfRegret.contractAddress,
                proofOfRegret.contractABI,
                signer
            );
            const fee = await contractInstance.FORGIVENESS_FEE();
            const tx = await contractInstance.forgive(id, { value: fee });
            await tx.wait(); // Wait for confirmation
            return tx;
        } catch (err: any) {
            console.error("Error handling forgive:", err.message);
            throw err;
        }
    };
    const handleResolve = async (id: any) => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner(accounts[0]);
        const contractInstance = new ethers.Contract(
            proofOfRegret.contractAddress,
            proofOfRegret.contractABI,
            signer
        );
        const tx = await contractInstance.resolve(id);
        await tx.wait(); // Wait for confirmation
        return tx;
    }

    const disconnect = () => {
        setSignerAddress('');
        localStorage.removeItem('lastSignerAddress');
    };

    return { handleConfession, handleForgive, handleResolve, getSigner, signerAddress, disconnect };
}