import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Home from "./pages/home/Home"
import Confess from "./pages/confess/Confess";
import TransitionLayout from "./components/transitionLayout/TransitionLayout"
import Confessions from "./pages/confessions/Confessions";
import Docs from "./pages/docs/Docs";
import { usePathnameStore } from "../src/store/usePathnameStore"
import Navigation from "./components/navigation/Navigation";
import { useInternetCheck } from "./hooks/useInternetCheck";
import Offline from "./components/offline/Offline";

function App() {
  const onLine = useInternetCheck();

  const { setPaths, currentPath } = usePathnameStore();
  if (!onLine) return <Offline />
  return (
    <div>
      <Router>
        <TransitionLayout>
          <Navigation />
          <Routes>
            <Route path={"/"} element={<Home setPaths={setPaths} currentPath={currentPath} />} />
            <Route path={"/confess"} element={<Confess setPaths={setPaths} />} />
            <Route path={"/confessions"} element={<Confessions setPaths={setPaths} />} />
            <Route path={"/docs"} element={<Docs setPaths={setPaths} />} />
          </Routes >
        </TransitionLayout>
      </Router>
    </div>
  )
}

export default App
