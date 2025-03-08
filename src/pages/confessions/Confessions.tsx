import ConfessionsList from "../../components/confessionUi/ConfessionUi"
import TransitionLayout from "../../components/transitionLayout/TransitionLayout";
interface ConfessionsProps {
    setPaths: any;
}
const Confessions: React.FC<ConfessionsProps> = () => {
    return (
        <TransitionLayout>
            <ConfessionsList />
        </TransitionLayout>
    )
}
export default Confessions;