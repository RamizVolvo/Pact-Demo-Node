const pact = require("@pact-foundation/pact-node");
const path = require("path");
const { execSync } = require("child_process");
require("dotenv").config();

if (!process.env.CI && !process.env.PUBLISH_PACT) {
  console.log("skipping Pact publish...");
} else {
  let gitHash = "";
  const pactBrokerBaseUrl = process.env.PACT_BROKER_BASE_URL || "";
  const pactBrokerToken = process.env.PACT_BROKER_TOKEN || "";

  try {
    gitHash = execSync("git rev-parse --short HEAD").toString().trim();
  } catch (Error) {
    throw new TypeError(
      "Couldn't find a git commit hash, is this a git directory?"
    );
  }

  const opts = {
    pactFilesOrDirs: [path.resolve(process.cwd(), "./pacts/")],
    pactBroker: pactBrokerBaseUrl,
    pactBrokerToken: pactBrokerToken,
    tags: [process.env.BRANCH],
    consumerVersion: gitHash,
  };

  pact.publishPacts(opts).catch((e) => {
    console.log("Pact contract publishing failed: ", e);
  });
}
