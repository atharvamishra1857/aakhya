import type { OpenNextConfig } from "@opennextjs/cloudflare";

const config = {
  default: {
    override: {
      wrapper: "cloudflare-node" as const,
      converter: "edge" as const,
      incrementalCache: "dummy" as const,
      tagCache: "dummy" as const,
      queue: "dummy" as const,
    },
  },
};

export default config;