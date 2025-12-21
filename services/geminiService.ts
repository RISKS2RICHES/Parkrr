
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Moderates chat messages to prevent off-platform transactions.
 */
export const moderateChatMessage = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `ANT-DISINTERMEDIATION AUDIT.
                 Message to check: "${text}"
                 
                 RULES:
                 1. Detect phone numbers (e.g., +44..., 07..., seven-zero-three...).
                 2. Detect email addresses.
                 3. Detect external social handles (WhatsApp, Telegram, etc.).
                 4. Detect suggestions to "pay in cash" or "off platform".
                 
                 Return JSON ONLY:
                 {
                   "isFlagged": true/false,
                   "reason": "Why it was flagged",
                   "censoredText": "The message with sensitive info replaced by [REDACTED]"
                 }`,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    return { isFlagged: false, reason: "MODERATION_FAILED" };
  }
};

/**
 * Verifies a UK Company ID (CRN) using Google Search grounding against official registers.
 */
export const verifyUKCompany = async (name: string, crn: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Perform a high-level corporate audit of the following UK business:
                 Reported Company Name: ${name}
                 Company Registration Number (CRN): ${crn}
                 
                 Reference the official UK Companies House records to confirm if this business is active and the CRN matches the provided name.
                 
                 Return JSON ONLY:
                 {
                   "isVerified": true/false,
                   "officialName": "The official registered name",
                   "status": "Active/Dissolved/InLiquidation/etc",
                   "rejectionReason": "If false, why it was rejected (e.g., CRN mismatch, dissolved company)"
                 }`,
      config: { 
        responseMimeType: "application/json",
        tools: [{ googleSearch: {} }]
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Company Verification Error:", error);
    return { isVerified: false, rejectionReason: "The corporate registry service is currently unreachable." };
  }
};

/**
 * Searches for a Google Business Profile for the specified company.
 */
export const findGoogleBusinessProfile = async (name: string, crn: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Find the official Google Business Profile (Google Maps entry) for the UK company: ${name} (CRN: ${crn}). 
                 Look for their physical location, rating, and official website.
                 
                 Return JSON ONLY:
                 {
                   "found": true/false,
                   "businessName": "Official Name found on Google",
                   "address": "Full physical address",
                   "rating": 4.5,
                   "website": "example.com",
                   "mapsUrl": "https://maps.google.com/..."
                 }`,
      config: { 
        responseMimeType: "application/json",
        tools: [{ googleSearch: {} }]
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Google Business Search Error:", error);
    return { found: false };
  }
};

/**
 * Finds the official website domain of a company using Google Search grounding.
 */
export const findCompanyDomain = async (name: string, crn: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Find the official corporate website and primary email domain for the UK company: ${name} (CRN: ${crn}).
                 
                 Return JSON ONLY:
                 {
                   "domain": "example.com",
                   "websiteUrl": "https://www.example.com",
                   "confidence": 0.xx
                 }`,
      config: { 
        responseMimeType: "application/json",
        tools: [{ googleSearch: {} }]
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Domain Discovery Error:", error);
    return { domain: null };
  }
};

/**
 * GOOGLE IN-HOUSE ARCHITECTURE SIMULATION
 */
export const verifyIdentity = async (idBase64: string, selfieBase64: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: idBase64 } },
          { inlineData: { mimeType: "image/jpeg", data: selfieBase64 } },
          { text: `IDENTITY VERIFICATION PROTOCOL (Simulation of Google Document AI + Vision AI).

          STEP 1: Document AI Parse
          - Extract Full Name, Date of Birth, ID Number, and Expiry Date.
          - Check for digital alterations or low-quality forgery signals.

          STEP 2: Vision AI Face Detection
          - Detect facial landmarks on both the ID photo and the live selfie.
          - Verify the selfie is a 'live' person (checking for screen re-captures).

          STEP 3: The Decision (Multimodal Match)
          - Compare the faces.
          - Validate the ID is current and not expired.

          Return JSON ONLY:
          {
            "verified": true/false,
            "confidence": 0.xx,
            "detectedName": "Full Name",
            "expiryDate": "YYYY-MM-DD",
            "idNumber": "String",
            "reason": "Detailed analysis result",
            "faceMatchScore": 0.xx
          }` }
        ]
      },
      config: { 
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 4000 }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (e) { 
    console.error("In-House Verification Error:", e);
    return { verified: false, reason: "Neural architecture timeout. Ensure clear images." }; 
  }
};

export const verifyPropertyDocument = async (docBase64: string, expectedAddress: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: docBase64 } },
          { text: `Verify this property document (utility bill, deed, or statement) for address: ${expectedAddress}. Check for matching address and date within 90 days. Return JSON: { "isApproved": true/false, "rejectionReason": "optional" }` }
        ]
      },
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
  } catch (e) { return { isApproved: false }; }
};

export const verifyParkingPhoto = async (photoBase64: string, context: any) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: photoBase64 } },
          { text: `Spatial audit for ${context.capacity} cars at ${context.category}. Ensure the photo shows a clear, safe parking area. Return JSON: { "isApproved": true/false, "detectedFeatures": ["..."], "estimatedCapacity": 1 }` }
        ]
      },
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
  } catch (e) { return { isApproved: false }; }
};
