import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { Shell } from "./components/Shell";
import GroupHome from "./pages/GroupHome";
import CampusPage from "./pages/CampusPage";
import ProspectusWizard from "./pages/ProspectusWizard";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <HashRouter>
        <Routes>
          <Route element={<Shell />}>
            <Route index element={<GroupHome />} />
            <Route path="/campus/nairobi" element={<CampusPage />} />
            <Route path="/campus/:id" element={<Navigate to="/campus/nairobi" replace />} />
            <Route path="/admissions/prospectus" element={<ProspectusWizard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </MotionConfig>
  );
}
