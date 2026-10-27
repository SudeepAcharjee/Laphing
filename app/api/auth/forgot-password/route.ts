import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { generatePasswordResetLink } from "@/lib/firebase-admin";
import { getPasswordResetEmailHtml } from "@/lib/email-templates";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Try generating the Firebase password reset link using Admin SDK
    const resetLink = await generatePasswordResetLink(cleanEmail);

    if (!resetLink) {
      // If Admin credentials are not set up in env, tell client to use client SDK
      return NextResponse.json({
        fallbackToClient: true,
        message: "Firebase Admin credentials not configured; use client SDK fallback.",
      });
    }

    // 2. Generate the branded email with the "View Link" button
    const emailData = getPasswordResetEmailHtml({
      email: cleanEmail,
      resetLink,
    });

    // 3. Send email via Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"de Laphing co." <${process.env.MAIL_USER}>`,
      to: cleanEmail,
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html,
    };

    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      message: "Branded password reset email sent successfully.",
    });
  } catch (error: any) {
    console.error("Forgot password API error:", error);
    // If anything fails on the server, allow client-side fallback
    return NextResponse.json({
      fallbackToClient: true,
      error: error.message,
    });
  }
}
