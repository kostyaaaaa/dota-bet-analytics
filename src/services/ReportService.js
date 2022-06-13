const nodemailer = require("nodemailer");
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
  }

  async sendReport(body) {
    try {
      const message = await this.sender.sendMail({
        from: `Dota-bet-analytics <${SMTP_EMAIL}>`,
        to: EMAIL,
        subject: "Prediction",
        text: body,
      });
      Logger.log(`Message ${message.messageId} was sent.`);
    } catch (err) {
      Logger.error(`sendReport, ${err.message}`);
    }
  }
}

module.exports = new ReportService();
