import { debug } from "@calatrava/utils";
import Axios, { AxiosInstance } from "axios";
import mjml2html = require("mjml");
import { EmailService, EmailTemplates } from "../types";
import { printDebugData } from "../utils";

const MAILGUN_DOMAIN = process.env["MAILGUN_DOMAIN"];

const postConfig = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

export const MailgunService: EmailService = {
  createAxios(MAILGUN_SECRET_KEY: string | undefined) {
    return Axios.create({
      baseURL: `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}`,
      auth: {
        username: "api",
        password: MAILGUN_SECRET_KEY || "",
      },
    });
  },
  createGetExistingTemplates(axios: AxiosInstance) {
    return async function getExistingTemplates() {
      // get existing dynamic templates
      const templateResponse = await axios.get(`/templates?limit=100`);
      const templates = templateResponse.data.items;

      const existingTemplates: EmailTemplates = {};
      if (templates.length) {
        await Promise.all(
          templates.map(async (template: any) => {
            const templateVersion = (
              await axios
                .get(`/templates/${template.name}?active=yes`)
                .catch((error: any) => {
                  debug(
                    "Catching 404 from template name if no content has been uploaded yet.",
                    error
                  );
                  return {
                    data: {
                      ["Html-part"]: "",
                    },
                  };
                })
            ).data.template;

            existingTemplates[template.name] = {
              id: template.name,
              version: templateVersion.version.tag,
              content: templateVersion.version.template,
            };
          })
        );
      }

      return existingTemplates;
    };
  },

  async processTemplate(templateContent: string) {
    return mjml2html(templateContent).html;
  },
  createCreateNewTemplateIfNeeded(axios: AxiosInstance) {
    return async function createNewTemplateIfNeeded(
      existingTemplates,
      templateName
    ) {
      if (!existingTemplates[templateName]) {
        const formData = new FormData();
        formData.append("name", templateName);
        formData.append("description", templateName);
        await axios.post("/templates", formData, postConfig);

        existingTemplates[templateName] = {
          id: templateName,
          version: "0",
          content: "",
        };
      }

      return existingTemplates;
    };
  },

  createUploadCurrentContentIfNeeded(axios: AxiosInstance) {
    return async function uploadCurrentContentIfNeeded(
      existingTemplates,
      templateName,
      _templateData,
      templateContent
    ) {
      if (existingTemplates[templateName]?.content !== templateContent) {
        debug(`Creating new version for "${templateName}"...`);

        const formData = new FormData();
        formData.append("template", templateContent);
        formData.append(
          "tag",
          `${+(existingTemplates[templateName]?.version || 0) + 1}`
        );
        formData.append("engine", "handlerbars");
        formData.append("active", "yes");

        // update template content
        const newTemplateVersion = (
          await axios.post(
            `templates/${existingTemplates[templateName]?.id || ""}/versions`,
            formData,
            postConfig
          )
        ).data;
        debug({ newTemplateVersion });
      }
    };
  },
  createSendEmail(
    axios: AxiosInstance,
    emailTemplateIdMap: { [key: string]: string },
    fromEmail: string,
    debugMode: boolean
  ) {
    // for Mailgun subject is part of dynamicData
    return function (toEmail: string, template: string, dynamicData: Object) {
      const { subject } = dynamicData as any;
      delete (dynamicData as any).subject;
      if (!subject) {
        return Promise.reject("subject must be defined on dynamicData");
      }

      if (debugMode) {
        return printDebugData(
          axios,
          emailTemplateIdMap,
          fromEmail,
          debugMode,
          toEmail,
          template,
          dynamicData
        );
      } else {
        const formData = new FormData();

        formData.append("template", emailTemplateIdMap[template] || "");
        formData.append("from", fromEmail);
        formData.append("to", toEmail);
        formData.append("subject", subject);
        formData.append("t:variables", JSON.stringify(dynamicData));

        return axios.post("/messages", formData, postConfig);
      }
    };
  },
};
