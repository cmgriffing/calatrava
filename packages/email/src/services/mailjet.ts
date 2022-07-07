import { debug } from "@calatrava/utils";
import Axios, { AxiosInstance } from "axios";
import mjml2html = require("mjml");
import { EmailService, EmailTemplates } from "../types";
import { printDebugData } from "../utils";

export const MailjetService: EmailService = {
  createAxios(
    MAILJET_ACCESS_KEY: string,
    MAILJET_SECRET_KEY: string | undefined
  ) {
    return Axios.create({
      baseURL: "https://api.mailjet.com/v3/REST",
      auth: {
        username: MAILJET_ACCESS_KEY,
        password: MAILJET_SECRET_KEY || "",
      },
    });
  },
  createGetExistingTemplates(axios: AxiosInstance) {
    return async function getExistingTemplates() {
      // get existing dynamic templates
      const templateResponse = await axios.get("/template");
      const templates = templateResponse.data.Data;

      const existingTemplates: EmailTemplates = {};
      if (templates.length) {
        await Promise.all(
          templates.map(async (template: any) => {
            const templateVersion = (
              await axios
                .get(`/template/${template.ID}/detailcontent`)
                .catch((error: any) => {
                  debug(
                    "Catching 404 from detailcontent if no content has been uploaded yet.",
                    error
                  );
                  return {
                    data: {
                      ["Html-part"]: "",
                    },
                  };
                })
            ).data;

            existingTemplates[template.Name] = {
              id: template.ID,
              version: template.ID,
              content: templateVersion["Html-part"],
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
        const createResult = await axios.post("/template", {
          Name: templateName,
          Purposes: ["transactional"],
        });

        const { ID } = createResult.data;

        existingTemplates[templateName] = {
          id: ID,
          version: ID,
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
        debug(`Creating new version for "${templateName}"...`);

        // update template content
        const newTemplateVersion = (
          await axios.post(
            `template/${
              existingTemplates[templateName]?.id || ""
            }/detailcontent`,
            {
              "Html-part": templateContent,
              Headers: {
                Subject: templateData.subject,
              },
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
        printDebugData(
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
        return axios.post("/send", {
          "Mj-TemplateID": emailTemplateIdMap[template],
          FromEmail: fromEmail,
          Recipients: [{ Email: toEmail }],
          Vars: dynamicData,
          "Mj-TemplateLanguage": true,
        });
      } else {
        return Promise.resolve();
      }
    };
  },
};
