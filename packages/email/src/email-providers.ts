import { MockService } from "./services/_mock";
import { MailjetService } from "./services/mailjet";
import { SendgridService } from "./services/sendgrid";
import { MailgunService } from "./services/mailgun";
import { EmailProvider, EmailService } from "./types";

export const emailProviderMap: {
  [value in EmailProvider]: EmailService;
} = {
  [EmailProvider.Mock]: MockService,
  [EmailProvider.Sendgrid]: SendgridService,
  [EmailProvider.Mailjet]: MailjetService,
  [EmailProvider.Mailgun]: MailgunService,
};
