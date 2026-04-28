import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X, ChevronDown } from "lucide-react";
import logo from "../../../imports/Lotus_Prime_Logo2.png";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsServicesOpen(false);
  }, [location]);

  const services = [
    { name: "Website Development", path: "/services/website-development" },
    { name: "AI Solutions", path: "/services/ai-solutions" },
    {
      name: "Mobile App Development",
      path: "/services/mobile-app-development",
    },
    { name: "Office Automation", path: "/services/office-automation" },
    { name: "Digital Marketing", path: "/services/digital-marketing" },
    {
      name: "Social Media Management",
      path: "/services/social-media-management",
    },
    { name: "Cloud Solutions", path: "/services/cloud-solutions" },
    { name: "CRM Solutions", path: "/services/crm-solutions" },
    { name: "E-Commerce Development", path: "/services/ecommerce-development" },
    {
      name: "Digital Transformation",
      path: "/services/digital-transformation",
    },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-28">
          <Link to="/" className="flex items-center flex-shrink-0">
            <img
              src={logo}
              alt="Lotus Prime Digital Solutions"
              className="h-[75px] md:h-[90px] lg:h-[110px] w-auto object-contain max-h-[115px] [image-rendering:-webkit-optimize-contrast]"
            />
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              to="/"
              className="text-[#0B3C5D] hover:text-[#1ABC9C] transition-colors"
            >
              Home
            </Link>

            <div className="relative group">
              <button className="flex items-center text-[#0B3C5D] hover:text-[#1ABC9C] transition-colors">
                Services
                <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="py-2">
                  {services.map((service) => (
                    <Link
                      key={service.path}
                      to={service.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-sm text-[#0B3C5D] hover:bg-[#1ABC9C]/10 hover:text-[#1ABC9C] transition-colors"
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              to="/about"
              className="text-[#0B3C5D] hover:text-[#1ABC9C] transition-colors"
            >
              About Us
            </Link>

            <Link
              to="/contact"
              className="text-[#0B3C5D] hover:text-[#1ABC9C] transition-colors"
            >
              Contact
            </Link>

            <Link
              to="/contact"
              className="bg-gradient-to-r from-[#0B3C5D] to-[#1ABC9C] text-white px-6 py-2.5 rounded-full hover:shadow-lg transition-all duration-300"
            >
              Get a Quote
            </Link>
          </nav>

          <button
            className="lg:hidden text-[#0B3C5D]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <nav className="px-4 py-4 space-y-2">
            <Link
              to="/"
              className="block py-2 text-[#0B3C5D] hover:text-[#1ABC9C] transition-colors"
            >
              Home
            </Link>

            <div>
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="flex items-center justify-between w-full py-2 text-[#0B3C5D] hover:text-[#1ABC9C] transition-colors"
              >
                Services
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isServicesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isServicesOpen && (
                <div className="pl-4 space-y-2 mt-2">
                  {services.map((service) => (
                    <Link
                      key={service.path}
                      to={service.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block py-1 text-sm text-[#0B3C5D] hover:text-[#1ABC9C] transition-colors"
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/about"
              className="block py-2 text-[#0B3C5D] hover:text-[#1ABC9C] transition-colors"
            >
              About Us
            </Link>

            <Link
              to="/contact"
              className="block py-2 text-[#0B3C5D] hover:text-[#1ABC9C] transition-colors"
            >
              Contact
            </Link>

            <Link
              to="/contact"
              className="block mt-4 bg-gradient-to-r from-[#0B3C5D] to-[#1ABC9C] text-white px-6 py-2.5 rounded-full text-center hover:shadow-lg transition-all duration-300"
            >
              Get a Quote
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
