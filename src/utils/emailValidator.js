// src/utils/validation/emailValidator.js

/**
 * validateEmail(email: string)
 * Returns: { valid: boolean, normalized?: string, reason?: string }
 *
 * Notes:
 * - Uses a pragmatic regex (not RFC-5322-perfect but solid for most apps).
 * - Normalizes by trimming and lowercasing the domain (and, optionally, the whole address).
 */
export default function emailValidator(rawEmail) {
     if (typeof rawEmail !== "string") {
          return { valid: false, reason: "Email must be a string" };
     }

     const email = rawEmail.trim();
     if (!email) return { valid: false, reason: "Email is required" };
     if (email.length > 254) return { valid: false, reason: "Email is too long" };

     // Split quickly to check structure before regex
     const atCount = (email.match(/@/g) || []).length;
     if (atCount !== 1) return { valid: false, reason: "Email must contain one @" };

     const [local, domain] = email.split("@");
     if (!local || !domain) return { valid: false, reason: "Invalid email structure" };

     // Basic domain sanity (no leading/trailing dots, has a dot in domain)
     if (domain.startsWith(".") || domain.endsWith(".")) {
          return { valid: false, reason: "Invalid domain dots" };
     }

     // Reasonable, production-friendly regex (case-insensitive)
     const EMAIL_REGEX =
          /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

     if (!EMAIL_REGEX.test(email)) {
          return { valid: false, reason: "Email format is invalid" };
     }

     // Normalize: lowercase domain; optionally lowercase whole email
     const normalized = `${local}@${domain.toLowerCase()}`;

     return { valid: true, normalized };
}
