import { getEnvVariable, debug } from "@calatrava/utils";
import * as fs from "fs-extra";
import path from "path";

import { EmailProvider, EmailTemplate } from "./types";
import { EmailClient } from "./email-client";

import { emailProviderMap } from "./email-providers";

interface TemplateMetadata {
  template: string;
  subject: string;
}

export async function buildEmailTemplates(
  emailProvider: EmailProvider,
  templateJsonPath: string,
  mjmlDirectory: string,
  outputTemplatePath: string,
  templateEnumPath: string
) {
  try {
    debug("Email: Getting existing templates and versions...");

    const cwd = process.cwd();

    const accessKey = getEnvVariable("EMAIL_ACCESS_KEY");
    const secretKey = getEnvVariable("EMAIL_SECRET_KEY");

    if (!emailProviderMap[emailProvider]) {
      throw new Error(`Email provider not recognized: ${emailProvider}`);
    }

    const emailService = new EmailClient({
      provider: emailProvider,
      accessKey,
      secretKey,
      emailTemplateIdMap: {},
      fromEmail: "",
    });

    // get existing dynamic templates
    let existingTemplates: { [key: string]: EmailTemplate } =
      await emailService.getExistingTemplates();

    debug("Email: Evaluating local templates...");

    const templateMetadata: {
      [key: string]: TemplateMetadata;
    } = JSON.parse(
      fs.readFileSync(path.resolve(cwd, templateJsonPath), {
        encoding: "utf8",
      })
    );

    await Promise.all(
      Object.entries(templateMetadata).map(
        async ([templateKey, templateData]: [string, TemplateMetadata]) => {
          const currentRawContent = fs.readFileSync(
            path.resolve(cwd, mjmlDirectory, templateData.template),
            { encoding: "utf8" }
          );

          const currentContent = await emailService.processTemplate(
            currentRawContent
          );

          existingTemplates = await emailService.createNewTemplateIfNeeded(
            existingTemplates,
            templateKey
          );

          await emailService.uploadCurrentContentIfNeeded(
            existingTemplates,
            templateKey,
            templateData,
            currentContent
          );
        }
      )
    );

    const idMapContents = Object.entries(existingTemplates)
      .map(([templateKey, existingTemplate]: [string, { id: string }]) => {
        return `  ${templateKey}: "${existingTemplate.id}"`;
      })
      .join(",\n");

    const extension = path.extname(templateEnumPath);

    const relativePath = path
      .relative(path.dirname(outputTemplatePath), templateEnumPath)
      .replace(extension, "");

    const tsFileContents = `import { EmailTemplate } from './${relativePath}';
export const emailTemplateIdMap: {[value in EmailTemplate]: string} = {
${idMapContents}
}
`;

    debug("Email: Writing TypeScript ID map for templates.");

    fs.outputFileSync(path.resolve(cwd, outputTemplatePath), tsFileContents);

    debug("Email: Process finished.");
  } catch (e) {
    debug("Build email templates: Caught exception: ", { e });
  }
}
