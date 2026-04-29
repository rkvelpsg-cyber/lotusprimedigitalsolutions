import type { Metadata } from "next";
import Home from "./pages/Home";

export const metadata: Metadata = {
  title: "Lotus Prime Digital Solutions | End-to-End Digital & AI Solutions",
  description:
    "Empowering businesses with Website Development, AI Solutions, Mobile Apps, Cloud, CRM, Digital Marketing and more. Based in Bangalore, India.",
};

export default function Page() {
  return <Home />;
}
