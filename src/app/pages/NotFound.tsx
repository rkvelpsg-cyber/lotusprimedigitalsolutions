"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B3C5D] to-[#1ABC9C] px-4">
      <div className="text-center text-white">
        <div className="mb-8">
          <h1 className="text-9xl mb-4">404</h1>
          <h2 className="text-3xl md:text-4xl mb-4">Page Not Found</h2>
          <p className="text-lg text-white/90 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-white text-[#0B3C5D] px-8 py-4 rounded-full hover:shadow-2xl transition-all duration-300"
          >
            <Home className="mr-2 w-5 h-5" />
            Go Home
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-8 py-4 rounded-full hover:bg-white hover:text-[#0B3C5D] transition-all duration-300"
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
