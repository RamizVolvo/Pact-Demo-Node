const { Verifier } = require("@pact-foundation/pact");
const controller = require("./product.controller");
const path = require("path");
const Product = require("./product");
require("dotenv").config();

// Setup provider server to verify
const app = require("express")();
app.use(require("./product.routes"));
const server = app.listen("8080");

describe("Pact Verification", () => {
  it("validates the expectations of ProductService", () => {
    const opts = {
      logLevel: "INFO",
      providerBaseUrl: "http://localhost:8080",
      provider: "ProductService",
      providerVersion: "1.0",
      publishVerificationResult: true,
      providerVersionTags: ["master", "test"],
      consumerVersionSelectors: [{ latest: true }],
      // pactUrls: [
      //     path.resolve(__dirname, '../../consumer/pacts/frontendwebsite-productservice.json')
      // ],
      pactBrokerUrl: process.env.PACT_BROKER_BASE_URL,
      pactBrokerToken: process.env.PACT_BROKER_TOKEN,

      stateHandlers: {
        "product with ID 10 exists": () => {
          controller.repository.products = new Map([
            ["10", new Product("10", "CREDIT_CARD", "28 Degrees", "v1")],
          ]);
        },
        "products exist": () => {
          controller.repository.products = new Map([
            ["09", new Product("09", "CREDIT_CARD", "Gem Visa", "v1")],
            ["10", new Product("10", "CREDIT_CARD", "28 Degrees", "v1")],
          ]);
        },
        "no products exist": () => {
          controller.repository.products = new Map();
        },
        "product with ID 11 does not exist": () => {
          controller.repository.products = new Map();
        },
      },
    };

    return new Verifier(opts)
      .verifyProvider()
      .then((output) => {
        console.log(output);
      })
      .finally(() => {
        server.close();
      });
  });
});
