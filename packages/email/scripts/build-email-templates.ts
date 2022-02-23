import minimist from "minimist";
import { buildEmailTemplates } from "../src/build-email-templates";

main().catch((error) => {
  console.error("Error doing email template stuff", error);
});

async function main() {
  try {
    console.log("Hmmmmmmm");
    const args = minimist(process.argv.slice(2));

    const {
      provider,
      templateJsonPath,
      mjmlDirectory,
      outputTemplatePath,
      templateEnumPath,
    } = args;

    if (!provider) {
      throw new Error("Email provider is required");
    }

    if (!templateJsonPath) {
      throw new Error("Template JSON Path is required");
    }

    if (!templateJsonPath) {
      throw new Error("Template JSON Path is required");
    }

    if (!outputTemplatePath) {
      throw new Error("Output template Path is required");
    }

    if (!templateEnumPath) {
      throw new Error("Template enum Path is required");
    }

    await buildEmailTemplates(
      provider,
      templateJsonPath,
      mjmlDirectory,
      outputTemplatePath,
      templateEnumPath
    );
  } catch (e) {
    console.log({ e });
  }
}
