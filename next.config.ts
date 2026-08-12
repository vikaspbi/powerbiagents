import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep Next from regenerating AGENTS.md/CLAUDE.md on every `next dev`
  agentRules: false,
};

export default nextConfig;
