import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim();
    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

    if (!keyId || !keySecret) {
      console.error("Missing Razorpay credentials in environment variables.");
      return NextResponse.json(
        {
          error: "Razorpay credentials not configured in .env.local.",
          code: "AUTH_MISSING",
        },
        { status: 500 }
      );
    }

    try {
      const instance = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });

      const options = {
        amount: Math.round(amount * 100), // amount in smallest currency unit (paise)
        currency: "INR",
        receipt: `rcpt_${crypto.randomBytes(8).toString("hex")}`,
      };

      const order = await instance.orders.create(options);
      return NextResponse.json(order);
    } catch (razorpayErr: any) {
      console.error("Razorpay API error:", razorpayErr);
      const rawDescription =
        razorpayErr?.error?.description ||
        razorpayErr?.description ||
        razorpayErr?.message ||
        "";

      const isAuthError =
        rawDescription.toLowerCase().includes("authentication failed") ||
        razorpayErr?.statusCode === 401 ||
        razorpayErr?.error?.code === "BAD_REQUEST_ERROR";

      const userMessage = isAuthError
        ? "Razorpay Authentication Failed: The API Key ID or Key Secret in .env.local is invalid or expired. Please check your Razorpay Dashboard (Settings > API Keys)."
        : rawDescription || "Failed to create Razorpay order.";

      return NextResponse.json(
        {
          error: userMessage,
          code: isAuthError ? "AUTH_FAILED" : "GATEWAY_ERROR",
          details: rawDescription,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("General error in /api/razorpay:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
