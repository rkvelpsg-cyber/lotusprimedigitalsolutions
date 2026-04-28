import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/layout/RootLayout";
import Home from "./pages/Home";
import WebsiteDevelopment from "./pages/services/WebsiteDevelopment";
import AISolutions from "./pages/services/AISolutions";
import MobileAppDevelopment from "./pages/services/MobileAppDevelopment";
import OfficeAutomation from "./pages/services/OfficeAutomation";
import DigitalMarketing from "./pages/services/DigitalMarketing";
import SocialMediaManagement from "./pages/services/SocialMediaManagement";
import CloudSolutions from "./pages/services/CloudSolutions";
import CRMSolutions from "./pages/services/CRMSolutions";
import ECommerceDevelopment from "./pages/services/ECommerceDevelopment";
import DigitalTransformation from "./pages/services/DigitalTransformation";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: "services/website-development", Component: WebsiteDevelopment },
      { path: "services/ai-solutions", Component: AISolutions },
      { path: "services/mobile-app-development", Component: MobileAppDevelopment },
      { path: "services/office-automation", Component: OfficeAutomation },
      { path: "services/digital-marketing", Component: DigitalMarketing },
      { path: "services/social-media-management", Component: SocialMediaManagement },
      { path: "services/cloud-solutions", Component: CloudSolutions },
      { path: "services/crm-solutions", Component: CRMSolutions },
      { path: "services/ecommerce-development", Component: ECommerceDevelopment },
      { path: "services/digital-transformation", Component: DigitalTransformation },
      { path: "about", Component: About },
      { path: "contact", Component: Contact },
      { path: "*", Component: NotFound },
    ],
  },
]);
