import ConfessionsList from "../../components/confessionsList/ConfessionsList"
import Navigation from "../../components/navigation/Navigation";
import TransitionLayout from "../../components/transitionLayout/TransitionLayout";
interface ConfessionsProps {
    setPaths: any;
}
const Confessions: React.FC<ConfessionsProps> = () => {
    return (
        <TransitionLayout>
            <Navigation />
            <ConfessionsList />
        </TransitionLayout>
    )
}
export default Confessions;