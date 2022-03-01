import { AxiosInstance } from "axios";

export async function printDebugData(
  axios: AxiosInstance,
  emailTemplateIdMap: { [key: string]: string },
  fromEmail: string,
  debugMode: boolean,
  toEmail: string,
  template: string,
  dynamicData: Object
) {
  const data = {
    axios,
    emailTemplateIdMap,
    fromEmail,
    debugMode,
    toEmail,
    template,
    dynamicData,
  };
  console.log(JSON.stringify(data, null, 2));
  return data;
}
