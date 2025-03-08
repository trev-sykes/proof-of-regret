import React, { useEffect } from 'react';
import styles from './Docs.module.css';
import { StepBack } from 'lucide-react';
import { useNavigate } from 'react-router';
import { usePathnameStore } from "../../store/usePathnameStore";
interface DocsProps {
    setPaths: any;
}
const Docs: React.FC<DocsProps> = ({ setPaths }) => {

    return (
        <div className={styles.container}>
            <div className={styles.docsContainer}>
                <h1 className={styles.title}>Proof of Regret:</h1>
                <p className={styles.subtitle}>
                    A digital confessional where regrets bleed into the blockchain, forgiveness is a currency, and absolution hangs in the balance.
                </p>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>The Vision</h2>
                    <p className={styles.sectionText}>
                        Proof Of Regret isn’t just code, it’s a mirror. A raw, unfiltered space where we spill our shadows for 0.001 ETH, daring the world to judge or absolve us. It’s about owning the mess of being human, tossing it into the ether, and seeing if the crowd’s mercy can outweigh the weight. This isn’t a game of tech.. it’s a gamble on grace.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>How It Unfolds</h2>
                    <ul className={styles.featureList}>
                        <li>
                            <strong>Confess:</strong> Drop your regret(280 characters of truth)for 0.001 ETH. It’s yours to own for three days, a ticking clock on your soul’s ledger.
                        </li>
                        <li>
                            <strong>Forgive:</strong> Strangers can tip 0.0001 ETH each to lighten your load. One shot per soul, no stacking the deck. It’s their call to lift you up or let you sit.
                        </li>
                        <li>
                            <strong>Resolve:</strong> Day three hits, and the scales tip. Stack 0.0012 ETH in forgiveness, and you walk away with your deposit plus a 10% nod from the universe. Fall short, and the forgivers carve up your offering — or if no one cares, you split it with the void. Fate’s a coin toss here.
                        </li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>The Big Why</h2>
                    <p className={styles.sectionText}>
                        This dapp’s chasing something primal. Regret’s a ghost we all carry, but what if we could trade it? Not for peace, but for proof. Proof that someone, somewhere, gets it. That 0.0001 ETH isn’t charity; it’s a whisper: “I see you.” And if the threshold holds, it’s a shout: “You’re enough.” Proof Of Regret turns guilt into a collective ritual, a cyberpunk confessional where ETH measures mercy and time cuts the thread. It’s not about winning—it’s about asking: can we forgive each other when it costs something real?
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Key Details</h2>
                    <ul className={styles.featureList}>
                        <li>Entry Price: 0.001 ETH to confess your truth</li>
                        <li>Forgiveness Fee: 0.0001 ETH to offer a hand</li>
                        <li>Redemption Line: 0.0012 ETH to tip the scales</li>
                        <li>Time’s Edge: 3 days to face the music</li>
                        <li>One Voice: Each soul gets a single say</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Under the Hood</h2>
                    <p className={styles.sectionText}>
                        For the tech wanderers: here’s the raw machinery. Built on Solidity ^0.8.27, `ProofOfRegret` runs on Ethereum Arbitrum L2 with a few tight rules. You confess with <span className={styles.code}>confess(string)</span>—0.001 ETH, max 280 chars, locked for 3 days. Others forgive via <span className={styles.code}>forgive(uint256)</span>—0.0001 ETH each, one per address, no self-love allowed. At the end, <span className={styles.code}>resolve(uint256)</span> checks the clock: 0.0012 ETH forgiveness means you get 0.001 ETH back plus a 10% bonus; less, and forgivers split the pot — or it’s 50/50 with the treasury if no one shows. Non-reentrant, pausable by the treasury, and all gas is on you. It’s a lean, mean regret machine.
                    </p>
                </section>
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Contract Address</h2>
                    <a className={styles.sectionText} href="https://sepolia.arbiscan.io/address/0x10ADB72B230DEC34AF93Ba7405C41fd847746DB5" target='_blank'>0x10ADB72B230DEC34AF93Ba7405C41fd847746DB5</a>
                </section>
            </div>
        </div >
    );
};

export default Docs;