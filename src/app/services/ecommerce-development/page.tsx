import type { Metadata } from "next";
import ECommerceDevelopment from "../../pages/services/ECommerceDevelopment";

export const metadata: Metadata = {
  title: "E-Commerce Development",
  description:
    "Complete e-commerce solutions with secure payments, inventory management and marketing tools. Turn visitors into customers.",
};

export default function Page() {
  return <ECommerceDevelopment />;
}
