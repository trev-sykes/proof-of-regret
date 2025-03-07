import styles from "./Documents.module.css";
import { Link } from "react-router-dom";

const Documents: React.FC = () => {

    return (
        <div className={styles.container}>
            <Link
                to={"/docs"}
                className={styles.connectButton}
            >Docs</Link>
        </div>
    );
};

export default Documents;