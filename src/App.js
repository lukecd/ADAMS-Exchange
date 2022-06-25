import Layout from "./components/Layout";
import { Routes, Route } from "react-router-dom";
import Home42 from "./pages/Home42";
import Swap from "./pages/Swap";
import FreeTokens from "./pages/FreeTokens";
import Staking from "./pages/Staking";
import ClaimRewards from "./pages/ClaimRewards";


function App() {
    return (
        <>
        <Layout>
            <Routes>
                <Route path="/" exact>
                    <Home42 />
                </Route>
                <Route path="/free-tokens">
                    <FreeTokens />
                </Route>
                <Route path="/swap">
                    <Swap />
                </Route>
                <Route path="/staking">
                    <Staking />
                </Route>
                <Route path="/claim-rewards">
                    <ClaimRewards />
                </Route>
            </Routes>
        </Layout>
        </>
    );
}

export default App;
