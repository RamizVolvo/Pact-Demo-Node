const path = require("path");
const { Pact } = require("@pact-foundation/pact");
const { API } = require("./api");
const { eachLike, like } = require("@pact-foundation/pact/src/dsl/matchers");

const provider = new Pact({
  consumer: "FrontendWebsite",
  provider: "DotNetProductService", //DotNetProductService ProductService
  log: path.resolve(process.cwd(), "logs", "pact.log"),
  logLevel: "warn",
  dir: path.resolve(process.cwd(), "pacts"),
  spec: 2,
});

describe("API Pact test", () => {
  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  describe("getting one product", () => {
    test("ID 10 exists", async () => {
      // set up Pact interactions
      await provider.addInteraction({
        state: "product with ID 10 exists",
        uponReceiving: "get product with ID 10",
        withRequest: {
          method: "GET",
          path: "/products/10",
        },
        willRespondWith: {
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: like({
            name: "28 Degrees",
          }),
        },
      });

      const api = new API(provider.mockService.baseUrl);

      // make request to Pact mock server
      const product = await api.getProduct("10");

      expect(product).toStrictEqual({
        name: "28 Degrees",
      });
    });
  });
});
