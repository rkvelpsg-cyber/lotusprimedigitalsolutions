import type { Metadata } from "next";
import MobileAppDevelopment from "../../pages/services/MobileAppDevelopment";

export const metadata: Metadata = {
  title: "Mobile App Development | iOS & Android Apps — Bangalore, India",
  description:
    "Expert mobile app development in Bangalore for iOS and Android. We build React Native and Flutter cross-platform apps and native mobile solutions for businesses across India. From concept to App Store launch.",
  keywords: [
    "mobile app development Bangalore",
    "iOS app development India",
    "Android app development Bangalore",
    "React Native development India",
    "Flutter app development",
    "cross-platform app development",
    "enterprise mobile app India",
    "app development company Bangalore",
    "mobile application development India",
    "custom app development Whitefield",
  ],
  openGraph: {
    title: "Mobile App Development | Lotus Prime Digital Solutions",
    description:
      "Custom iOS and Android mobile app development in Bangalore. React Native, Flutter, and native apps for businesses across India.",
    url: "https://www.lotusprimedigitalsolutions.com/services/mobile-app-development",
  },
};

export default function Page() {
  return <MobileAppDevelopment />;
}
