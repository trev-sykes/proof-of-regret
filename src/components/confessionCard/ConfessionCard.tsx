import React, { } from "react";
import { useState } from "react";
import Blockies from 'react-blockies';
import Countdown from "../countdown/Countdown";
import styles from "./ConfessionCard.module.css"

// Memoized ConfessionCard component with expandable text
interface ConfessionCardProps {
    signerAddress: any;
    confession: any;
    type: 'active' | 'inactive' | 'forgiven' | 'unforgiven' | 'ready-for-resolve';
    resolve: Function;
    forgive: Function;
}

const ConfessionCard: React.FC<ConfessionCardProps> = React.memo(({ signerAddress, confession, type, resolve, forgive }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const isUserConfessor = confession.confessor.toLowerCase() === signerAddress.toLowerCase();
    const hasUserForgiven = confession.forgivers.some(
        (address: string) => address.toLowerCase() === signerAddress.toLowerCase()
    );
    const forgiveCount = confession.forgivers.length;
    const isResolved = confession.resolved;

    const toggleExpand = () => setIsExpanded(!isExpanded);
    // Utility function to shorten Ethereum addresses
    const shortenAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

    return (
        <article className={styles.card}>
            <header className={styles.cardHeader}>
                {/* New top row for avatar and badge */}
                <div className={styles.topRow}>
                    <div className={styles.confessorInfo}>
                        <Blockies seed={confession.confessor} size={8} scale={4} className={styles.avatar} />
                        <span>{shortenAddress(confession.confessor)}</span>
                    </div>
                    <div className={`${styles.badge} ${type === 'active' ? styles.badgeActive : type === 'inactive' ? styles.badgeInactive : type == 'unforgiven' ? styles.badgeUnforgiven : styles.badgeForgiven}`}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </div>
                </div>

                {/* Enhanced confession text container */}
                <div className={styles.titleContainer}>
                    <h3 className={isExpanded ? styles.expanded : styles.truncated}>
                        {confession.confession}
                    </h3>
                    {confession.confession.length > 50 && (
                        <button
                            onClick={toggleExpand}
                            aria-label={isExpanded ? 'Collapse confession text' : 'Expand confession text'}
                            className={styles.readMoreButton}
                        >
                            {isExpanded ? 'Read less' : 'Read more'}
                        </button>
                    )}
                </div>
            </header>
            <section className={styles.cardBody}>
                {type === 'active' && (
                    <div className={styles.countdownWrapper}>
                        <span className={styles.countdownLabel}>Time remaining:</span>
                        <Countdown endTimestamp={confession.deadline} />
                    </div>
                )}
                <div className={styles.progressSection}>
                    <div className={styles.progressInfo}>
                        <span className={styles.progressLabel}>Forgiveness:</span>
                        <div className={styles.progressBarContainer} role="progressbar" aria-valuenow={forgiveCount} aria-valuemin={0} aria-valuemax={12}>
                            <div
                                className={`${styles.progressBar} ${forgiveCount < 6 ? styles.progressBarLow : forgiveCount < 12 ? styles.progressBarMedium : styles.progressBarFull}`}
                                style={{ width: `${(forgiveCount / 12) * 100}%` }}
                            ></div>
                        </div>
                        <span className={styles.progressCount}>
                            {forgiveCount}/12
                        </span>
                    </div>
                    <div className={styles.actionButtons}>
                        {!isUserConfessor && !hasUserForgiven && type !== 'forgiven' && type != 'ready-for-resolve' && type != 'unforgiven' && (
                            <button
                                onClick={() => forgive(confession.id)}
                                className={styles.forgiveButton}
                                data-tooltip-id="forgive-tooltip"
                            >
                                Forgive
                            </button>
                        )}
                        {type == 'ready-for-resolve' && !isResolved && (
                            <button
                                onClick={() => resolve(confession.id)}
                                className={styles.resolveButton}
                                data-tooltip-id="resolve-tooltip"
                            >
                                Resolve
                            </button>
                        )}
                        {hasUserForgiven && type != 'unforgiven' && type != 'ready-for-resolve' && <span className={styles.statusTag}>You Forgave</span>}
                        {isUserConfessor && type != 'ready-for-resolve' && type != 'unforgiven' && < span className={styles.statusTag}>Your Confession</span>}
                    </div>
                </div>
            </section>
        </article >
    );
});

export default ConfessionCard;