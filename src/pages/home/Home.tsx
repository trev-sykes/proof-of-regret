import { useEffect } from "react";
import Hero from "../../components/homeHero/Hero"
import Navigation from "../../components/navigation/Navigation";
import TransitionLayout from "../../components/transitionLayout/TransitionLayout";
// import useAlert from "../../hooks/useAlert";
// import CustomAlert from "../../components/customAlert/CustomAlert";
interface HomeProps {
    setPaths: any;
    currentPath?: any;
}
const Home: React.FC<HomeProps> = ({ setPaths, currentPath }) => {
    // const { alertStatus, showAlert } = useAlert();
    useEffect(() => {
        setPaths('/');
        console.log(`Current Path: ${currentPath}`);
    }, []);
    // useEffect(() => {
    //     showAlert('error', 'This is a test run');
    // }, [])
    return (
        <TransitionLayout>
            {/* {alertStatus && alertStatus.isVisible && (
                <CustomAlert
                    type={alertStatus.type}
                    message={alertStatus.message}
                    onClose={() => showAlert(null, '')}
                />
            )} */}
            <Navigation />

            <Hero />
        </TransitionLayout>
    )
}
export default Home;
