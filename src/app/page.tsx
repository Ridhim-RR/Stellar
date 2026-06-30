"use client";

import { useRouter } from "next/navigation";
import { useWallet } from "@/providers/wallet-provider";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { Footer } from "@/components/landing/footer";
import { toast } from "sonner";

export default function LandingPage() {
  const router = useRouter();
  const { connect, isConnected, isConnecting } = useWallet();

  const handleConnectWallet = async () => {
    if (isConnected) {
      router.push("/dashboard");
      return;
    }
    try {
      await connect();
      toast.success("Wallet connected successfully!");
      router.push("/dashboard");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to connect wallet."
      );
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(120,80,255,0.08),_transparent_50%),radial-gradient(ellipse_at_bottom,_rgba(0,100,255,0.05),_transparent_50%)]" />
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600">
              <span className="text-sm font-bold text-white">S</span>
            </div>
            <span className="text-lg font-semibold text-white">
              StellarCred
            </span>
          </div>
          <button
            onClick={handleConnectWallet}
            disabled={isConnecting}
            className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
          >
            {isConnecting
              ? "Connecting..."
              : isConnected
              ? "Dashboard"
              : "Connect Wallet"}
          </button>
        </div>
      </nav>

      <HeroSection
        onConnectWallet={handleConnectWallet}
        isConnected={isConnected}
      />
      <FeaturesSection />
      <HowItWorksSection />
      <Footer />
    </main>
  );
}
