import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";

export async function POST(request: Request) {
  try {
    const { to, subject, text, html } = await request.json();

    if (!to || !subject || (!text && !html)) {
      return NextResponse.json(
        { error: "Missing required fields: 'to', 'subject', and 'text' or 'html' are required." },
        { status: 400 }
      );
    }

    // Create a Nodemailer transporter using SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Check for brand logo file to embed as CID attachment
    const logoPath = path.join(process.cwd(), "public", "logomain.svg");
    const attachments: any[] = [];
    if (fs.existsSync(logoPath)) {
      attachments.push({
        filename: "logomain.svg",
        path: logoPath,
        cid: "brandlogo",
        contentType: "image/svg+xml",
      });
    }

    // Default HTML wrapper if only plain text is provided
    const finalHtml = html || `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; background: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #f0e6e6;">
        <div style="background-color: #741117; padding: 28px 20px; text-align: center;">
          <img src="cid:brandlogo" alt="de Laphing co." width="170" style="display: block; margin: 0 auto 8px auto; max-width: 170px; height: auto;" />
          <div style="color: #FFDE59; font-size: 22px; font-weight: 900; letter-spacing: 0.5px; text-transform: lowercase;">de Laphing co.</div>
        </div>
        <div style="padding: 28px 24px;">
          <h3 style="margin-top: 0; color: #741117; font-size: 20px;">${subject}</h3>
          <div style="font-size: 15px; line-height: 1.7; color: #444; white-space: pre-wrap;">
            ${text}
          </div>
          <br/>
          <p style="font-size: 14px; line-height: 1.6; color: #555; border-top: 1px solid #f0e6e6; padding-top: 16px;">
            With spice & love,<br/>
            <strong style="color: #741117;">de Laphing co. Team</strong>
          </p>
        </div>
      </div>
    `;

    // Setup email data
    const isBulk = Array.isArray(to);
    
    const mailOptions: any = {
      from: `"de Laphing co." <${process.env.MAIL_USER}>`,
      subject,
      text: text || "Please view this email in an HTML-compatible client.",
      html: finalHtml,
      attachments,
    };

    if (isBulk) {
      mailOptions.to = process.env.MAIL_USER;
      mailOptions.bcc = to.join(", ");
    } else {
      mailOptions.to = to;
    }

    // Send email
    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email.", details: error.message },
      { status: 500 }
    );
  }
}
