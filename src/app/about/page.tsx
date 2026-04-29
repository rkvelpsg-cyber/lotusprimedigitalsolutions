import type { Metadata } from "next";
import About from "../pages/About";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Lotus Prime Digital Solutions — our mission, vision, values and story. Empowering businesses with innovative digital solutions since our inception.",
};

export default function Page() {
  return <About />;
}
