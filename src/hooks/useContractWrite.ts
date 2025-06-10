import { ethers } from "ethers";
import { useWriteContract } from "wagmi";
import { contractAddress, contractABI } from "../contracts/ProofOfRegret";

export default function useContractWrite() {

    const {
        writeContract,
        error: contractError
    } = useWriteContract();
    const handleConfession = async (confession: string) => {
        try {
            const amount: any = ethers.parseEther('0.001');
            await writeContract({
                address: contractAddress,
                abi: contractABI,
                functionName: 'confess',
                args: [confession],
                value: amount
            })
        } catch (err: any) {
            console.error("Error handling confession:", err.message);
            console.error('Contract Error', contractError)
            throw err;
        }
    };

    const handleForgive = async (id: number) => {
        try {
            const fee = ethers.parseEther('0.0001');
            await writeContract({
                address: contractAddress,
                abi: contractABI,
                functionName: 'forgive',
                args: [id],
                value: fee
            })
        } catch (err: any) {
            console.error("Error handling forgive:", err.message);
            console.error('Contract Error', contractError)
            throw err;
        }
    };

    const handleResolve = async (id: any) => {
        try {
            await writeContract({
                address: contractAddress,
                abi: contractABI,
                functionName: 'resolve',
                args: [id],
            })
        } catch (err: any) {
            console.error("Error handling resolve:", err.message);
            console.error('Contract Error', contractError)
            throw err;
        }
    };

    return {
        handleConfession,
        handleForgive,
        handleResolve,
    };
}