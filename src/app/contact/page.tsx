import type { Metadata } from "next";
import Contact from "../pages/Contact";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Lotus Prime Digital Solutions. Request a demo, get a quote, or discuss your digital transformation project with our experts.",
};

export default function Page() {
  return <Contact />;
}
