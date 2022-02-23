import { AxiosInstance } from "axios";
import { emailProviderMap } from "./email-providers";
import { EmailProvider, EmailTemplates, TemplateData } from "./types";

export class EmailClient {
  private axios: AxiosInstance;

  sendEmail: (
    toEmail: string,
    template: string,
    dynamicData: Object
  ) => Promise<any>;
  getExistingTemplates: () => Promise<EmailTemplates>;

  processTemplate: (templateContent: string) => Promise<string>;

  createNewTemplateIfNeeded: (
    existingTemplates: EmailTemplates,
    templateName: string
  ) => Promise<EmailTemplates>;

  uploadCurrentContentIfNeeded: (
    existingTemplates: EmailTemplates,
    templateName: string,
    templateData: TemplateData,
    templateContent: string
  ) => Promise<void>;

  constructor(
    {
      provider,
      accessKey,
      secretKey,
      emailTemplateIdMap,
      fromEmail,
    }: {
      provider: EmailProvider;
      accessKey: string;
      // some providers only use a single key
      secretKey?: string;
      emailTemplateIdMap: { [key: string]: string };
      fromEmail: string;
    },
    debugMode = false
  ) {
    this.axios = emailProviderMap[provider].createAxios(accessKey, secretKey);

    this.sendEmail = emailProviderMap[provider].createSendEmail(
      this.axios,
      emailTemplateIdMap,
      fromEmail,
      debugMode
    );

    this.getExistingTemplates = emailProviderMap[
      provider
    ].createGetExistingTemplates(this.axios);

    this.processTemplate = emailProviderMap[provider].processTemplate;

    this.createNewTemplateIfNeeded = emailProviderMap[
      provider
    ].createCreateNewTemplateIfNeeded(this.axios);

    this.uploadCurrentContentIfNeeded = emailProviderMap[
      provider
    ].createUploadCurrentContentIfNeeded(this.axios);
  }
}
