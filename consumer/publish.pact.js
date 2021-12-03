const pact = require("@pact-foundation/pact-node");
const path = require("path");
require("dotenv").config();
if (!process.env.CI && !process.env.PUBLISH_PACT) {
  console.log("skipping Pact publish...");
  return;
}

let pactBrokerUrl = process.env.PACT_BROKER_URL || "http://localhost:80";
let pactBrokerUsername = process.env.PACT_BROKER_USERNAME || "pactbroker";
let pactBrokerPassword = process.env.PACT_BROKER_PASSWORD || "pactbroker";

let pactBrokerBaseUrl = process.env.PACT_BROKER_BASE_URL;
let pactBrokerToken = process.env.PACT_BROKER_TOKEN;

// const gitHash = require('child_process')
//     .execSync('git rev-parse --short HEAD')
//     .toString().trim();

const opts = {
  pactFilesOrDirs: [path.resolve(__dirname, "./pacts/")],
  //pactBroker: pactBrokerUrl,
  //pactBrokerUsername: pactBrokerUsername,
  //pactBrokerPassword: pactBrokerPassword,
  pactBroker: pactBrokerBaseUrl,
  pactBrokerToken: pactBrokerToken,
  tags: ["master", "test"],
  consumerVersion: "1.2",
};

pact
  .publishPacts(opts)
  .then(() => {
    console.log("Pact contract publishing complete!");
    console.log("");
    console.log(`Head over to ${pactBrokerUrl} and login with`);
    console.log(`=> Username: ${pactBrokerUsername}`);
    console.log(`=> Password: ${pactBrokerPassword}`);
    console.log("to see your published contracts.");
  })
  .catch((e) => {
    console.log("Pact contract publishing failed: ", e);
  });
