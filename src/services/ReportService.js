const nodemailer = require("nodemailer");
const Handlebars = require("handlebars");
const path = require("path");
const fs = require("fs");
const initHandleBarsHelpers = require("../utils/initHandleBarsHelpers");

const Logger = require("./loggerService");

const { EMAIL, SMTP_EMAIL, SMTP_PASSWORD } = process.env;

class ReportService {
  constructor() {
    this.sender = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: SMTP_EMAIL,
        pass: SMTP_PASSWORD,
      },
    });
    initHandleBarsHelpers();
  }

  getHTMLTemplate(data) {
    const templateSource = fs.readFileSync(
      path.resolve(__dirname, "../templates/dotaReport.hbs"),
      "utf8",
    );

    const templateCompiled = Handlebars.compile(templateSource);
    return templateCompiled(data);
  }

  async sendReport(body) {
    try {
      const html = this.getHTMLTemplate(body);
      const message = await this.sender.sendMail({
        from: `Dota-bet-analytics <${SMTP_EMAIL}>`,
        to: EMAIL,
        subject: "Prediction",
        html,
      });
      Logger.log(`Message ${message.messageId} was sent.`);
    } catch (err) {
      Logger.error(`sendReport, ${err.message}`);
    }
  }
}

module.exports = new ReportService();
