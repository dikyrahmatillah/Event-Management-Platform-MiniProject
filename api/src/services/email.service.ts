import { resend } from "@/configs/resend.config.js";
import fs from "node:fs/promises";
import Handlebars from "handlebars";

export class EmailService {
  constructor() {
    Handlebars.registerHelper("eq", function (a, b) {
      return a === b;
    });
  }

  async sendWelcomeEmail(firstName: string, email: string, role: string) {
    const template = await fs.readFile(
      "src/templates/emails/welcome.hbs",
      "utf-8"
    );
    const compiledTemplate = Handlebars.compile(template);
    const html = compiledTemplate({ firstName, role });

    await resend.emails.send({
      from: "Event Management Platform <onboarding@resend.dev>",
      to: email,
      subject: `Welcome to Event Management Platform, ${firstName}!`,
      html,
    });
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const template = await fs.readFile(
      "src/templates/emails/password-reset.hbs",
      "utf-8"
    );
    const compiledTemplate = Handlebars.compile(template);
    const html = compiledTemplate({ email, token });

    await resend.emails.send({
      from: "Event Management Platform <onboarding@resend.dev>",
      to: email,
      subject: "Password Reset Request",
      html,
    });
  }
}
