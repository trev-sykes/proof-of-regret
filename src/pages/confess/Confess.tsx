
import Main from "../../components/confessionMain/ConfessionMain";
import Navigation from "../../components/navigation/Navigation";
import TransitionLayout from "../../components/transitionLayout/TransitionLayout";
interface ConfessProps {
    setPaths?: any;
}
const Confess: React.FC<ConfessProps> = () => {

    return (
        <TransitionLayout>
            <Navigation />
            <Main />
        </TransitionLayout >
    )
}
export default Confess;