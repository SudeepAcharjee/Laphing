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

    // Determine the base site URL
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXTAUTH_URL ||
      "https://laphing-website.vercel.app";

    // ActionCodeSettings to route directly to our custom reset page
    const actionCodeSettings = {
      url: `${baseUrl}/reset-password`,
      handleCodeInApp: true,
    };

    // 1. Try generating the Firebase password reset link using Admin SDK
    const resetLink = await generatePasswordResetLink(cleanEmail, actionCodeSettings);

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
    console.error("Forgot password route error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process forgot password request." },
      { status: 500 }
    );
  }
}
