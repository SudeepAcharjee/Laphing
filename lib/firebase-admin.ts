import { getApps, initializeApp, cert, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import fs from "fs";
import path from "path";

let adminApp: App | null = null;

export function getAdminApp(): App | null {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "laphing-6803d";
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  try {
    // 1. Check if a local serviceAccountKey.json exists in root
    const keyPath = path.resolve(process.cwd(), "serviceAccountKey.json");
    if (fs.existsSync(/*turbopackIgnore: true*/ keyPath)) {
      const fileContent = JSON.parse(fs.readFileSync(/*turbopackIgnore: true*/ keyPath, "utf8"));
      adminApp = initializeApp({ credential: cert(fileContent), projectId });
      return adminApp;
    }

    // 2. Check if FIREBASE_SERVICE_ACCOUNT_KEY is in env (JSON string or file path)
    if (serviceAccountKey) {
      const parsed =
        typeof serviceAccountKey === "string" && serviceAccountKey.trim().startsWith("{")
          ? JSON.parse(serviceAccountKey)
          : require(serviceAccountKey);
      adminApp = initializeApp({ credential: cert(parsed), projectId });
      return adminApp;
    }

    // 3. Check if clientEmail & privateKey are in env
    if (clientEmail && privateKey) {
      adminApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        projectId,
      });
      return adminApp;
    }

    // 4. Fallback without credentials
    adminApp = initializeApp({ projectId });
    return adminApp;
  } catch (err) {
    console.warn("Could not initialize Firebase Admin SDK:", err);
    return null;
  }
}

/**
 * Generates a password reset link for the given email using Firebase Admin SDK.
 * Returns the exact action link (e.g. https://laphing-6803d.firebaseapp.com/__/auth/action?mode=resetPassword&oobCode=...)
 */
export async function generatePasswordResetLink(
  email: string,
  actionCodeSettings?: { url: string; handleCodeInApp?: boolean }
): Promise<string | null> {
  const app = getAdminApp();
  if (!app) return null;

  try {
    const auth = getAuth(app);
    const link = actionCodeSettings
      ? await auth.generatePasswordResetLink(email, actionCodeSettings)
      : await auth.generatePasswordResetLink(email);
    return link;
  } catch (error: any) {
    console.warn("Firebase Admin generatePasswordResetLink notice:", error.message);
    return null;
  }
}
