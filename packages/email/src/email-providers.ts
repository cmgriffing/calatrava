import { MailjetService } from "./services/mailjet";
import { SendgridService } from "./services/sendgrid";
import { MailgunService } from "./services/mailgun";
import { EmailProvider, EmailService } from "./types";

export const emailProviderMap: {
  [value in EmailProvider]: EmailService;
} = {
  [EmailProvider.Sendgrid]: SendgridService,
  [EmailProvider.Mailjet]: MailjetService,
  [EmailProvider.Mailgun]: MailgunService,
};
