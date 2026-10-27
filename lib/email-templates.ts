/**
 * Master Email Template Generator for de Laphing co.
 * Features:
 * - Brand logo: https://laphing-website.vercel.app/logo.svg
 * - Brand Colors: #741117 (Tibetan Maroon), #FFDE59 (Signature Yellow), #2B0B0E (Dark Crimson)
 * - Sign-off: "Regards,\nDe Laphing Team" across all emails
 * - Clean layout: No external website links
 * - 100% Responsive & Cross-Client Compatible
 */

export const BRAND_LOGO_URL = "https://laphing-website.vercel.app/logo.svg";

interface EmailWrapperOptions {
  preheader?: string;
  headline?: string;
  badgeText?: string;
  bodyHtml: string;
  actionButton?: {
    text: string;
    url: string;
  };
  footerNote?: string;
}

/**
 * Wraps content inside the master de Laphing co. branded email template
 */
export function renderMasterEmail({
  preheader = "Authentic Tibetan Cold Laphing",
  headline,
  badgeText,
  bodyHtml,
  actionButton,
  footerNote,
}: EmailWrapperOptions): string {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>de Laphing co.</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #F8F4EB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; color: #2D1416;">
  
  <!-- Preheader preview text (hidden in body) -->
  <div style="display: none; font-size: 1px; color: #F8F4EB; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${preheader}
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8F4EB; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 30px 15px 40px 15px;">
        
        <!-- Main Card Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 12px 35px rgba(116, 17, 23, 0.08); border: 1px solid #EEDFCE;">
          
          <!-- Header Banner (Clean logo without website link) -->
          <tr>
            <td align="center" style="background: linear-gradient(135deg, #741117 0%, #520C11 100%); background-color: #741117; padding: 34px 24px 28px 24px; text-align: center;">
              <img 
                src="${BRAND_LOGO_URL}" 
                alt="de Laphing co." 
                width="170" 
                height="auto" 
                style="display: block; margin: 0 auto; max-width: 170px; width: 100%; height: auto; border: 0; outline: none; text-decoration: none;" 
              />
              <div style="margin-top: 12px; color: #FFDE59; font-size: 12px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">
                AUTHENTIC TIBETAN COLD LAPHING
              </div>
            </td>
          </tr>

          <!-- Optional Status / Announcement Pill -->
          ${
            badgeText
              ? `
          <tr>
            <td align="center" style="padding: 24px 28px 0 28px;">
              <span style="display: inline-block; background-color: #FFF4CE; color: #741117; font-size: 13px; font-weight: 800; letter-spacing: 0.5px; padding: 6px 16px; border-radius: 50px; border: 1px solid #FFDE59; text-transform: uppercase;">
                ${badgeText}
              </span>
            </td>
          </tr>
          `
              : ""
          }

          <!-- Headline (if provided) -->
          ${
            headline
              ? `
          <tr>
            <td align="center" style="padding: 20px 28px 0 28px;">
              <h1 style="margin: 0; color: #741117; font-size: 24px; font-weight: 900; line-height: 1.3; letter-spacing: -0.5px;">
                ${headline}
              </h1>
            </td>
          </tr>
          `
              : ""
          }

          <!-- Body Content Area -->
          <tr>
            <td style="padding: 24px 32px 28px 32px; font-size: 15px; line-height: 1.7; color: #3A2022;">
              ${bodyHtml}

              <!-- Action Button (e.g. Firebase "View Link") -->
              ${
                actionButton
                  ? `
              <div style="text-align: center; margin: 32px 0 16px 0;">
                <a 
                  href="${actionButton.url}" 
                  target="_blank" 
                  style="display: inline-block; background-color: #FFDE59; color: #741117; font-size: 16px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.8px; text-decoration: none; padding: 15px 36px; border-radius: 999px; box-shadow: 0 6px 20px rgba(255, 222, 89, 0.45); border: 2px solid #E5C33E; mso-padding-alt: 0;"
                >
                  <!--[if mso]>
                  <i style="letter-spacing: 36px; mso-font-width: -100%; mso-text-raise: 30pt">&nbsp;</i>
                  <![endif]-->
                  <span style="mso-text-raise: 15pt;">${actionButton.text}</span>
                  <!--[if mso]>
                  <i style="letter-spacing: 36px; mso-font-width: -100%">&nbsp;</i>
                  <![endif]-->
                </a>
              </div>
              `
                  : ""
              }

              <!-- Standard Signature: Regards, De Laphing Team -->
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #F1E4D4; font-size: 14px; line-height: 1.6; color: #6D4C4E;">
                ${footerNote || `Regards,<br /><strong style="color: #741117; font-size: 15px;">De Laphing Team</strong>`}
              </div>
            </td>
          </tr>

          <!-- Bottom Footer Bar (No website link) -->
          <tr>
            <td style="background-color: #FAF4EB; padding: 22px 28px; text-align: center; border-top: 1px solid #EEDFCE;">
              <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; color: #741117; text-transform: uppercase; letter-spacing: 1px;">
                de Laphing co. • Street Food Reimagined
              </p>
              <p style="margin: 0 0 8px 0; font-size: 12px; line-height: 1.5; color: #856769;">
                Fresh cold noodles, homemade fiery chili oil, soy granules & Wai Wai crunch.<br />
                Delivered cold & ready in 5 minutes.
              </p>
              <div style="font-size: 12px; color: #856769;">
                <a href="mailto:delaphingcompany@gmail.com" style="color: #741117; font-weight: 700; text-decoration: underline;">Contact: delaphingcompany@gmail.com</a>
              </div>
              <p style="margin: 10px 0 0 0; font-size: 11px; color: #A68B8D;">
                © ${new Date().getFullYear()} de Laphing co. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
        <!-- End Main Card -->

      </td>
    </tr>
  </table>

</body>
</html>`;
}

/**
 * 1. Welcome / Signup Email (20% OFF Unlocked)
 */
export function getWelcomeEmailHtml({
  name,
  referralCode,
  discountPercent = 20,
}: {
  name: string;
  referralCode?: string;
  discountPercent?: number;
}): { subject: string; html: string; text: string } {
  const firstName = name?.trim() ? name.trim().split(" ")[0] : "Laphing Lover";
  const subject = `Welcome to de Laphing co.! Here is your ${discountPercent}% OFF `;

  const bodyHtml = `
    <p style="margin: 0 0 16px 0; font-size: 16px;">
      Hey <strong>${firstName}</strong>,
    </p>
    <p style="margin: 0 0 18px 0;">
      Welcome to the <strong>de Laphing co.</strong> family! You just unlocked front-row access to the most craved street food on earth — authentic Tibetan cold laphing with signature spicy garlic chili oil, soy granules, and the iconic Wai Wai noodle crunch.
    </p>

    <!-- 20% OFF Promo Card -->
    <div style="background: linear-gradient(135deg, #FFF9E6 0%, #FFF3CC 100%); border: 2px dashed #FFDE59; border-radius: 16px; padding: 22px 20px; text-align: center; margin: 24px 0;">
      <div style="color: #741117; font-size: 13px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase;">
        YOUR VIP WELCOME PERK
      </div>
      <div style="color: #741117; font-size: 38px; font-weight: 900; line-height: 1.1; margin: 8px 0 4px 0;">
        ${discountPercent}% OFF
      </div>
      <div style="color: #520C11; font-size: 14px; font-weight: 600;">
        Automatically unlocked & ready to apply at checkout!
      </div>
    </div>

    ${
      referralCode
        ? `
    <!-- Referral Reward Box -->
    <div style="background-color: #FAF4EB; border-radius: 14px; border: 1px solid #EEDFCE; padding: 18px 20px; margin: 20px 0;">
      <div style="font-weight: 800; color: #741117; font-size: 14px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
        🤝 Want an extra +10% OFF? (Total 30% Discount!)
      </div>
      <p style="margin: 0 0 10px 0; font-size: 13.5px; color: #553335; line-height: 1.6;">
        Share your unique referral code with friends. When <strong>2 friends</strong> join using your link, you unlock an extra +10% bonus discount!
      </p>
      <div style="background-color: #FFFFFF; border: 1px solid #D8C4B0; border-radius: 10px; padding: 10px 14px; text-align: center;">
        <span style="font-size: 12px; color: #856769; text-transform: uppercase; font-weight: 700;">Your Referral Code:</span>
        <div style="font-size: 20px; font-weight: 900; color: #741117; letter-spacing: 2px; margin-top: 2px;">
          ${referralCode.toUpperCase()}
        </div>
      </div>
    </div>
    `
        : ""
    }

    <p style="margin: 20px 0 0 0; font-size: 14px; color: #6D4C4E;">
      Pack of 3 servings. Ready in under 5 minutes. No cooking skills needed.
    </p>
  `;

  const html = renderMasterEmail({
    preheader: `Here is your ${discountPercent}% OFF welcome discount for authentic Tibetan cold laphing!`,
    badgeText: "VIP Member Unlocked",
    headline: "You're On The VIP List!",
    bodyHtml,
  });

  const text = `Welcome to de Laphing co.!\n\nHey ${firstName},\n\nYou have unlocked ${discountPercent}% OFF on your order!\n${
    referralCode
      ? `Your unique referral code is: ${referralCode.toUpperCase()}\nShare with 2 friends to unlock an extra +10% OFF (total 30% discount!)\n`
      : ""
  }\nRegards,\nDe Laphing Team`;

  return { subject, html, text };
}

/**
 * 2. Password Reset Email (with "View Link" button opening the Firebase link)
 */
export function getPasswordResetEmailHtml({
  email,
  resetLink,
}: {
  email: string;
  resetLink: string;
}): { subject: string; html: string; text: string } {
  const subject = "Reset your password - de Laphing co.";

  const bodyHtml = `
    <p style="margin: 0 0 16px 0; font-size: 16px;">
      Hello,
    </p>
    <p style="margin: 0 0 18px 0;">
      We received a request to reset the password for your <strong>de Laphing co.</strong> account associated with <strong style="color: #741117;">${email}</strong>.
    </p>
    <p style="margin: 0 0 20px 0;">
      Click the button below to open your secure link and choose a new password:
    </p>

    <!-- Highlight Box with Direct Fallback -->
    <div style="background-color: #FAF4EB; border: 1px solid #EEDFCE; border-radius: 14px; padding: 18px 20px; margin: 22px 0; text-align: left;">
      <div style="font-size: 13px; font-weight: 800; color: #741117; margin-bottom: 6px; text-transform: uppercase;">
        🔗 Can't click the button?
      </div>
      <p style="margin: 0 0 8px 0; font-size: 12.5px; color: #6D4C4E; line-height: 1.5;">
        You can also copy and paste this exact link directly into your browser:
      </p>
      <div style="word-break: break-all; font-size: 12px; color: #741117; background-color: #FFFFFF; padding: 10px 12px; border-radius: 8px; border: 1px solid #D8C4B0;">
        <a href="${resetLink}" target="_blank" style="color: #741117; text-decoration: underline;">${resetLink}</a>
      </div>
    </div>

    <!-- Security notice -->
    <p style="margin: 20px 0 0 0; font-size: 13px; color: #856769; line-height: 1.6;">
      🔒 <strong>Security Note:</strong> This password reset link will expire in 1 hour. If you did not request a password reset, you can safely ignore this email — your password will remain unchanged and your account is secure.
    </p>
  `;

  const html = renderMasterEmail({
    preheader: "Reset your de Laphing co. password - click View Link to continue",
    badgeText: "Security Verification",
    headline: "Reset Your Password",
    bodyHtml,
    actionButton: {
      text: "View Link",
      url: resetLink,
    },
    footerNote: `Need assistance? Reply directly to this email or contact <a href="mailto:delaphingcompany@gmail.com" style="color: #741117; font-weight: 700;">delaphingcompany@gmail.com</a>.<br /><br />Regards,<br /><strong style="color: #741117; font-size: 15px;">De Laphing Team</strong>`,
  });

  const text = `Reset your password - de Laphing co.\n\nHello,\n\nWe received a request to reset your password for ${email}.\n\nOpen this link to reset your password:\n${resetLink}\n\nThis link will expire in 1 hour. If you didn't request this, you can ignore this email.\n\nRegards,\nDe Laphing Team`;

  return { subject, html, text };
}

/**
 * 3. Order Status Email
 */
export function getOrderStatusEmailHtml({
  orderId,
  customerName,
  newStatus,
}: {
  orderId: string;
  customerName?: string;
  newStatus: string;
}): { subject: string; html: string; text: string } {
  const shortId = orderId ? orderId.slice(0, 8).toUpperCase() : "";
  const subject = `Order #${shortId} Status Update: ${newStatus} - de Laphing co.`;

  const bodyHtml = `
    <p style="margin: 0 0 16px 0; font-size: 16px;">
      Dear <strong>${customerName || "Customer"}</strong>,
    </p>
    <p style="margin: 0 0 18px 0;">
      Your order <strong>#${shortId}</strong> has a new update!
    </p>

    <!-- Status Card -->
    <div style="background: linear-gradient(135deg, #FFF9E6 0%, #FFF3CC 100%); border: 2px solid #FFDE59; border-radius: 16px; padding: 22px 20px; text-align: center; margin: 24px 0;">
      <div style="color: #741117; font-size: 12px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase;">
        CURRENT ORDER STATUS
      </div>
      <div style="color: #741117; font-size: 32px; font-weight: 900; line-height: 1.2; margin: 8px 0 4px 0;">
        ${newStatus}
      </div>
      <div style="color: #520C11; font-size: 13.5px; font-weight: 600;">
        Order #${shortId} • Pack of 3 Servings
      </div>
    </div>

    <p style="margin: 0 0 14px 0; font-size: 14.5px; line-height: 1.6;">
      We are preparing and dispatching your cold laphing kit with care. Everything is sealed fresh so you get the true Majnu Ka Tilla street-style flavor right at home.
    </p>
    <p style="margin: 0 0 0 0; font-size: 13.5px; color: #6D4C4E;">
      Have questions about your delivery? Feel free to reply directly to this email anytime.
    </p>
  `;

  const html = renderMasterEmail({
    preheader: `Your order #${shortId} status has been updated to ${newStatus}.`,
    badgeText: "Order Update",
    headline: "Order Status Update",
    bodyHtml,
  });

  const text = `Order #${shortId} Status Update: ${newStatus}\n\nDear ${customerName || "Customer"},\n\nYour order #${shortId} has been updated to: ${newStatus}.\n\nRegards,\nDe Laphing Team`;

  return { subject, html, text };
}

/**
 * 4. General Admin Broadcast Email
 */
export function getBroadcastEmailHtml({
  subject,
  message,
}: {
  subject: string;
  message: string;
}): { subject: string; html: string; text: string } {
  const formattedMessage = message
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((p) => `<p style="margin: 0 0 14px 0;">${p}</p>`)
    .join("");

  const html = renderMasterEmail({
    preheader: subject,
    badgeText: "Community Announcement",
    headline: subject,
    bodyHtml: formattedMessage,
  });

  return { subject: `${subject} - de Laphing co.`, html, text: `${message}\n\nRegards,\nDe Laphing Team` };
}
