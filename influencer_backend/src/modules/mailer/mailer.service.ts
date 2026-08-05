import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/entities/user.entity';
import { Token } from '../auth/entities/token.entity';

@Injectable()
export class MailerService {
  private readonly isProduction: boolean;
  constructor(private readonly configService: ConfigService) {
    this.isProduction = process.env.NODE_ENV === 'prod';
  }

  private mailTransport() {
    return nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: this.isProduction ? true : false,
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASSWORD'),
      },
    });
  }

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const mailOptions = {
      from: `"${this.configService.get('APP_NAME')}" <${this.configService.get('MAIL_USER')}>`,
      to,
      subject: 'Verification Code',
      html: `
        <div style="max-width: 400px; margin: 20px auto; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); font-family: -apple-system, sans-serif;">
          <div style="padding: 24px; text-align: center; border-bottom: 1px solid #f0f0f0;">
            <h1 style="color: #ff6800; font-size: 24px; margin: 0 0 24px 0;">Collabios</h1>
          </div>
          <div style="padding: 32px 24px; text-align: center;">
            <h1 style="color: #333; font-size: 24px; margin: 0 0 24px 0;">Verification Code</h1>
            <div style="background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 6px; padding: 20px; margin: 16px 0; display: inline-block;">
              <div style="font-size: 32px; font-weight: 700; color: #333; letter-spacing: 2px; font-family: monospace;">${token}</div>
            </div>
            <p style="color: #666; font-size: 14px; margin: 16px 0 0 0;">If you didn't request this, ignore this email.</p>
          </div>
        </div>
      `,
    };

    try {
      const transporter = this.mailTransport();
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new InternalServerErrorException(
        'Failed to send verification email',
      );
    }
  }

  async sendReferralInviteEmail(
    to: string,
    inviterName: string,
    referralUrl: string,
  ): Promise<void> {
    const mailOptions = {
      from: `"${this.configService.get('APP_NAME')}" <${this.configService.get('MAIL_USER')}>`,
      to,
      subject: `${inviterName} invited you to join Collabios`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Join Collabios</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; min-height: 100vh;">
                <tr>
                    <td align="center" style="padding: 40px 20px;">
                        <table width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden;">
                            <tr>
                                <td align="center" style="padding: 60px 40px 40px 40px; background-color: #ffffff;">
                                    <div style="font-size: 32px; font-weight: 600; color: #333333; margin-bottom: 8px;">
                                        Collabios
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0 40px 60px 40px; background-color: #ffffff; text-align: center;">
                                    <div style="max-width: 400px; margin: 0 auto;">
                                        <p style="margin: 0 0 20px 0; font-size: 18px; line-height: 1.6; color: #333333;">
                                            <strong>${inviterName}</strong> invited you to join <strong>Collabios.com</strong>, a marketplace for brands to find and hire influencers.
                                        </p>
                                        <p style="margin: 0 0 40px 0; font-size: 18px; line-height: 1.6; color: #333333;">
                                            Join for free using the button below and get <strong>$10 off your first order</strong>.
                                        </p>
                                        <div style="margin: 40px 0;">
                                            <a href="${referralUrl}" 
                                              style="display: inline-block; padding: 15px 30px; background-color: #333333; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                                                Get $10 on Collabios
                                            </a>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 40px 40px 60px 40px; background-color: #ffffff; text-align: center; border-top: 1px solid #f0f0f0;">
                                    <p style="margin: 0 0 8px 0; font-size: 14px; color: #999999;">
                                        © Collabios Inc.
                                    </p>
                                    <p style="margin: 0; font-size: 14px; color: #999999;">
                                        925 W Georgia St, Vancouver, BC V6C 3L2
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `,
    };

    try {
      const transporter = this.mailTransport();
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Failed to send referral invite email:', error);
      throw new InternalServerErrorException(
        'Failed to send referral invite email',
      );
    }
  }
  async sendWelcomeEmailToCreator(
    to: string,
    userName: string,
    referralUrl: string,
  ): Promise<void> {
    const mailOptions = {
      from: `"${this.configService.get('APP_NAME')}" <${this.configService.get('MAIL_USER')}>`,
      to,
      subject: 'Welcome to Collabios!',
      html: `
      <div style="font-family: Arial, sans-serif; font-size: 22px; color: #000000; line-height: 1.6; margin-left: 80px;">
        <p style="color: #000000; font-size: 22px;">Hey <strong>${userName}</strong>,</p>
        <p style="color: #000000; font-size: 22px;">
          Your profile is now live on the marketplace! Brands can purchase your services directly through the platform.
        </p>
        <p style="color: #000000; font-size: 22px;">
          You will be notified by email and text when you receive an order, you will then have <strong>72 hours</strong> to accept or decline it.
        </p>
        <h2 style="font-size: 26px; font-weight: bold; margin-top: 30px; margin-bottom: 10px; text-align: center; color: #000000;">
          How to Be Successful on Collabios 🚀
        </h2>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;">
        <!-- List Item -->
        <div style="margin-bottom: 22px; display: flex; align-items: flex-start;">
          <span style="font-size: 26px; margin-right: 8px;">✅</span>
          <div>
            <strong style="font-size: 22px; color: #000000;">Accept or Decline Every Order</strong><br>
            <span style="color: #000000; font-size: 22px;">Creators who accept or decline every order get more opportunities and visibility on the marketplace, as it shows brands you're responsive.</span>
          </div>
        </div>
        <!-- List Item -->
        <div style="margin-bottom: 22px; display: flex; align-items: flex-start;">
          <span style="font-size: 26px; margin-right: 8px;">💬</span>
          <div>
            <strong style="font-size: 22px; color: #000000;">Respond to Messages Quickly</strong><br>
            <span style="color: #000000; font-size: 22px;">Quick communication attracts brands to work with you, while boosting your ranking and reviews. Creators with fast response times receive more consistent work on Collabios.</span>
          </div>
        </div>
        <!-- List Item -->
        <div style="margin-bottom: 22px; display: flex; align-items: flex-start;">
          <span style="font-size: 26px; margin-right: 8px;">⚡</span>
          <div>
            <strong style="font-size: 22px; color: #000000;">Optimize Your Profile</strong><br>
            <span style="color: #000000; font-size: 22px;">A strong title, description, and photos help increase the visibility of your profile on the marketplace. Adding content examples, keywords, and additional fields also increase your discoverability to brands. Ensure your profile and rates are always up to date, this allows brands to find and purchase from you efficiently.
          </span>
          </div>
        </div>
        <!-- List Item -->
        <div style="margin-bottom: 22px; display: flex; align-items: flex-start;">
          <span style="font-size: 26px; margin-right: 8px;">🏆</span>
          <div>
            <strong style="font-size: 22px; color: #000000;">Earn Top Creator and Fast Response Badges</strong><br>
            <span style="color: #000000; font-size: 22px;">Badges help you stand out on the marketplace. The top creator badge is earned by completing multiple orders and receiving a high rating from brands. The fast response badge is earned by responding to requests within 12 hours.</span>
          </div>
        </div>
        <h3 style="margin-top: 26px; font-size: 24px; color: #000000;">💰 Earn $20 for Every Brand You Refer</h3>
        <p style="color: #000000; font-size: 22px;">Get $20 for each brand that signs up and orders through your link—they'll get $10 too.</p>
        <div style="text-align: center; margin: 22px 0;">
          <a href="${referralUrl}" target="_blank" style="
            display: inline-block;
            padding: 14px 28px;
            background-color: #000000;
            color: #ffffff;
            font-size: 20px;
            font-weight: bold;
            text-decoration: none;
            border-radius: 6px;
          ">Share Your Link</a>
        </div>
        <p style="color: #000000; font-size: 22px;">If you have any questions, just reply to this email!</p>
      </div>
    `,
    };
    try {
      const transporter = this.mailTransport();
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      throw new InternalServerErrorException('Failed to send welcome email');
    }
  }

  async sendWelcomeEmailToBrand(to: string): Promise<void> {
    const mailOptions = {
      from: `"${this.configService.get('APP_NAME')}" <${this.configService.get('MAIL_USER')}>`,
      to,
      subject: 'Welcome to Collabios!',
      html: `
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; font-family: Arial, sans-serif;">
        <!-- Logo and Header -->
        <div style="text-align: center; margin-bottom: 40px;">
            <div style="display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                <h1 style="font-family: Arial, sans-serif; font-size: 48px; font-weight: bold; color: #333333; margin: 0; margin-right: 10px;">Collabios</h1>
                <div style="width: 50px; height: 30px; background: linear-gradient(135deg, #ff6800, #ff9100); border-radius: 50%; margin-left: 5px;"></div>
            </div>
        </div>

        <div style="font-size: 16px; color: #000000; line-height: 1.6;">
            <h2 style="font-size: 20px; font-weight: bold; margin-top: 30px; margin-bottom: 20px; text-align: center; color: #000000;">
              Welcome to Collabios—the world's largest open marketplace for finding and hiring influencer talent and UGC services! 🚀
            </h2>
            
            <p style="color: #000000; font-size: 16px; margin-bottom: 22px;">
              We can tell you want to do influencer marketing the <strong>right</strong> way: work with proven content creators, receive authentic content, launch high-performing campaigns, and make real, long-lasting connections with customers.
            </p>
            
            <p style="color: #000000; font-size: 16px; margin-bottom: 22px;">
              😍 You're going to be so excited to <a href="${process.env.VITE_APP_BASE_URL}" style="color: #000000; text-decoration: underline;" target="_blank">explore the Collabios platform</a>. Here's how it works.
            </p>
            
            <h3 style="font-size: 18px; color: #000000; margin-top: 26px; margin-bottom: 16px;">Here's how it works:</h3>
            
            <!-- List Item -->
            <div style="margin-bottom: 22px; display: flex; align-items: flex-start;">
              <span style="font-size: 16px; font-weight: bold; margin-right: 12px; color: #000000;">1.</span>
              <div>
                <strong style="font-size: 16px; color: #000000;">Search our open marketplace</strong>
                <span style="color: #000000; font-size: 16px;"> of 170,000 vetted influencers for free.</span>
              </div>
            </div>
            
            <!-- List Item -->
            <div style="margin-bottom: 22px; display: flex; align-items: flex-start;">
              <span style="font-size: 16px; font-weight: bold; margin-right: 12px; color: #000000;">2.</span>
              <div>
                <span style="color: #000000; font-size: 16px;">Hire the influencers you want to collaborate with.</span>
              </div>
            </div>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <h3 style="font-size: 18px; color: #000000; margin-bottom: 16px;">Step 1: Start Searching</h3>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.VITE_APP_BASE_URL}/search" target="_blank" style="
                display: inline-block;
                padding: 14px 28px;
                background-color: #000000;
                color: #ffffff;
                font-size: 18px;
                font-weight: bold;
                text-decoration: none;
                border-radius: 6px;
              ">Start Searching</a>
            </div>
            
            <p style="color: #000000; font-size: 16px; margin-top: 30px;">Happy searching!</p>
            <p style="color: #000000; font-size: 16px; margin-bottom: 30px;">-The Collabios team</p>
        </div>
    </div>
    `,
    };
    try {
      const transporter = this.mailTransport();
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      throw new InternalServerErrorException('Failed to send welcome email');
    }
  }

  async sendPasswordResetEmail(user: User, resetToken: Token): Promise<void> {
    const mailOptions = {
      from: `"${this.configService.get('APP_NAME')}" <${this.configService.get('MAIL_USER')}>`,
      to: user.email,
      subject: `Password Reset`,
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; min-height: 100vh;">
              <tr>
                  <td align="center" style="padding: 40px 20px;">
                      <table width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden;">
                          <tr>
                              <td align="center" style="padding: 40px 40px 20px 40px; background-color: #ffffff;">
                                  <div style="font-size: 24px; font-weight: 600; color: #333333; margin-bottom: 8px;">
                                      Collabios
                                  </div>
                              </td>
                          </tr>
                          <tr>
                              <td style="padding: 0 40px 40px 40px; background-color: #ffffff;">
                                  <div style="background-color: #f8f9fa; padding: 30px; border-radius: 6px; border: 1px solid #e9ecef;">
                                      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #333333;">
                                          Hey ${user.name},
                                      </p>
                                      <p style="margin: 0 0 25px 0; font-size: 16px; line-height: 1.5; color: #333333;">
                                          We've received a request to reset your password for your account. Click the button below to create a new password:
                                      </p>
                                      <div style="text-align: center; margin: 30px 0;">
                                          <a href="${process.env.VITE_APP_BASE_URL}/reset/${resetToken.token}/set-password/" 
                                             style="display: inline-block; padding: 12px 24px; background-color: #333333; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px;">
                                              Set New Password
                                          </a>
                                      </div>
                                      <p style="margin: 25px 0 0 0; font-size: 16px; line-height: 1.5; color: #333333;">
                                          If you didn't request to change your password, then don't worry! Your password is still safe and you can delete this email.
                                      </p>
                                  </div>
                              </td>
                          </tr>
                          <tr>
                                <td style="padding: 40px 40px 60px 40px; background-color: #ffffff; text-align: center; border-top: 1px solid #f0f0f0;">
                                    <p style="margin: 0 0 8px 0; font-size: 14px; color: #999999;">
                                        © Collabios Inc.
                                    </p>
                                    <p style="margin: 0; font-size: 14px; color: #999999;">
                                        925 W Georgia St, Vancouver, BC V6C 3L2
                                    </p>
                                </td>
                            </tr>
                      </table>
                  </td>
              </tr>
          </table>
      </body>
      </html>
      `,
    };

    try {
      const transporter = this.mailTransport();
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Failed to send referral invite email:', error);
      throw new InternalServerErrorException(
        'Failed to send referral invite email',
      );
    }
  }
}
