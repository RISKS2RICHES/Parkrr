
/**
 * GEMINI SERVICE (DISABLED)
 * 
 * This application is currently operating as a website/landing page only.
 * All AI services have been removed.
 */

// Placeholder functions to prevent build errors in unused components
export const moderateChatMessage = async (text: string) => {
  return { isFlagged: false, reason: "SAFE", censoredText: text };
};

export const verifyUKCompany = async (name: string, crn: string) => {
  return { isVerified: true, officialName: name, status: "Active", rejectionReason: null };
};

export const findGoogleBusinessProfile = async (name: string, crn: string) => {
  return { found: false };
};

export const findCompanyDomain = async (name: string, crn: string) => {
  return { domain: null };
};

export const verifyIdentity = async (idBase64: string, selfieBase64: string) => {
  return { verified: true, confidence: 1.0, detectedName: "Showcase User", expiryDate: "2099-01-01", idNumber: "000000", reason: "Showcase Mode", faceMatchScore: 1.0 };
};

export const verifyPropertyDocument = async (docBase64: string, expectedAddress: string) => {
  return { isApproved: true, rejectionReason: null, rejectionDetails: null };
};

export const verifyParkingPhoto = async (photoBase64: string, context: any) => {
  return { isApproved: true, detectedFeatures: [], estimatedCapacity: 1, rejectionReason: null, rejectionDetails: null };
};
