import fs from 'fs';
import nodemailer from 'nodemailer';
import { mjml2html } from 'mjml';
import htmlToText from 'html-to-text';
import handlebars from 'handlebars';

class Email {
  constructor() {
    this.transporter = nodemailer.createTransport(process.env.MAIL_URL);
  }

  constructEmail(name) {
    let email = fs.readFileSync(`${__dirname}/templates/${name}.html`, 'utf8');
    email = mjml2html(email);
    email = handlebars.compile(email);
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

  newRelease(user, repository) {
    const newReleaseMail = this.constructEmail('new-release');
    const subject = `${repository.fullName} ${repository.latestRelease.tagName} new version`;
    const html = newReleaseMail({ repository, BASE_URL: process.env.BASE_URL });
    this.sendMail({ to: user.github.email, subject, html });
  }
}

export default Email;
