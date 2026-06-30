"use client";

import { motion } from "framer-motion";
import { Wallet, Coins, BarChart3, ShieldCheck, ArrowDown } from "lucide-react";

const steps = [
  {
    icon: Wallet,
    title: "Connect Wallet",
    description: "Connect your Stellar wallet using Freighter.",
    step: "01",
  },
  {
    icon: Coins,
    title: "Pay Subscription",
    description: "Send 0.1 XLM to activate StellarCred.",
    step: "02",
  },
  {
    icon: BarChart3,
    title: "Analyze History",
    description: "We analyze your on-chain activity.",
    step: "03",
  },
  {
    icon: ShieldCheck,
    title: "Get Score",
    description: "Receive your decentralized credit score.",
    step: "04",
  },
];

export function HowItWorksSection() {
  return (
    <section className="relative px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl font-bold text-white sm:text-5xl">
            Simple{" "}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Steps
            </span>
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Get started in minutes.
          </p>
        </motion.div>

        <div className="relative flex flex-col items-center gap-0 sm:flex-row sm:gap-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="relative flex w-full max-w-xs flex-col items-center text-center"
            >
              <div className="relative mb-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/20 backdrop-blur-xl">
                  <step.icon className="h-8 w-8 text-purple-400" />
                </div>
                <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">
                  {step.step}
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {step.title}
              </h3>
              <p className="text-sm text-white/60">{step.description}</p>
              {index < steps.length - 1 && (
                <ArrowDown className="mt-4 hidden h-8 w-8 text-purple-400/40 sm:block sm:absolute -right-8 top-10 sm:hidden lg:block" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
