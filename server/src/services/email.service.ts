import { resend } from "@/configs/resend.config.js";
import fs from "node:fs/promises";
import Handlebars from "handlebars";

export class EmailService {
  constructor() {
    Handlebars.registerHelper("eq", function (a, b) {
      return a === b;
    });
  }

  async sendWelcomeEmail(user: any) {
    const template = await fs.readFile(
      "src/templates/emails/welcome.hbs",
      "utf-8"
    );
    const compiledTemplate = Handlebars.compile(template);
    const html = compiledTemplate(user);

    await resend.emails.send({
      from: "Event Management Platform <onboarding@resend.dev>",
      to: user.email,
      subject: `Welcome to Event Management Platform, ${user.firstName}!`,
      html,
    });
  }
}
