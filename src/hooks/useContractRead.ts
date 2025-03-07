import { useCallback, useRef, useState } from "react";
import proofOfRegret from "../contracts/ProofOfRegret";
import { ethers } from "ethers";
export default function useContractRead() {
    const [contractInformation, setContractInformation] = useState({
        totalConfessions: 0,
    })
    const rpcUrl = import.meta.env.VITE_INFURA_RPC_URL;
    if (!rpcUrl) {
        throw new Error('RPC URL not configured. Please check your environment variables.');
    }
    const refreshProtocolState = useCallback(async () => {
        try {
            const provider = new ethers.JsonRpcProvider(rpcUrl, {
                name: 'https://sepolia-rollup.arbitrum.io/rpc',
                chainId: 421614
            })
            await provider.ready;
            const contract = new ethers.Contract(
                proofOfRegret.contractAddress,
                proofOfRegret.contractABI,
                provider
            );

            const [confessionCountResponse] = await Promise.all(
                [contract.confessionCount()]
            );
            setContractInformation({
                ...contractInformation,
                totalConfessions: confessionCountResponse,
            })

        } catch (err: any) {
            console.error(err.message);
        }
    }, []);
    const contractConfessionCountRef = useRef(false);
    const getConfessionCount = async () => {
        if (contractConfessionCountRef.current) return;
        contractConfessionCountRef.current = true;
        try {
            const provider = new ethers.JsonRpcProvider(rpcUrl, {
                name: 'https://sepolia-rollup.arbitrum.io/rpc',
                chainId: 421614
            })
            await provider.ready;
            const contract = new ethers.Contract(
                proofOfRegret.contractAddress,
                proofOfRegret.contractABI,
                provider
            );
            const response = await contract.confessionCount();
            if (response)
                return response;
        } catch (err: any) {
            console.error(err.message);
        }

    }
    const getConfession = async (id: string) => {
        const provider = new ethers.JsonRpcProvider(rpcUrl, {
            name: 'https://sepolia-rollup.arbitrum.io/rpc',
            chainId: 421614
        });
        const contract = new ethers.Contract(proofOfRegret.contractAddress, proofOfRegret.contractABI, provider);
        try {
            const response = await contract.getConfession(id);
            if (response)
                return response;
            else
                throw new Error("Error in response");


        } catch (err: any) {
            console.error("Error getting confessions: ", err.message);
        }
    }

    return { refreshProtocolState, getConfessionCount, getConfession, contractInformation };

} 