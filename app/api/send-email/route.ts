import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import {
  renderMasterEmail,
  getWelcomeEmailHtml,
  getOrderStatusEmailHtml,
  getBroadcastEmailHtml,
} from "@/lib/email-templates";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      to,
      subject: reqSubject,
      text: reqText,
      html: reqHtml,
      type,
      name,
      referralCode,
      discountPercent,
      orderId,
      newStatus,
    } = body;

    if (!to) {
      return NextResponse.json(
        { error: "Missing required recipient 'to' address." },
        { status: 400 }
      );
    }

    let finalSubject = reqSubject;
    let finalHtml = reqHtml;
    let finalText = reqText;

    // Handle template types
    if (type === "welcome") {
      const welcome = getWelcomeEmailHtml({
        name: name || "",
        referralCode: referralCode || "",
        discountPercent: discountPercent ?? 20,
      });
      finalSubject = finalSubject || welcome.subject;
      finalHtml = welcome.html;
      finalText = welcome.text;
    } else if (type === "order_status") {
      const orderUpdate = getOrderStatusEmailHtml({
        orderId: orderId || "",
        customerName: name || "",
        newStatus: newStatus || "Processing",
      });
      finalSubject = finalSubject || orderUpdate.subject;
      finalHtml = orderUpdate.html;
      finalText = orderUpdate.text;
    } else if (type === "broadcast" && reqSubject && reqText) {
      const broadcast = getBroadcastEmailHtml({
        subject: reqSubject,
        message: reqText,
      });
      finalSubject = broadcast.subject;
      finalHtml = broadcast.html;
      finalText = broadcast.text;
    } else if (!finalHtml && (reqSubject || finalText)) {
      // Default fallback: wrap plain text in master brand email layout
      finalHtml = renderMasterEmail({
        headline: finalSubject || "Message from de Laphing co.",
        bodyHtml: `<div style="white-space: pre-wrap; font-size: 15px; line-height: 1.7; color: #3A2022;">${
          finalText || ""
        }</div>`,
      });
    }

    if (!finalSubject || (!finalHtml && !finalText)) {
      return NextResponse.json(
        { error: "Missing required fields: subject and message body are required." },
        { status: 400 }
      );
    }

    // Configure Nodemailer transporter using SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const isBulk = Array.isArray(to);

    const mailOptions: any = {
      from: `"de Laphing co." <${process.env.MAIL_USER}>`,
      subject: finalSubject,
      text: finalText || "Please view this email in an HTML-compatible client.",
      html: finalHtml,
    };

    if (isBulk) {
      mailOptions.to = process.env.MAIL_USER;
      mailOptions.bcc = to.join(", ");
    } else {
      mailOptions.to = to;
    }

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
