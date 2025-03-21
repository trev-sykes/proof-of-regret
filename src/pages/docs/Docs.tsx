import styles from './Docs.module.css';

interface DocsProps {
}
const Docs: React.FC<DocsProps> = () => {
    return (
        <div className={styles.container}>
            <div className={styles.docsContainer}>
                <h1 className={styles.title}>Proof of Regret:</h1>
                <p className={styles.subtitle}>
                    A digital confessional where regrets bleed into the blockchain, forgiveness is a currency, and absolution hangs in the balance.
                </p>

                {/* How to Play Section */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>How to Play</h2>
                    <p className={styles.sectionText}>
                        In Proof of Regret, you participate by confessing your regrets, receiving forgiveness, and striving for redemption. Here’s how:
                    </p>
                    <ul className={styles.featureList}>
                        <li><strong>Step 1 - Confess:</strong> Share your regret (up to 280 characters) for 0.001 ETH. Your confession is locked for 3 days.</li>
                        <li><strong>Step 2 - Forgive:</strong> Others can forgive you by tipping 0.0001 ETH. Each person can only forgive once.</li>
                        <li><strong>Step 3 - Resolve:</strong> If you collect 0.0012 ETH in forgiveness by the end of 3 days, you’ll get your 0.001 ETH deposit back with a 10% bonus. Otherwise, the forgivers share your deposit or it’s lost to the void.</li>
                    </ul>
                </section>

                {/* The Vision Section */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>The Vision</h2>
                    <p className={styles.sectionText}>
                        Proof Of Regret isn’t just code, it’s a mirror. A raw, unfiltered space where we spill our shadows for 0.001 ETH, daring the world to judge or absolve us. It’s about owning the mess of being human, tossing it into the ether, and seeing if the crowd’s mercy can outweigh the weight. This isn’t a game of tech... it’s a gamble on grace.
                    </p>
                </section>

                {/* How It Unfolds Section */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>How It Unfolds</h2>
                    <ul className={styles.featureList}>
                        <li><strong>Confess:</strong> Share your regret for 0.001 ETH. It’s yours to own for three days, locked in time.</li>
                        <li><strong>Forgive:</strong> Others can tip 0.0001 ETH to forgive your regret. Each person has one chance to forgive you, no more.</li>
                        <li><strong>Resolve:</strong> At the end of three days, if you have 0.0012 ETH in forgiveness, you get your deposit back plus a 10% bonus. If you don’t, the forgivers take your deposit or it’s split with the void.</li>
                    </ul>
                </section>

                {/* Incentives for Players Section */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Incentives for Players</h2>
                    <p className={styles.sectionText}>
                        There’s more than just a philosophical reward here. As a player, you can gain:
                    </p>
                    <ul className={styles.featureList}>
                        <li><strong>Confessors:</strong> Earn back your 0.001 ETH deposit plus a 10% bonus if you receive enough forgiveness.</li>
                        <li><strong>Forgivers:</strong> Offer empathy to someone in need, and help them heal. You might also benefit if the confession is redeemed.</li>
                    </ul>
                </section>

                {/* The Big Why Section */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>The Big Why</h2>
                    <p className={styles.sectionText}>
                        Proof Of Regret turns guilt into a collective ritual, a cyberpunk confessional where ETH measures mercy, and time cuts the thread. It’s not about winning — it’s about asking: can we forgive each other when it costs something real? By participating, you engage in a process of shared human experience, where the simple act of confession can earn you both empathy and potential financial reward. It’s more than a game; it’s a digital catharsis.
                    </p>
                </section>

                {/* Key Details Section */}
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

                {/* Under the Hood Section */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Under the Hood</h2>
                    <p className={styles.sectionText}>
                        For the tech wanderers: here’s the raw machinery. Built on Solidity ^0.8.27, `ProofOfRegret` runs on Ethereum Arbitrum L2 with a few tight rules. You confess with <span className={styles.code}>confess(string)</span>—0.001 ETH, max 280 chars, locked for 3 days. Others forgive via <span className={styles.code}>forgive(uint256)</span>—0.0001 ETH each, one per address, no self-love allowed. At the end, <span className={styles.code}>resolve(uint256)</span> checks the clock: 0.0012 ETH forgiveness means you get 0.001 ETH back plus a 10% bonus; less, and forgivers split the pot — or it’s 50/50 with the treasury if no one shows. Non-reentrant, pausable by the treasury, and all gas is on you. It’s a lean, mean regret machine.
                    </p>
                </section>

                {/* Contract Address Section */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Contract Address</h2>
                    <a className={styles.sectionText} href="https://sepolia.arbiscan.io/address/0x10ADB72B230DEC34AF93Ba7405C41fd847746DB5" target='_blank'>0x10ADB72B230DEC34AF93Ba7405C41fd847746DB5</a>
                </section>
            </div>
        </div >
    );
};

export default Docs;
