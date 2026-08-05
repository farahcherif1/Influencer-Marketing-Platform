const nodemailer = require('nodemailer');

async function main() {
  const testAccount = await nodemailer.createTestAccount();

  console.log('Test account created:');
  console.log(`MAIL_USER=${testAccount.user}`);
  console.log(`MAIL_PASSWORD=${testAccount.pass}`);
  console.log(`SMTP_HOST=${testAccount.smtp.host}`);
  console.log(`SMTP_PORT=${testAccount.smtp.port}`);
}

main().catch(console.error);
