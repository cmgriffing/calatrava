import { getEnvVariable } from "@calatrava/utils";
import * as fs from "fs-extra";
import path from "path";
import { MailjetService } from "./services/mailjet";
import { SendgridService } from "./services/sendgrid";

import { EmailProvider, EmailTemplate } from "./types";
import { EmailClient } from "./email-client";

const EmailProviderMap = {
  [EmailProvider.Mailjet]: MailjetService,
  [EmailProvider.Sendgrid]: SendgridService,
};

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
    console.log("Getting existing templates and versions...");

    const cwd = process.cwd();

    const accessKey = getEnvVariable("EMAIL_ACCESS_KEY");
    const secretKey = getEnvVariable("EMAIL_SECRET_KEY");

    if (!EmailProviderMap[emailProvider]) {
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

    console.log("Evaluating local templates...");

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

    console.log(
      "paths",
      { outputTemplatePath, templateEnumPath },
      path.resolve(cwd, outputTemplatePath),
      path.resolve(cwd, templateEnumPath)
    );

    // const relativePath = path.relative(
    //   path.resolve(cwd, outputTemplatePath),
    //   path.resolve(cwd, templateEnumPath)
    // );

    const extension = path.extname(templateEnumPath);

    const relativePath = path
      .relative(path.dirname(outputTemplatePath), templateEnumPath)
      .replace(extension, "");

    const tsFileContents = `import { EmailTemplate } from './${relativePath}';
export const emailTemplateIdMap: {[value in EmailTemplate]: string} = {
${idMapContents}
}
`;

    console.log("Writing TypeScript ID map for templates.");

    fs.outputFileSync(path.resolve(cwd, outputTemplatePath), tsFileContents);

    console.log("Process finished.");
  } catch (e) {
    console.log({ e });
  }
}
