import * as dotenv from "dotenv";
dotenv.config();
import Axios, { AxiosInstance } from "axios";
import mjml2html = require("mjml");
import { EmailTemplate, EmailTemplates, EmailService } from "../types";
import { printDebugData } from "../utils";
import { debug } from "@calatrava/utils";

export const SendgridService: EmailService = {
  createAxios(SENDGRID_API_KEY: string) {
    return Axios.create({
      baseURL: "https://api.sendgrid.com/v3",
      headers: { Authorization: `Bearer ${SENDGRID_API_KEY}` },
    });
  },

  createGetExistingTemplates(axios: AxiosInstance) {
    return async function getExistingTemplates() {
      // get existing dynamic templates
      const templateResponse = await axios.get(
        "/templates?generations=dynamic&page_size=100"
      );
      const templates = templateResponse.data.result;

      const existingTemplates: EmailTemplates = {};
      if (templates.length) {
        await Promise.all(
          templates.map(async (template: any) => {
            const activeTemplateVersion = template.versions.find(
              (version: any) => version.active === 1
            ).id;

            const templateVersion = (
              await axios.get(
                `/templates/${template.id}/versions/${activeTemplateVersion}`
              )
            ).data;

            existingTemplates[template.name] = {
              id: template.id,
              version: activeTemplateVersion,
              content: templateVersion.html_content,
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
      existingTemplates: { [key: string]: EmailTemplate },
      templateName: string
    ) {
      if (!existingTemplates[templateName]) {
        // create template
        const newTemplate = (
          await axios.post("/templates", {
            name: templateName,
            generation: "dynamic",
          })
        ).data;

        // set it on existingTemplates
        existingTemplates[templateName] = {
          id: newTemplate.id,
          version: "",
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
      templateData,
      templateContent
    ) {
      if (existingTemplates[templateName]?.content !== templateContent) {
        debug(`Email: Creating new version for "${templateName}"...`);

        // update template content
        const newTemplateVersion = (
          await axios.post(
            `/templates/${existingTemplates[templateName]?.id || ""}/versions`,
            {
              active: 1,
              html_content: templateContent,
              name: templateName,
              subject: templateData.subject,
            }
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
    debugMode: boolean,
    preventSend: boolean = false
  ) {
    return function (toEmail: string, template: string, dynamicData: Object) {
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
      }
      if (!preventSend) {
        return axios.post("/mail/send", {
          template_id: emailTemplateIdMap[template],
          personalizations: {
            from: fromEmail,
            to: [{ email: toEmail }],
            dynamic_template_data: dynamicData,
          },
        });
      } else {
        return Promise.resolve();
      }
    };
  },
};
