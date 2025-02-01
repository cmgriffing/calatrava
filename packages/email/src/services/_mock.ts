import Axios, { AxiosInstance } from "axios";
import { EmailService, EmailTemplates } from "../types";
import { printDebugData } from "../utils";
import Case from "case";

export const MockService: EmailService = {
  createAxios(_MAILGUN_SECRET_KEY: string | undefined) {
    const axiosInstance = Axios.create();
    return axiosInstance;
  },
  createGetExistingTemplates(_axios: AxiosInstance) {
    return async function getExistingTemplates() {
      const existingTemplates: EmailTemplates = {};
      return existingTemplates;
    };
  },

  async processTemplate(_templateContent: string) {
    return "";
  },
  createCreateNewTemplateIfNeeded(_axios: AxiosInstance) {
    return async function createNewTemplateIfNeeded(
      existingTemplates,
      templateName
    ) {
      templateName = Case.kebab(templateName);
      if (!existingTemplates[templateName]) {
        existingTemplates[templateName] = {
          id: templateName,
          version: "0",
          content: "",
        };
      }

      return existingTemplates;
    };
  },

  createUploadCurrentContentIfNeeded(_axios: AxiosInstance) {
    return async function uploadCurrentContentIfNeeded(
      _existingTemplates,
      _templateName,
      _templateData,
      _templateContent
    ) {};
  },
  createSendEmail(
    axios: AxiosInstance,
    emailTemplateIdMap: { [key: string]: string },
    fromEmail: string,
    debugMode: boolean,
    _preventSend: boolean = false
  ) {
    return function (toEmail: string, template: string, dynamicData: Object) {
      printDebugData(
        axios,
        emailTemplateIdMap,
        fromEmail,
        debugMode,
        toEmail,
        template,
        dynamicData
      );
      return Promise.resolve();
    };
  },
};
