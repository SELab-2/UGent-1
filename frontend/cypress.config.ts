import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    experimentalModifyObstructiveThirdPartyCode: true,
    experimentalInteractiveRunEvents: true,
    experimentalRunAllSpecs: true,
    chromeWebSecurity: false,
    pageLoadTimeout: 100000,
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
    },
  },
});
