import type { Metadata } from "next";
import SocialMediaManagement from "../../pages/services/SocialMediaManagement";

export const metadata: Metadata = {
  title: "Social Media Management",
  description:
    "Professional social media management that drives brand awareness and customer loyalty across all social platforms.",
};

export default function Page() {
  return <SocialMediaManagement />;
}
