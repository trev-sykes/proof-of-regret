import { createPublicClient, http } from 'viem';
import { arbitrumSepolia } from 'viem/chains';
import { contractABI, contractAddress } from '../contracts/ProofOfRegret';

const rpcUrl = import.meta.env.VITE_INFURA_RPC_URL;
const publicClient = createPublicClient({
    chain: arbitrumSepolia,
    transport: http(rpcUrl),
});

// Fetch confession data from the smart contract in parallel
const getConfessionCount = async () => {
    if (!publicClient) return;
    try {
        return await publicClient.readContract({
            address: contractAddress,
            abi: contractABI,
            functionName: 'confessionCount'

        })

    } catch (err: any) {
        console.error('Error grabbing confession count', err.message);
        return null;
    }
}
const getConfession = async (id: any) => {
    if (!publicClient) return;
    try {
        return await publicClient.readContract({
            address: contractAddress,
            abi: contractABI,
            functionName: 'getConfession',
            args: [BigInt(id)]
        })

    } catch (err: any) {
        console.error('Error grabbing confesssion', err.message);
        return null;
    }
}
export { getConfessionCount, getConfession }
