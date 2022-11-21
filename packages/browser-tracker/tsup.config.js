import { defineConfig } from "tsup";
import path from "path";

const commonConfig = {
  clean: true,
  dts: true,
  sourcemap: false,
  tsconfig: path.resolve(__dirname, "./tsconfig.json"),
};
export default defineConfig([
  {
    entry: ["src/index.ts"],
    ...commonConfig,
    format: ["iife"],
    outDir: "dist",
    minify: true,
    globalName: "elasticAnalyticsDefault",
    legacyOutput: true,
    footer: {
      js: "var elasticAnalytics = elasticAnalyticsDefault.default"
    }
  },
]);