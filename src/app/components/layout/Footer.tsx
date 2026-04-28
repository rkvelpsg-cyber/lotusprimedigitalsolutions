import { Link } from "react-router";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";
import logo from "../../../imports/Lotus_Prime_Logo2.png";

export function Footer() {
  return (
    <footer className="bg-[#0B3C5D] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <img src={logo} alt="Lotus Prime" className="h-20 mb-4" />
            <p className="text-gray-300 text-sm mb-4">
              End-to-End Digital & AI Solutions for Modern Businesses
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-[#1ABC9C] hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-[#1ABC9C] hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-[#1ABC9C] hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-[#1ABC9C] hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-[#1ABC9C] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-[#1ABC9C] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-[#1ABC9C] transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4">Our Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/services/website-development"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#1ABC9C] transition-colors"
                >
                  Website Development
                </Link>
              </li>
              <li>
                <Link
                  to="/services/ai-solutions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#1ABC9C] transition-colors"
                >
                  AI Solutions
                </Link>
              </li>
              <li>
                <Link
                  to="/services/mobile-app-development"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#1ABC9C] transition-colors"
                >
                  Mobile App Development
                </Link>
              </li>
              <li>
                <Link
                  to="/services/digital-marketing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#1ABC9C] transition-colors"
                >
                  Digital Marketing
                </Link>
              </li>
              <li>
                <Link
                  to="/services/cloud-solutions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#1ABC9C] transition-colors"
                >
                  Cloud Solutions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 text-[#1ABC9C] flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">
                  SSK Residency, Vinayaka Layout, 1st Cross, Food Corporation of
                  India Main Road, Whitefield-Kadugodi, Bangalore – 560067
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-[#1ABC9C]" />
                <a
                  href="tel:+919345770456"
                  className="text-gray-300 hover:text-[#1ABC9C]"
                >
                  +91-9345770456
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-[#1ABC9C]" />
                <a
                  href="mailto:info@lotusprimedigital.com"
                  className="text-gray-300 hover:text-[#1ABC9C]"
                >
                  info@lotusprimedigital.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Lotus Prime Digital Solutions. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
