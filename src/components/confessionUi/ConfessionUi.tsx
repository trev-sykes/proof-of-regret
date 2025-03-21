import React, { useEffect, useState, useCallback } from 'react';
import ConfessionCard from '../confessionCard/ConfessionCard';
import { Tooltip } from 'react-tooltip';
import Swal from 'sweetalert2';
import useAlert from '../../hooks/useAlert';
import useContractRead from '../../hooks/useContractRead';
import useContractWrite from '../../hooks/useContractWrite';
import CustomAlert from '../alert/Alert';
import styles from "./ConfessionUi.module.css";

interface Confession {
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
    // State variables for managing component data
    const [confessions, setConfessions] = useState<Confession[]>([]);
    const [showMyConfessions, setShowMyConfessions] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasInitialized, setHasInitialized] = useState(false);
    const [activeSection, setActiveSection] = useState<SectionType>('all');

    // Custom hooks for contract interaction and alerts
    const { getConfessionCount, getConfession } = useContractRead();
    const { handleForgive, handleResolve } = useContractWrite();
    const { alertStatus, showAlert } = useAlert();

    // Fetch confession data from the smart contract in parallel
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
                countNumber = 0;  // Handle case where count is null or undefined
            } else {
                countNumber = count as number;
            }

            const adjustedCount = Math.min(countNumber, 50); // Limit to 50 confessions

            if (adjustedCount <= 0) {
                console.log("No confessions to fetch");
                setConfessions([...confessions]);
                setIsLoading(false);
                return;
            }

            const confessionPromises = Array.from({ length: adjustedCount }, (_, i) =>
                getConfession((i + 1).toString())
                    .then(data => ({
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
                    .catch(err => {
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
    }, [getConfessionCount, getConfession]);

    // Load data on component mount only once
    useEffect(() => {
        if (!hasInitialized) {
            fetchData();
        }
    }, []);

    // Returns active confessions
    const filterActiveConfessions = (confessions: Confession[]) => {
        return confessions.filter(c =>
            new Date(Number(c.deadline) * 1000) >= new Date()
        );
    };

    // Returns ready to be resolved confessions
    const filterReadyToResolveConfessions = (confessions: Confession[]) => {
        return confessions.filter(c => {
            return new Date(Number(c.deadline) * 1000) < new Date() && !c.resolved;
        });
    };

    // Returns resolved confessions that are either forgiven or unforgiven
    const filterResolvedConfessionsByForgiveness = (confessions: Confession[], isForgiven: boolean) => {
        return confessions.filter(c => c.resolved && (c.forgiven === isForgiven));
    };

    // Forgive a confession with confirmation and error handling
    const forgive = async (id: number) => {
        const result = await Swal.fire({
            title: 'Confirm Forgiveness',
            text: 'You will send 0.0001 ETH to forgive this confession.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, forgive',
        });

        if (result.isConfirmed) {
            try {
                showAlert('pending', 'Processing forgiveness...');
                await handleForgive(id);
                await fetchData();
                showAlert('success', 'Forgiveness complete!');
            } catch (err: any) {
                const reason = err.reason || err.message;
                if (reason.includes('MustSendExactly0_0001ETH')) {
                    showAlert('error', 'You must send exactly 0.0001 ETH to forgive.');
                } else if (reason.includes('ConfessionAlreadyResolved')) {
                    showAlert('error', 'This confession has already been resolved.');
                } else if (reason.includes('MaximumForgivesReached')) {
                    showAlert('error', 'You have already forgiven this confession.');
                } else {
                    showAlert('error', `Error: ${reason}`);
                }
            }
        }
    };

    // Resolve a confession with confirmation and error handling
    const resolve = async (id: number) => {
        const result = await Swal.fire({
            title: 'Confirm Resolution',
            text: 'You will resolve this confession.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, resolve',
        });

        if (result.isConfirmed) {
            try {
                showAlert('pending', 'Resolving confession...');
                await handleResolve(id);
                await fetchData();
                showAlert('success', 'Confession resolved successfully!');
            } catch (err: any) {
                const reason = err.reason || err.message;
                if (reason.includes('ConfessionAlreadyResolved')) {
                    showAlert('error', 'This confession has already been resolved.');
                } else if (reason.includes('DeadlineNotReached')) {
                    showAlert('error', 'The confession deadline has not been reached yet.');
                } else {
                    showAlert('error', `Error: ${reason}`);
                }
            }
        }
    };

    // Filter confessions based on user preference
    // const filteredConfessions = showMyConfessions && signer && signer.address
    //     ? confessions.filter(c => c.confessor.toLowerCase() === signer.address.toLowerCase())
    //     : confessions;
    const filteredConfessions = confessions;

    // Handle refresh button click
    const handleRefresh = () => {
        setIsLoading(true);
        fetchData();
    };

    // Section tabs configuration
    const sectionTabs = [
        { id: 'all', label: 'All Confessions' },
        { id: 'active', label: `Active (${filterActiveConfessions(filteredConfessions).length})` },
        { id: 'readyToResolve', label: `Ready to Resolve (${filterReadyToResolveConfessions(filteredConfessions).length})` },
        { id: 'forgiven', label: `Forgiven (${filterResolvedConfessionsByForgiveness(filteredConfessions, true).length})` },
        { id: 'unforgiven', label: `Unforgiven (${filterResolvedConfessionsByForgiveness(filteredConfessions, false).length})` }
    ];

    // Render the appropriate section based on active tab
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

    // Render a specific section
    const renderSection = (sectionType: SectionType, title: string) => {
        let sectionConfessions: Confession[] = [];
        let cardType: 'active' | 'inactive' | 'forgiven' | 'unforgiven' | 'ready-for-resolve' = 'active';

        switch (sectionType) {
            case 'active':
                sectionConfessions = filterActiveConfessions(filteredConfessions);
                cardType = 'active';
                break;
            case 'readyToResolve':
                sectionConfessions = filterReadyToResolveConfessions(filteredConfessions);
                cardType = 'ready-for-resolve';
                break;
            case 'forgiven':
                sectionConfessions = filterResolvedConfessionsByForgiveness(filteredConfessions, true);
                cardType = 'forgiven';
                break;
            case 'unforgiven':
                sectionConfessions = filterResolvedConfessionsByForgiveness(filteredConfessions, false);
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

    // Render loading state or main UI
    if (isLoading) {
        return <div className={styles.loading}>Loading confessions...</div>;
    }

    return (
        <div className={styles.container}>
            {alertStatus && alertStatus.isVisible && (
                <CustomAlert
                    type={alertStatus.type}
                    message={alertStatus.message}
                    onClose={() => showAlert(null, '')}
                />
            )}

            <div className={styles.filterSection}>
                <label>
                    <input
                        type="checkbox"
                        checked={showMyConfessions}
                        onChange={() => setShowMyConfessions(!showMyConfessions)}
                    />
                    Show only my confessions
                </label>
                <button
                    onClick={handleRefresh}
                    className={styles.refreshButton}
                >
                    Refresh
                </button>
            </div>

            {/* Section tabs */}
            <div className={styles.sectionTabs}>
                {sectionTabs.map((tab) => (
                    <div
                        key={tab.id}
                        className={`${styles.sectionTab} ${activeSection === tab.id ? styles.active : ''}`}
                        onClick={() => setActiveSection(tab.id as SectionType)}
                    >
                        {tab.label}
                    </div>
                ))}
            </div>

            {/* Render the active section */}
            {renderActiveSection()}

            {/* Tooltips */}
            <Tooltip id="forgive-tooltip" content="Forgive this confession (costs 0.0001 ETH)" />
            <Tooltip id="resolve-tooltip" content="Resolve this confession (only after expiration)" />
        </div>
    );
};

export default ConfessionsUI;