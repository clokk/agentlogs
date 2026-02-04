"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TuhnrLogo } from "./TuhnrLogo";

export function HeroSection() {
  return (
    <section className="py-32 px-6 relative">
      {/* Ambient glow behind logo */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative">
        {/* Logo with entrance animation */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <TuhnrLogo size={120} />
        </motion.div>

        {/* Wordmark */}
        <motion.h1
          className="text-7xl md:text-8xl font-bold text-primary mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Tuhnr
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="text-2xl md:text-3xl text-muted mb-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          The free, fun way to track your AI coding.
        </motion.p>

        {/* Stats bar */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-muted mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div>
            <span className="text-2xl text-primary font-bold">12,847</span>
            <span className="ml-2">commits tracked</span>
          </div>
          <span className="text-subtle hidden sm:inline">·</span>
          <div>
            <span className="text-2xl text-primary font-bold">42</span>
            <span className="ml-2">developers</span>
          </div>
          <span className="text-subtle hidden sm:inline">·</span>
          <div>
            <span className="text-2xl text-primary font-bold">5</span>
            <span className="ml-2">tools</span>
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link
            href="/login"
            className="px-8 py-4 bg-accent text-black rounded-lg font-semibold text-lg hover:bg-accent-hover transition-colors"
          >
            Start tracking
          </Link>
          <a
            href="https://github.com/clokk/tuhnr"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-panel text-primary rounded-lg font-semibold text-lg border border-border hover:bg-panel-alt transition-colors flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            View on GitHub
          </a>
        </motion.div>
      </div>
    </section>
  );
}
