
import ConfessUi from "../../components/confessUi/ConfessUi";
import TransitionLayout from "../../components/transitionLayout/TransitionLayout";
interface ConfessProps {
    setPaths?: any;
}
const Confess: React.FC<ConfessProps> = () => {

    return (
        <TransitionLayout>
            <ConfessUi />
        </TransitionLayout >
    )
}
export default Confess;