import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Identification from "./pages/Execution/Identification";
import Extraction from "./pages/Execution/SubPages/Extraction/Extraction";
import Insertion from "./pages/Execution/SubPages/Insertion/Insertion";
import TestPage from "./pages/TestPage/TestPage";
import SidebarContext, { SidebarProvider } from "./components/Context/sidebarContext";
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
import Home from "./pages/home/home";
function App() {
  const context = useContext(SidebarContext);

  if (!context) {
    // Se o contexto não estiver definido, retorne algo apropriado
    return (
        <>
          <Router>
            <SidebarProvider>
              <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/newRevision" element={<NovaRevisao />} />              
                  <Route path="/landing" element={<LandingPage />} />
                  <Route path="/test" element={<TestPage />} />
    
    
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
              </SidebarProvider>
          </Router>
        </>
      );
  }

  const {button} = context;
  console.log('App -> button: ' + button);
  
  return (
    <>
      <Router>
        <SidebarProvider>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/newRevision" element={<NovaRevisao />} />
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/test" element={<TestPage />} />


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
          </SidebarProvider>
      </Router>
    </>
  );
}

export default App;
