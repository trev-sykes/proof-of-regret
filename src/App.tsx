import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Confess from "./pages/confess/Confess";
import TransitionLayout from "./components/transitionLayout/TransitionLayout";
import Confessions from "./pages/confessions/Confessions";
import Docs from "./pages/docs/Docs";
import { usePathnameStore } from "../src/store/usePathnameStore";
import Navigation from "./components/navigation/Navigation";
import { useInternetCheck } from "./hooks/useInternetCheck";
import Offline from "./components/offline/Offline";
import { useEffect } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "./wagmi";
import Alert from './components/alert/Alert';
import { useOnline } from "./hooks/useOnline";
import { useAlertStore } from "./store/alertStore";

function App() {
  const client = new QueryClient();
  const isOnline = useOnline();
  useEffect(() => {
    const alertStore = useAlertStore.getState();

    if (isOnline) {
      // 1. Clear 'persist' alerts
      const persistAlerts = alertStore.alerts.filter(
        (alert) => alert.type === 'persist'
      );
      persistAlerts.forEach((alert) => {
        alertStore.clearAlert(alert.id);
      });

      // 2. Show brief 'network restored' alert
      alertStore.setAlert({
        action: null,
        type: 'network',
        message: '✅ Connected',
      });
    } else {
      // Only show if not already displayed
      const hasPersist = alertStore.alerts.some(
        (alert: any) => alert.type === 'persist'
      );
      if (!hasPersist) {
        alertStore.setAlert({
          action: 'persist',
          type: 'persist',
          message: '⚠️ No connection',
        });
      }
    }
  }, [isOnline]);

  const onLine = useInternetCheck();
  const { setPaths, currentPath } = usePathnameStore();
  if (!onLine) return <Offline />
  return (
    <WagmiProvider config={config} >
      <QueryClientProvider client={client} >
        <Router>
          <TransitionLayout>
            <Navigation />
            <Alert />
            <Routes>
              <Route path={"/"} element={<Home setPaths={setPaths} currentPath={currentPath} />} />
              <Route path={"/confess"} element={<Confess setPaths={setPaths} />} />
              <Route path={"/confessions"} element={<Confessions setPaths={setPaths} />} />
              <Route path={"/docs"} element={<Docs />} />
            </Routes >
          </TransitionLayout>
        </Router>
      </QueryClientProvider>
    </WagmiProvider >
  )
}

export default App
