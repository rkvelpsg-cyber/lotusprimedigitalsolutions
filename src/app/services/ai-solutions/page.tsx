import type { Metadata } from "next";
import AISolutions from "../../pages/services/AISolutions";

export const metadata: Metadata = {
  title: "AI Solutions",
  description:
    "Intelligent automation and AI-powered business solutions. Harness AI to automate processes, gain insights and make data-driven decisions.",
};

export default function Page() {
  return <AISolutions />;
}
