import { AxiosInstance } from "axios";

export enum EmailProvider {
  Mailjet = "mailjet",
  Sendgrid = "sendgrid",
}

export interface EmailService {
  createAxios: (accessKey: string, extraKey?: string) => AxiosInstance;
  createSendEmail: (
    axios: AxiosInstance,
    emailTemplateIdMap: { [key: string]: string },
    fromEmail: string,
    debugMode: boolean
  ) => (toEmail: string, template: string, dynamicData: Object) => Promise<any>;

  createGetExistingTemplates: (
    axios: AxiosInstance
  ) => () => Promise<EmailTemplates>;

  processTemplate: (templateContent: string) => Promise<string>;

  createCreateNewTemplateIfNeeded: (
    axios: AxiosInstance
  ) => (
    existingTemplates: EmailTemplates,
    templateName: string
  ) => Promise<EmailTemplates>;

  createUploadCurrentContentIfNeeded: (
    axios: AxiosInstance
  ) => (
    existingTemplates: EmailTemplates,
    templateName: string,
    templateData: TemplateData,
    templateContent: string
  ) => Promise<void>;
}

export interface TemplateData {
  template: string;
  subject: string;
}

export interface EmailTemplate {
  id: string;
  version: string;
  content: string;
}

export interface EmailTemplates {
  [key: string]: EmailTemplate;
}
