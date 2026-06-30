"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Coins, BarChart3, ShieldCheck, Unlock } from "lucide-react";

const features = [
  {
    icon: Coins,
    title: "Subscribe with XLM",
    description:
      "Pay a small subscription fee in XLM to activate your credit profile.",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: BarChart3,
    title: "Analyze Wallet Activity",
    description:
      "We scan your on-chain history to assess financial behavior.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: ShieldCheck,
    title: "Generate Credit Score",
    description:
      "An algorithm computes your decentralized creditworthiness.",
    color: "from-green-500 to-green-600",
  },
  {
    icon: Unlock,
    title: "Unlock Credit Access",
    description:
      "Based on your score, unlock mock credit limits for testing.",
    color: "from-orange-500 to-orange-600",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl font-bold text-white sm:text-5xl">
            How It{" "}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Four simple steps to build your on-chain reputation.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="group h-full transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10">
                <div className="p-6">
                  <div
                    className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${feature.color} p-3 shadow-lg`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-white/60">
                    {feature.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
