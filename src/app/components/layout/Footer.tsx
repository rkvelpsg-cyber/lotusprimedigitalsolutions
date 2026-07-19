import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";

const LOGO_SRC = "/LP%20Logo%20Vector.svg";

export function Footer() {
  return (
    <footer className="bg-[#0B3C5D] text-white">
      {/* Inject responsive 5-column grid template */}
      <style>{`
        @media (min-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1fr 0.65fr 0.85fr 2fr 1.5fr;
          }
        }
        @media (min-width: 640px) and (max-width: 1023px) {
          .footer-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-5 lg:px-5 py-12">
        <div className="footer-grid grid grid-cols-1 gap-6">
          {/* Col 1 — Logo + Social */}
          <div>
            <Link
              href="/"
              className="inline-block bg-white rounded-xl px-3 py-2 mb-4"
            >
              <img
                src={LOGO_SRC}
                alt="Lotus Prime Digital Solutions"
                className="h-14 w-auto object-contain"
              />
            </Link>
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
              End-to-End Digital &amp; AI Solutions for Modern Businesses
            </p>
            <div className="flex space-x-3">
              <a
                href="https://www.facebook.com/lotusprimedigitalsolutions"
                target="_blank"
                rel="noopener noreferrer"
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
                href="https://www.instagram.com/lotusprimedigitalsolutions/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1ABC9C] hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-[#1ABC9C] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-[#1ABC9C] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-[#1ABC9C] transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 — Our Services */}
          <div>
            <h3 className="mb-4 font-semibold">Our Services</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/services/website-development"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#1ABC9C] transition-colors"
                >
                  Website Development
                </Link>
              </li>
              <li>
                <Link
                  href="/services/ai-solutions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#1ABC9C] transition-colors"
                >
                  AI Solutions
                </Link>
              </li>
              <li>
                <Link
                  href="/services/mobile-app-development"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#1ABC9C] transition-colors"
                >
                  Mobile App Development
                </Link>
              </li>
              <li>
                <Link
                  href="/services/digital-marketing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#1ABC9C] transition-colors"
                >
                  Digital Marketing
                </Link>
              </li>
              <li>
                <Link
                  href="/services/cloud-solutions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#1ABC9C] transition-colors"
                >
                  Cloud Solutions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 — Contact Info */}
          <div className="min-w-0">
            <h3 className="mb-4 font-semibold">Contact Info</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#1ABC9C] flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 leading-relaxed">
                  Ground Floor, SSK Residency,
                  <br />
                  Vinayaka Layout, 1st Cross,
                  <br />
                  Food Corporation of India Main Road,
                  <br />
                  Whitefield-Kadugodi,
                  <br />
                  Bangalore &ndash; 560067
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#1ABC9C] flex-shrink-0" />
                <a
                  href="tel:+919363070456"
                  className="text-gray-300 hover:text-[#1ABC9C] transition-colors"
                >
                  +91-9363070456
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#1ABC9C] flex-shrink-0 mt-0.5" />
                <a
                  href="mailto:info@lotusprimedigitalsolutions.com"
                  className="text-gray-300 hover:text-[#1ABC9C] transition-colors"
                  style={{ wordBreak: "break-all", overflowWrap: "anywhere" }}
                >
                  info@lotusprimedigitalsolutions.com
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5 — Google Map */}
          <div className="rounded-xl overflow-hidden border border-white/10 flex flex-col min-w-0">
            <a
              href="https://www.google.com/maps/place/Lotus+Prime+Digital+Solutions/@12.9939438,77.7632623,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae0f1e80cf5e53:0xf4f314cee7a2c276!8m2!3d12.9939386!4d77.7658372!16s%2Fg%2F11zgm2dxm3?authuser=0&entry=ttu&g_ep=EgoyMDI2MDcwOC4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#1ABC9C] transition-colors px-2.5 py-2"
            >
              <MapPin className="w-3 h-3 text-[#1ABC9C] flex-shrink-0" />
              <span>Open in Google Maps ↗</span>
            </a>
            <iframe
              src="https://maps.google.com/maps?q=12.9939386,77.7658372&z=17&output=embed&hl=en"
              width="100%"
              height="200"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lotus Prime Digital Solutions location"
            />
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
