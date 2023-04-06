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
    entry: ["./src/index.ts"],
    ...commonConfig,
    // NOTE: it means CJS will be .js and ESM will be .mjs
    format: ["esm"],
    outDir: "dist",
  },
  {
    entry: ["./src/index.ts"],
    ...commonConfig,
    // NOTE: it means CJS will be .js and ESM will be .mjs
    format: ["cjs"],
    outDir: "dist",
  },
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