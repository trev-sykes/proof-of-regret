import React, { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LogIn, LogOut, Home, FileText, ChevronLeft } from 'lucide-react';
import Blockies from 'react-blockies';
import { usePathnameStore } from '../../store/usePathnameStore';
import styles from './Navigation.module.css';
import { ConnectWallet } from '../walletSelector/ConnectWallet';
import { useAccount, useDisconnect, useEnsName } from 'wagmi';

const Navigation: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentPath, previousPath, setPaths } = usePathnameStore();
    const { address } = useAccount();

    // Update paths when location changes
    useEffect(() => {
        setPaths(location.pathname);
    }, [location, setPaths]);

    return (
        <>
            <nav className={styles.navigation}>
                {/* Left Section: Logo, Home Button, and Back Button */}
                <div className={styles.leftContainer}>
                    <span className={styles.logoTag}>Proof-Of-Regret</span>

                    {currentPath !== '/' && currentPath !== '/docs' && (
                        <Link to="/" className={styles.homeButton}>
                            <Home size={18} />
                            <span>Home</span>
                        </Link>
                    )}

                    {currentPath === '/docs' && (
                        <div
                            className={styles.documentButton}
                            onClick={() => navigate(previousPath && previousPath !== '/docs' ? previousPath : '/')}
                        >
                            <ChevronLeft className={styles.back} size={18} />
                            <span>Back</span>
                        </div>
                    )}
                </div>

                {/* Right Section: Docs Link & Wallet Connection */}
                <div className={styles.rightContainer}>
                    <Link to="/docs" className={styles.documentButton}>
                        <FileText size={18} />
                        <span>Docs</span>
                    </Link>

                    <div className={styles.connectButtonContainer}>
                        {!address ? (
                            <div className={styles.connectButton} >
                                <LogIn size={18} />
                                <span>Connect</span>
                            </div>
                        ) : (
                            <WalletInfo />
                        )}
                    </div>
                </div>
            </nav >

            {/* Wallet Selector Modal */}
            < ConnectWallet />
        </>
    );
};

// 🏦 Extracted Wallet Info Component for Readability
const WalletInfo: React.FC = () => {
    const { address } = useAccount();
    const { disconnect } = useDisconnect();
    const { data: ensName } = useEnsName({ address });
    return (
        <div className={styles.walletInfoContainer}>

            <div className={styles.walletInfo}>
                <Blockies className={styles.blockies} seed={address || ''} size={7} scale={3} />
                <span className={styles.address}>
                    {ensName && <p>{ensName}</p>}
                    {address
                        ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
                        : "Not connected"}
                </span>
                <div className={styles.disconnectButton} onClick={() => disconnect()}>
                    <LogOut size={18} />
                </div>
            </div>
        </div>
    );
};

export default Navigation;
