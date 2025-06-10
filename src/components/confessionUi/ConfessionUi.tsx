import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Tooltip } from 'react-tooltip';
import Swal from 'sweetalert2';
import styles from "./ConfessionUi.module.css";
import ConfessionCard from '../confessionCard/ConfessionCard';
import { getConfession, getConfessionCount } from '../../hooks/useContractRead';
import { filter } from '../../utils/filter';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { contractABI, contractAddress } from '../../contracts/ProofOfRegret';
import { parseEther } from 'viem';
import { ActionType, useAlertStore } from '../../store/alertStore';

export interface Confession {
    id: string | number;
    confessor: string;
    confession: string;
    amount: string | number | BigInt;
    forgiveness: string | number | BigInt;
    deadline: string | BigInt;
    resolved: boolean;
    forgiven: boolean;
    forgivers: string[];
}

type SectionType = 'active' | 'readyToResolve' | 'forgiven' | 'unforgiven' | 'all';

const ConfessionsUI: React.FC = () => {
    const { setAlert } = useAlertStore();
    const [confessions, setConfessions] = useState<Confession[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasInitialized, setHasInitialized] = useState(false);
    const [activeSection, setActiveSection] = useState<SectionType>('all');
    const [isMobile, setIsMobile] = useState(false); // New state for mobile detection

    const actionTypeRef = useRef<ActionType | null>(null);
    const messageTypeRef = useRef<any>(null);
    const { data: hash, writeContract, error: contractError } = useWriteContract();
    const { isLoading: isTxLoading, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({ hash });

    // Handle window resize to toggle mobile view
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 600);
        };
        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (isTxLoading) {
            setAlert({
                action: actionTypeRef.current,
                type: 'pending',
                message: `${messageTypeRef.current} pending`
            });
        }
        if (isTxSuccess) {
            setAlert({
                action: actionTypeRef.current,
                type: 'success',
                message: `${messageTypeRef.current} successful!`
            });
        }
    }, [isTxLoading, isTxSuccess, setAlert]);

    const handleForgive = async (id: number) => {
        actionTypeRef.current = 'forgive';
        messageTypeRef.current = 'Forgiveness ';
        try {
            const fee = parseEther('0.0001');
            await writeContract({
                address: contractAddress,
                abi: contractABI,
                functionName: 'forgive',
                args: [id],
                value: fee
            });
        } catch (err: any) {
            console.error("Error handling forgive:", err.message);
            console.error('Contract Error', contractError);
            actionTypeRef.current = null;
            messageTypeRef.current = null;
            throw err;
        }
    };

    const handleResolve = async (id: any) => {
        actionTypeRef.current = 'resolve';
        messageTypeRef.current = 'Resolve ';
        try {
            await writeContract({
                address: contractAddress,
                abi: contractABI,
                functionName: 'resolve',
                args: [id],
            });
        } catch (err: any) {
            console.error("Error handling resolve:", err.message);
            console.error('Contract Error', contractError);
            actionTypeRef.current = null;
            messageTypeRef.current = null;
            throw err;
        }
    };

    const fetchData = useCallback(async () => {
        try {
            const count = await getConfessionCount();
            console.log("Confession count:", count);
            let countNumber: number;
            if (typeof count === 'bigint') {
                countNumber = Number(count);
            } else if (typeof count === 'string') {
                countNumber = parseInt(count);
            } else if (count === null || count === undefined) {
                countNumber = 0;
            } else {
                countNumber = 0;
            }

            const adjustedCount = Math.min(countNumber, 50);

            if (adjustedCount <= 0) {
                console.log("No confessions to fetch");
                setConfessions([...confessions]);
                setIsLoading(false);
                return;
            }

            const confessionPromises = Array.from({ length: adjustedCount }, (_, i) =>
                getConfession((i + 1).toString())
                    .then((data: any) => ({
                        id: i + 1,
                        confessor: data[0],
                        confession: data[1],
                        amount: data[2],
                        forgiveness: data[3],
                        deadline: data[4],
                        resolved: data[5],
                        forgiven: data[6],
                        forgivers: data[7],
                    }))
                    .catch((err: any) => {
                        console.error(`Error fetching confession ${i + 1}:`, err);
                        return null;
                    })
            );

            console.log("Getting data for", adjustedCount, "confessions");
            const confessionsData = await Promise.all(confessionPromises);
            const validConfessions = confessionsData.filter(c => c !== null) as Confession[];
            console.log("Confession data:", validConfessions);
            setConfessions(validConfessions);
        } catch (err: any) {
            console.error("Error fetching data:", err.message);
        } finally {
            setIsLoading(false);
            setHasInitialized(true);
        }
    }, [confessions]);

    useEffect(() => {
        if (!hasInitialized) {
            fetchData();
        }
    }, [fetchData, hasInitialized]);

    const forgive = async (id: number) => {
        const result = await Swal.fire({
            title: 'Confirm Forgiveness',
            text: 'You will send 0.0001 ETH to forgive this confession.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, forgive',
            cancelButtonText: 'Nah'
        });

        if (result.isConfirmed) {
            try {
                await handleForgive(id);
                await fetchData();
            } catch (err: any) {
                const reason = err.reason || err.message;
                if (reason.includes('MustSendExactly0_0001ETH')) {
                } else if (reason.includes('ConfessionAlreadyResolved')) {
                } else if (reason.includes('MaximumForgivesReached')) {
                } else {
                }
            }
        }
    };

    const resolve = async (id: number) => {
        const result = await Swal.fire({
            title: 'Confirm Resolution',
            text: 'You will resolve this confession.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, resolve',
            cancelButtonText: 'Nah'
        });

        if (result.isConfirmed) {
            try {
                await handleResolve(id);
                await fetchData();
            } catch (err: any) {
                const reason = err.reason || err.message;
                if (reason.includes('ConfessionAlreadyResolved')) {
                } else if (reason.includes('DeadlineNotReached')) {
                } else {
                }
            }
        }
    };

    const handleRefresh = () => {
        setIsLoading(true);
        fetchData();
    };

    const sectionTabs = [
        { id: 'all', label: 'All Confessions' },
        { id: 'active', label: `Active (${filter.activeConfessions(confessions).length})` },
        { id: 'readyToResolve', label: `Ready to Resolve (${filter.readyToResolveConfessions(confessions).length})` },
        { id: 'forgiven', label: `Forgiven (${filter.resolvedConfessionsByForgiveness(confessions, true).length})` },
        { id: 'unforgiven', label: `Unforgiven (${filter.resolvedConfessionsByForgiveness(confessions, false).length})` }
    ];

    const renderActiveSection = () => {
        if (activeSection === 'all') {
            return (
                <>
                    {renderSection('active', 'Active Confessions')}
                    {renderSection('readyToResolve', 'Ready to Resolve')}
                    {renderSection('forgiven', 'Forgiven Confessions')}
                    {renderSection('unforgiven', 'Unforgiven Confessions')}
                </>
            );
        } else {
            const sectionMap = {
                'active': 'Active Confessions',
                'readyToResolve': 'Ready to Resolve',
                'forgiven': 'Forgiven Confessions',
                'unforgiven': 'Unforgiven Confessions'
            };

            return renderSection(activeSection, sectionMap[activeSection as keyof typeof sectionMap]);
        }
    };

    const renderSection = (sectionType: SectionType, title: string) => {
        let sectionConfessions: Confession[] = [];
        let cardType: 'active' | 'inactive' | 'forgiven' | 'unforgiven' | 'ready-for-resolve' = 'active';

        switch (sectionType) {
            case 'active':
                sectionConfessions = filter.activeConfessions(confessions);
                cardType = 'active';
                break;
            case 'readyToResolve':
                sectionConfessions = filter.readyToResolveConfessions(confessions);
                cardType = 'ready-for-resolve';
                break;
            case 'forgiven':
                sectionConfessions = filter.resolvedConfessionsByForgiveness(confessions, true);
                cardType = 'forgiven';
                break;
            case 'unforgiven':
                sectionConfessions = filter.resolvedConfessionsByForgiveness(confessions, false);
                cardType = 'unforgiven';
                break;
            default:
                return null;
        }

        return (
            <div className={styles.section} key={sectionType}>
                <h2 className={styles.sectionTitle}>
                    {title} ({sectionConfessions.length})
                </h2>
                {sectionConfessions.length > 0 ? (
                    <div className={styles.cardGrid}>
                        {sectionConfessions.map((confession, index) => (
                            <ConfessionCard
                                key={`${sectionType}-${index}`}
                                confession={confession}
                                type={cardType}
                                resolve={resolve}
                                forgive={forgive}
                            />
                        ))}
                    </div>
                ) : (
                    <p className={styles.emptyMessage}>No {title.toLowerCase()} found</p>
                )}
            </div>
        );
    };

    if (isLoading) {
        return <div className={styles.loading}>Loading confessions...</div>;
    }

    return (
        <div className={styles.container}>
            <Tooltip id="forgive-tooltip" content="Forgive this confession (costs 0.0001 ETH)" />
            <Tooltip id="resolve-tooltip" content="Resolve this confession (only after expiration)" />
            <div className={styles.sectionTabs}>
                {isMobile ? (
                    <select
                        className={styles.sectionDropdown}
                        value={activeSection}
                        onChange={(e) => setActiveSection(e.target.value as SectionType)}
                    >
                        {sectionTabs.map((tab) => (
                            <option key={tab.id} value={tab.id}>
                                {tab.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    sectionTabs.map((tab) => (
                        <div
                            key={tab.id}
                            className={`${styles.sectionTab} ${activeSection === tab.id ? styles.active : ''}`}
                            onClick={() => setActiveSection(tab.id as SectionType)}
                        >
                            {tab.label}
                        </div>
                    ))
                )}
                <button
                    onClick={handleRefresh}
                    className="animationButton"
                >
                    Refresh
                </button>
            </div>
            {renderActiveSection()}
        </div>
    );
};

export default ConfessionsUI;