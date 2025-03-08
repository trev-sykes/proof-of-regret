import styles from "./Alert.module.css";
import { X } from "lucide-react";
import { PuffLoader } from "react-spinners";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
interface AlertProps {
    type: string | null;
    message: string | null;
    onClose: Function;
}
const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {

    return (
        <div className={`${styles.container} ${type == 'error' ? styles.error : type == 'pending' ? styles.pending : type == 'success' ? styles.success : styles.unknown}`}>
            <X className={styles.backButton} onClick={() => onClose()} />
            <div className={styles.content}>

                <span className={`${styles.message} ${type == 'error' ? styles.error : type == 'pending' ? styles.pending : type == 'success' ? styles.success : styles.unknown}`}>{message}</span>
                {type == 'pending' && (
                    <PuffLoader color={'white'} />
                )}
                {type == 'success' && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [0, 1.15, 1], opacity: 1 }}
                        transition={{ duration: 0.75, ease: "easeOut", bounce: .25 }}
                        className={styles.motionContainer}
                    >
                        <CheckCircle size={50} className={styles.spinner} />
                    </motion.div>
                )}
                {type == 'error' && (
                    <motion.div
                        initial={{ x: 0, opacity: 0 }}
                        animate={{ x: [-5, 5, -5, 5, 0], opacity: 1 }}
                        transition={{ duration: 0.75, ease: "easeOut", bounce: .25 }}
                        className={styles.motionContainer}
                    >
                        <XCircle size={50} />
                    </motion.div>
                )}

            </div>
        </div >
    )
}
export default Alert;