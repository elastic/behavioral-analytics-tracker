import { defineConfig } from "tsup";
import path from "path";

const commonConfig = {
  clean: true,
  dts: true,
  sourcemap: true,
  tsconfig: path.resolve(__dirname, "./tsconfig.json"),
};
export default defineConfig([
  {
    entry: ["src/index.ts"],
    ...commonConfig,
    format: "iife",
    outDir: "dist",
    minify: true,
    legacyOutput: true,
    globalName: "elasticAnalyticsDefault",
    footer: {
      js: "var elasticAnalytics = elasticAnalyticsDefault.default"
    }
  },
]);