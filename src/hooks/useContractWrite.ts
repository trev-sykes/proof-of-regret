import proofOfRegret from "../contracts/ProofOfRegret";
import { ethers } from "ethers";
import useProviderStore from "../store/useProviderAndSIgnerStore";

export default function useContractWrite() {
    const { signer } = useProviderStore();

    const handleConfession = async (confession: string) => {
        try {
            const contractInstance = new ethers.Contract(
                proofOfRegret.contractAddress,
                proofOfRegret.contractABI,
                signer
            );
            const amount: any = ethers.parseEther('0.001');
            const tx = await contractInstance.confess(confession, { value: amount });
            return tx;
        } catch (err: any) {
            console.error("Error handling confession:", err.message);
            throw err;
        }
    };

    const handleForgive = async (id: number) => {
        try {
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

    return {
        handleConfession,
        handleForgive,
        handleResolve,
    };
}