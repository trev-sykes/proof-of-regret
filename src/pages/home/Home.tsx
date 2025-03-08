import { useEffect } from "react";
import Hero from "../../components/homeUi/HomeUi"
import TransitionLayout from "../../components/transitionLayout/TransitionLayout";
interface HomeProps {
    setPaths: any;
    currentPath?: any;
}
const Home: React.FC<HomeProps> = ({ setPaths, currentPath }) => {
    useEffect(() => {
        setPaths('/');
        console.log(`Current Path: ${currentPath}`);
    }, []);
    return (
        <TransitionLayout>
            <Hero />
        </TransitionLayout>
    )
}
export default Home;
