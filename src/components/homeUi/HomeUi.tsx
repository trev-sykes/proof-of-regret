import styles from "./HomeUi.module.css";
import { Link } from "react-router-dom";
const Home: React.FC = () => {

    return (
        <section className={styles.hero}>
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.titleContainer}>
                        <h1 className={styles.title}>Rug Your Regret</h1>
                        <div className={styles.buttonContainer}>
                            <Link to="/confess" className="buttonMain">Submit Regret</Link>
                            <Link to="/confessions" className="buttonMain">View Regrets</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default Home;