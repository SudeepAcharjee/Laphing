/**
 * Master Email Template Generator for de Laphing co.
 *
 * Brand Palette:
 * - Tibetan Maroon: #741117 & #520C11
 * - Warm Yellow: #FFDE59 (Signature Accent)
 * - Cream Warm Background: #FFF5DB & #F9F3EA
 * - Dark Crimson Text: #2D1416
 *
 * Standards:
 * - Table-based responsive email HTML compatible with Gmail, Apple Mail, Outlook, Yahoo
 * - Brand styling with typography, styled badges, rounded cards, and high-contrast CTA buttons
 * - Sign-off: "Regards,\nDe Laphing Team" across all emails
 */

export const BRAND_LOGO_URL =
  process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/logo-footer.svg`
    : "https://laphing-website.vercel.app/logo-footer.svg";

interface EmailWrapperOptions {
  preheader?: string;
  headline?: string;
  badgeText?: string;
  bodyHtml: string;
  actionButton?: {
    text: string;
    url: string;
    subtitle?: string;
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
    body, table, td, p, a {font-family: Arial, sans-serif !important;}
  </style>
  <![endif]-->
  <style type="text/css">
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; border-radius: 16px !important; }
      .email-content { padding: 22px 20px !important; }
      .email-header { padding: 28px 20px 22px 20px !important; }
      .email-title { font-size: 24px !important; }
      .cta-btn { width: 100% !important; padding: 15px 20px !important; box-sizing: border-box !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #520C11; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; color: #2D1416;">
  
  <!-- Preheader preview text (hidden in body) -->
  <div style="display: none; font-size: 1px; color: #520C11; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all;">
    ${preheader}
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background: radial-gradient(circle at top, #741117 0%, #420A0E 100%); background-color: #520C11; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 35px 12px 45px 12px;">
        
        <!-- Main Card Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 580px; background-color: #FFFFFF; border-radius: 24px; overflow: hidden; box-shadow: 0 16px 45px rgba(0, 0, 0, 0.35); border: 3px solid #FFDE59;">
          
          <!-- Header Banner -->
          <tr>
            <td align="center" class="email-header" style="background: linear-gradient(180deg, #741117 0%, #5E0D12 100%); background-color: #741117; padding: 34px 28px 26px 28px; text-align: center; border-bottom: 3px solid #FFDE59;">
              
              <!-- Brand Title / Logo Text -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="font-family: Impact, Arial Black, sans-serif; font-size: 32px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase; line-height: 1;">
                      <span style="color: #FFDE59;">THE </span><span style="color: #FFFFFF;">LAPHING CO.</span>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Golden Accent Tagline -->
              <div style="margin-top: 10px; color: #FFDE59; font-size: 11px; font-weight: 800; letter-spacing: 2.5px; text-transform: uppercase; opacity: 0.95;">
                AUTHENTIC TIBETAN COLD NOODLES
              </div>
            </td>
          </tr>

          <!-- Optional Status / Announcement Pill -->
          ${
            badgeText
              ? `
          <tr>
            <td align="center" style="padding: 26px 28px 0 28px;">
              <span style="display: inline-block; background-color: #741117; color: #FFDE59; font-size: 11.5px; font-weight: 800; letter-spacing: 1.2px; padding: 6px 18px; border-radius: 999px; border: 1.5px solid #FFDE59; text-transform: uppercase;">
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
            <td align="center" style="padding: 16px 28px 0 28px;">
              <h1 class="email-title" style="margin: 0; color: #741117; font-size: 26px; font-weight: 900; line-height: 1.25; letter-spacing: -0.3px; text-transform: uppercase;">
                ${headline}
              </h1>
            </td>
          </tr>
          `
              : ""
          }

          <!-- Body Content Area -->
          <tr>
            <td class="email-content" style="padding: 24px 34px 30px 34px; font-size: 15px; line-height: 1.65; color: #2D1416;">
              ${bodyHtml}

              <!-- Action Button (High-Contrast Tibetan Yellow Button) -->
              ${
                actionButton
                  ? `
              <div style="text-align: center; margin: 34px 0 20px 0;">
                <!--[if mso]>
                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${actionButton.url}" style="height:52px;v-text-anchor:middle;width:280px;" arcsize="50%" fillcolor="#FFDE59" stroke="f">
                <w:anchorlock/>
                <center style="color:#741117;font-family:Arial,sans-serif;font-size:16px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">
                  ${actionButton.text}
                </center>
                </v:roundrect>
                <![endif]-->
                <!--[if !mso]><!-->
                <a 
                  href="${actionButton.url}" 
                  target="_blank" 
                  class="cta-btn"
                  style="display: inline-block; background-color: #FFDE59; color: #741117; font-size: 15.5px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.8px; text-decoration: none; padding: 15px 36px; border-radius: 999px; box-shadow: 0 6px 18px rgba(116, 17, 23, 0.25); border: 2px solid #E5C33E;"
                >
                  ${actionButton.text}
                </a>
                <!--<![endif]-->
                ${
                  actionButton.subtitle
                    ? `<div style="margin-top: 8px; font-size: 12px; color: #856769;">${actionButton.subtitle}</div>`
                    : ""
                }
              </div>
              `
                  : ""
              }

              <!-- Standard Signature -->
              <div style="margin-top: 32px; padding-top: 22px; border-top: 1.5px dashed #EEDFCE; font-size: 14px; line-height: 1.6; color: #6D4C4E;">
                ${
                  footerNote ||
                  `Warm regards,<br /><strong style="color: #741117; font-size: 15.5px;">De Laphing Team</strong>`
                }
              </div>
            </td>
          </tr>

          <!-- Bottom Footer Bar -->
          <tr>
            <td style="background-color: #FAF4EB; padding: 24px 28px; text-align: center; border-top: 2px solid #EEDFCE;">
              <p style="margin: 0 0 6px 0; font-size: 12.5px; font-weight: 800; color: #741117; text-transform: uppercase; letter-spacing: 1px;">
                THE LAPHING CO. • AUTHENTIC TIBETAN STREET FOOD
              </p>
              <p style="margin: 0 0 10px 0; font-size: 12px; line-height: 1.5; color: #7A5B5D;">
                Majnu-ka-tilla style cold noodles with artisanal chilli oil, savory soy chunks & crispy Wai Wai crunch.<br />
                Freshly packed & delivered cold straight to your door.
              </p>
              <div style="font-size: 12px; color: #7A5B5D;">
                Need help? Contact us: <a href="mailto:delaphingcompany@gmail.com" style="color: #741117; font-weight: 700; text-decoration: underline;">delaphingcompany@gmail.com</a>
              </div>
              <p style="margin: 12px 0 0 0; font-size: 11px; color: #9E8183;">
                © ${new Date().getFullYear()} The Laphing Co. All rights reserved.
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
  const firstName = name?.trim() ? name.trim().split(" ")[0] : "Friend";
  const subject = `Welcome to The Laphing Co.! Here is your ${discountPercent}% OFF 🎉`;

  const bodyHtml = `
    <p style="margin: 0 0 14px 0; font-size: 16px; color: #2D1416;">
      Hey <strong>${firstName}</strong>,
    </p>
    <p style="margin: 0 0 16px 0; color: #4A2628;">
      You're officially on the VIP list at <strong>The Laphing Co.</strong>! We're bringing the authentic street-style Tibetan cold laphing of Majnu Ka Tilla straight to your kitchen — complete with our signature fiery garlic chilli oil, soy nuggets, and crunchy Wai Wai noodles.
    </p>

    <!-- 20% OFF Promo Card -->
    <div style="background: linear-gradient(135deg, #FFF9E6 0%, #FFF3CC 100%); border: 2.5px dashed #FFDE59; border-radius: 18px; padding: 24px 20px; text-align: center; margin: 24px 0; box-shadow: 0 4px 14px rgba(255, 222, 89, 0.25);">
      <div style="color: #741117; font-size: 12px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase;">
        YOUR VIP WELCOME PERK
      </div>
      <div style="color: #741117; font-size: 42px; font-weight: 900; line-height: 1.1; margin: 8px 0 4px 0;">
        ${discountPercent}% OFF
      </div>
      <div style="color: #520C11; font-size: 13.5px; font-weight: 700;">
        Unlocked on your account & applies automatically at checkout!
      </div>
    </div>

    ${
      referralCode
        ? `
    <!-- Referral Reward Box -->
    <div style="background-color: #FAF4EB; border-radius: 16px; border: 1.5px solid #EEDFCE; padding: 20px 22px; margin: 24px 0;">
      <div style="font-weight: 900; color: #741117; font-size: 13.5px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
        🤝 Want an extra +10% OFF? (Total 30% Discount!)
      </div>
      <p style="margin: 0 0 12px 0; font-size: 13.5px; color: #553335; line-height: 1.55;">
        Share your unique referral code with friends. When <strong>2 friends</strong> join using your link, you unlock a bonus +10% discount!
      </p>
      <div style="background-color: #FFFFFF; border: 2px dashed #741117; border-radius: 12px; padding: 12px 16px; text-align: center;">
        <span style="font-size: 11px; color: #856769; text-transform: uppercase; font-weight: 800; letter-spacing: 1px;">Your Referral Code:</span>
        <div style="font-size: 22px; font-weight: 900; color: #741117; letter-spacing: 2px; margin-top: 3px;">
          ${referralCode.toUpperCase()}
        </div>
      </div>
    </div>
    `
        : ""
    }

    <!-- Quick Features -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 22px 0 10px 0; border-collapse: separate; border-spacing: 8px 0;">
      <tr>
        <td align="center" style="background-color: #FAF4EB; padding: 12px 8px; border-radius: 10px; border: 1px solid #EEDFCE; width: 33.3%;">
          <div style="font-size: 18px; margin-bottom: 2px;">🍜</div>
          <div style="font-size: 11.5px; font-weight: 800; color: #741117; text-transform: uppercase;">Pack of 3</div>
        </td>
        <td align="center" style="background-color: #FAF4EB; padding: 12px 8px; border-radius: 10px; border: 1px solid #EEDFCE; width: 33.3%;">
          <div style="font-size: 18px; margin-bottom: 2px;">⚡</div>
          <div style="font-size: 11.5px; font-weight: 800; color: #741117; text-transform: uppercase;">Ready in 5 Mins</div>
        </td>
        <td align="center" style="background-color: #FAF4EB; padding: 12px 8px; border-radius: 10px; border: 1px solid #EEDFCE; width: 33.3%;">
          <div style="font-size: 18px; margin-bottom: 2px;">❄️</div>
          <div style="font-size: 11.5px; font-weight: 800; color: #741117; text-transform: uppercase;">Delivered Cold</div>
        </td>
      </tr>
    </table>
  `;

  const html = renderMasterEmail({
    preheader: `Here is your ${discountPercent}% OFF welcome discount for authentic Tibetan cold laphing!`,
    badgeText: "VIP Member Unlocked",
    headline: "You're On The VIP List!",
    bodyHtml,
  });

  const text = `Welcome to The Laphing Co.!\n\nHey ${firstName},\n\nYou have unlocked ${discountPercent}% OFF on your order!\n${
    referralCode
      ? `Your unique referral code is: ${referralCode.toUpperCase()}\nShare with 2 friends to unlock an extra +10% OFF (total 30% discount!)\n`
      : ""
  }\nWarm regards,\nDe Laphing Team`;

  return { subject, html, text };
}

/**
 * 2. Password Reset Email (Clean & High-Security)
 */
export function getPasswordResetEmailHtml({
  email,
  resetLink,
}: {
  email: string;
  resetLink: string;
}): { subject: string; html: string; text: string } {
  const subject = "Reset Your Password - The Laphing Co.";

  const bodyHtml = `
    <p style="margin: 0 0 14px 0; font-size: 16px; color: #2D1416;">
      Hello,
    </p>
    <p style="margin: 0 0 16px 0; color: #4A2628;">
      We received a request to reset the password for your <strong>The Laphing Co.</strong> account registered under <strong style="color: #741117;">${email}</strong>.
    </p>
    <p style="margin: 0 0 20px 0; color: #4A2628;">
      Click the button below to choose a new password and get back to your spicy cravings:
    </p>

    <!-- Highlight Box with Direct Fallback Link -->
    <div style="background-color: #FAF4EB; border: 1.5px solid #EEDFCE; border-radius: 14px; padding: 18px 20px; margin: 24px 0; text-align: left;">
      <div style="font-size: 12px; font-weight: 900; color: #741117; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
        🔗 Can't click the button above?
      </div>
      <p style="margin: 0 0 8px 0; font-size: 12.5px; color: #6D4C4E; line-height: 1.5;">
        Copy and paste this link directly into your browser:
      </p>
      <div style="word-break: break-all; font-size: 12px; color: #741117; background-color: #FFFFFF; padding: 10px 12px; border-radius: 8px; border: 1px solid #D8C4B0; font-family: monospace;">
        <a href="${resetLink}" target="_blank" style="color: #741117; text-decoration: underline;">${resetLink}</a>
      </div>
    </div>

    <!-- Security notice -->
    <div style="background-color: #FFF9E6; border-left: 3px solid #741117; padding: 12px 14px; border-radius: 4px; margin-top: 20px;">
      <p style="margin: 0; font-size: 12.5px; color: #741117; line-height: 1.5;">
        🔒 <strong>Security Notice:</strong> This password reset link is valid for 1 hour. If you didn't request this change, you can safely disregard this email — your password remains completely secure.
      </p>
    </div>
  `;

  const html = renderMasterEmail({
    preheader: "Reset your password for The Laphing Co. - link expires in 1 hour",
    badgeText: "Security Verification",
    headline: "Reset Your Password",
    bodyHtml,
    actionButton: {
      text: "Reset My Password",
      url: resetLink,
      subtitle: "Secure link powered by Firebase Auth",
    },
    footerNote: `Need assistance? Reply directly to this email or contact <a href="mailto:delaphingcompany@gmail.com" style="color: #741117; font-weight: 700;">delaphingcompany@gmail.com</a>.<br /><br />Warm regards,<br /><strong style="color: #741117; font-size: 15.5px;">De Laphing Team</strong>`,
  });

  const text = `Reset your password - The Laphing Co.\n\nHello,\n\nWe received a request to reset your password for ${email}.\n\nOpen this link to reset your password:\n${resetLink}\n\nThis link will expire in 1 hour. If you didn't request this, you can ignore this email.\n\nWarm regards,\nDe Laphing Team`;

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
  const subject = `Order #${shortId} Update: ${newStatus} - The Laphing Co.`;

  const bodyHtml = `
    <p style="margin: 0 0 14px 0; font-size: 16px; color: #2D1416;">
      Dear <strong>${customerName || "Customer"}</strong>,
    </p>
    <p style="margin: 0 0 16px 0; color: #4A2628;">
      Great news! There is an update regarding your cold laphing kit order <strong>#${shortId}</strong>.
    </p>

    <!-- Status Card -->
    <div style="background: linear-gradient(135deg, #FFF9E6 0%, #FFF3CC 100%); border: 2px solid #FFDE59; border-radius: 18px; padding: 24px 20px; text-align: center; margin: 24px 0; box-shadow: 0 4px 14px rgba(255, 222, 89, 0.25);">
      <div style="color: #741117; font-size: 11px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase;">
        CURRENT STATUS
      </div>
      <div style="color: #741117; font-size: 32px; font-weight: 900; line-height: 1.2; margin: 8px 0 4px 0;">
        ${newStatus}
      </div>
      <div style="color: #520C11; font-size: 13px; font-weight: 700;">
        Order #${shortId} • Pack of 3 Cold Laphing Servings
      </div>
    </div>

    <p style="margin: 0 0 14px 0; font-size: 14.5px; line-height: 1.6; color: #4A2628;">
      Each kit is vacuum-sealed and temperature-controlled with our authentic Majnu Ka Tilla street seasoning.
    </p>
    <p style="margin: 0; font-size: 13px; color: #7A5B5D;">
      Have questions about delivery? Reply directly to this email anytime and our kitchen team will assist you.
    </p>
  `;

  const html = renderMasterEmail({
    preheader: `Your order #${shortId} status has been updated to ${newStatus}.`,
    badgeText: "Order Tracking",
    headline: "Order Status Update",
    bodyHtml,
  });

  const text = `Order #${shortId} Status Update: ${newStatus}\n\nDear ${customerName || "Customer"},\n\nYour order #${shortId} has been updated to: ${newStatus}.\n\nWarm regards,\nDe Laphing Team`;

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
    .map((p) => `<p style="margin: 0 0 14px 0; color: #2D1416;">${p}</p>`)
    .join("");

  const html = renderMasterEmail({
    preheader: subject,
    badgeText: "Announcement",
    headline: subject,
    bodyHtml: formattedMessage,
  });

  return {
    subject: `${subject} - The Laphing Co.`,
    html,
    text: `${message}\n\nWarm regards,\nDe Laphing Team`,
  };
}
