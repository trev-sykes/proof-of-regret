import { useEffect } from "react";
import useContractRead from "../../hooks/useContractRead";
import styles from "./HomeUi.module.css";
import { Link } from "react-router-dom";
const Home: React.FC = () => {
    const { refreshProtocolState } = useContractRead();
    useEffect(() => {
        refreshProtocolState();
    }, [])
    return (
        <section className={styles.hero}>
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.titleContainer}>
                        <h1 className={styles.title}>Rug Your Regret</h1>
                        <div className={styles.buttonContainer}>
                            <Link to="/confess" className={styles.button}>Submit Regret</Link>
                            <Link to="/confessions" className={styles.button}>View Regrets</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default Home;