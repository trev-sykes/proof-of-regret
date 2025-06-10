import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useForm } from '../../hooks/useForm';
import styles from './ConfessUi.module.css';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { parseEther } from 'viem';
import { contractABI, contractAddress } from '../../contracts/ProofOfRegret';
import { useAlertStore } from '../../store/alertStore';

// Spinner for loading flair
const Spinner = () => <div className={styles.spinner}></div>;

// Character limit alert
interface CharacterLimitAlertProps { message: string; }
const CharacterLimitAlert: React.FC<CharacterLimitAlertProps> = ({ message }) => (
    <div className={styles.alert}>{message}</div>
);

const ConfessionMain: React.FC = () => {
    const { setAlert } = useAlertStore();
    const { formInputs, handleInputChange } = useForm({ confess: '' });
    const [isConfessing, setIsConfessing] = useState(false);

    // Updated contract write hook
    const {
        data: hash,
        writeContract,
        error: contractError
    } = useWriteContract();

    const {
        isLoading: isTxLoading,
        isSuccess: isTxSuccess
    } = useWaitForTransactionReceipt({
        hash,
    });
    useEffect(() => {
        if (isTxLoading) {
            setAlert({
                action: 'confess',
                type: 'pending',
                message: `Confession pending`
            })
        }
        if (isTxSuccess) {
            setAlert({
                action: 'confess',
                type: 'success',
                message: `Confession successful!`
            })

        }
    }, [isTxLoading, isTxSuccess])

    const handleConfession = async (confession: string) => {
        try {
            const amount: any = parseEther('0.001');
            await writeContract({
                address: contractAddress,
                abi: contractABI,
                functionName: 'confess',
                args: [confession],
                value: amount
            })
        } catch (err: any) {
            console.error("Error handling confession:", err.message);
            console.error('Contract Error', contractError)
            throw err;
        }
    };
    // Fade-in on mount
    useEffect(() => {
        const container = document.querySelector(`.${styles.container}`);
        if (container) container.classList.add(styles.mounted);
    }, []);

    // Confession handler with X integration
    const confess = async () => {
        const { confess } = formInputs;
        const result = await Swal.fire({
            title: 'Confirm Your Confession',
            html: 'Price is 0.001 ETH?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Confess',
            cancelButtonText: 'Nah',
        });

        if (result.isConfirmed) {
            setIsConfessing(true);
            try {
                await handleConfession(confess);
                handleInputChange('confess')({ target: { value: '' } });
            } catch (err: any) {
                console.error("Error with confession ", err.message);
            } finally {
                setIsConfessing(false);
            }
        }
    };

    const confessionLength = formInputs.confess.length;
    const isValidLength = confessionLength >= 20 && confessionLength <= 280;

    return (
        <section className={styles.container}>
            <div className={styles.confessContainer}>
                <div className={styles.inputContainer}>
                    <label htmlFor="confession" className={styles.label}>
                        Confess Your Soul
                    </label>
                    <textarea
                        id="confession"
                        value={formInputs.confess}
                        onChange={handleInputChange('confess')}
                        placeholder="Drop your regret here..."
                        className={styles.textarea}
                        aria-label="Your confession"
                    />
                    <div className={`${styles.characterCount} ${confessionLength < 20 ? styles.tooShort :
                        confessionLength > 280 ? styles.tooLong :
                            styles.valid
                        }`}>
                        {confessionLength}/280
                    </div>
                    {formInputs.confess && confessionLength < 20 && (
                        <CharacterLimitAlert message="Minimum 20 characters!" />
                    )}
                </div>
                <button
                    type="button"
                    onClick={confess}
                    disabled={!isValidLength || isConfessing}
                    className={`${styles.button} ${!isValidLength || isConfessing ? styles.disabled : styles.active
                        }`}
                >
                    {isConfessing ? <Spinner /> : 'Confess'}
                </button>
            </div>
        </section>
    );
};

export default ConfessionMain;