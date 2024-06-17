import { Route, HashRouter as Router, Routes } from "react-router-dom";
import Identification from "./pages/Execution/Identification";
import Extraction from "./pages/Execution/SubPages/Extraction/Extraction";
import Insertion from "./pages/Execution/SubPages/Insertion/Insertion";
import TestPage from "./pages/TestPage/TestPage";
import AppContext, { AppProvider } from "./components/Context/AppContext";
import { useContext } from "react";

import KeyWordScreen from "./pages/Execution/SubPages/KeyWordScreen/KeyWordScreen";
import Selection from "./pages/Execution/SubPages/Selection/Selection";
import LandingPage from "./pages/LandingPage/LandingPage";
import Finalization from "./pages/NovaRevisao/finalization/Finalization";
import Graphics from "./pages/NovaRevisao/graphics/Graphics";
import NovaRevisao from "./pages/NovaRevisao/novaRevisao";
import Protocol from "./pages/Protocolo/Protocol";
import ProtocolPartThree from "./pages/Protocolo/Protocol-Part-Three";
import ProtocolPartTwo from "./pages/Protocolo/Protocol-Part-Two";
import SearchSession from "./pages/SearchSession/SearchSession";
import UserArea from "./pages/UserArea/UserArea";
import Homepage from "./pages/Homepage/Homepage";
import CollaboratorsPage from "./pages/CollaboratorsPage/CollaboratorsPage";
import Visualization from "./pages/NovaRevisao/visualization/Visualization";

function App() {
  const context = useContext(AppContext);

  if (!context) {
    return (
      <Router>
        <AppProvider>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/newRevision" element={<NovaRevisao />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/user" element={<UserArea />} />
            <Route path="/collaborators" element={<CollaboratorsPage />} />
            <Route path="/user" element={<UserArea />} />

            {/*Nested Routes*/}
            <Route path="/newRevision/protocol" element={<Protocol />} />
            <Route path="/newRevision/protocolpartTwo" element={<ProtocolPartTwo />} />
            <Route path="/newRevision/protocolpartThree" element={<ProtocolPartThree />} />
            <Route path="/newRevision/identification" element={<Identification />} />
            <Route path="/newRevision/keywords" element={<KeyWordScreen />} />
            <Route path="/newRevision/selection" element={<Selection />} />
            <Route path="/newRevision/extraction" element={<Extraction />} />
            <Route path="/newRevision/insertion" element={<Insertion />} />
            <Route path="/newRevision/graphics" element={<Graphics />} />
            <Route path="/newRevision/visualization" element={<Visualization/>}/>
            <Route path="/newRevision/searchSession" element={<SearchSession />} />
            <Route path="/newRevision/finalization" element={<Finalization />} />
          </Routes>
        </AppProvider>
      </Router>
    );
  }

  const { button } = context;
  console.log("App -> button: " + button);

  return (
    <Router>
      <AppProvider>
        <Routes>
          <Route path="/" element={<UserArea />} />
          <Route path="/newRevision" element={<NovaRevisao />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/collaborators" element={<CollaboratorsPage />} />

          {/*Nested Routes*/}
          <Route path="/newRevision/protocol" element={<Protocol />} />
          <Route path="/newRevision/protocolpartTwo" element={<ProtocolPartTwo />} />
          <Route path="/newRevision/protocolpartThree" element={<ProtocolPartThree />} />
          <Route path="/newRevision/identification" element={<Identification />} />
          <Route path="/newRevision/keywords" element={<KeyWordScreen />} />
          <Route path="/newRevision/selection" element={<Selection />} />
          <Route path="/newRevision/extraction" element={<Extraction />} />
          <Route path="/newRevision/insertion" element={<Insertion />} />
          <Route path="/newRevision/graphics" element={<Graphics />} />
          <Route path="/newRevision/finalization" element={<Finalization />} />
          <Route path="/newRevision/searchSession" element={<SearchSession />} />
        </Routes>
      </AppProvider>
    </Router>
  );
}

export default App;
