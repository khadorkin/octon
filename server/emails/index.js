import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { mjml2html } from 'mjml';
import htmlToText from 'html-to-text';
import handlebars from 'handlebars';

class Email {
  constructor() {
    this.transporter = nodemailer.createTransport(process.env.MAIL_URL);
  }

  constructEmail(name, params) {
    const templatePath = path.resolve(__dirname, '..', '..',
      'server', 'emails', 'templates', `${name}.html`);
    let email = fs.readFileSync(templatePath, 'utf8');
    email = handlebars.compile(email);
    email = email(params);
    email = mjml2html(email);
    return email;
  }

  sendMail({ to, subject, html }) {
    const text = htmlToText.fromString(html);
    const from = 'no-reply@octon.io';
    return new Promise((resolve, reject) => {
      this.transporter.sendMail({
        from: `"Octon" <${from}>`,
        to,
        subject,
        text,
        html,
      }, (err, info) => {
        if (err) {
          reject(err);
        } else {
          resolve(info);
        }
      });
    });
  }

  weeklyUpdate(user, repositories) {
    const subject = 'Weekly update';
    const html = this.constructEmail('releases-list', {
      repositories, BASE_URL: process.env.BASE_URL,
    });
    this.sendMail({ to: user.email, subject, html });
  }

  dailyUpdate(user, repositories) {
    const subject = 'Daily update';
    const html = this.constructEmail('releases-list', {
      repositories, BASE_URL: process.env.BASE_URL,
    });
    this.sendMail({ to: user.email, subject, html });
  }
}

export default Email;
