export function isProfileComplete(user) {
  if (!user || Number(user.user_role ?? user.role) !== 4 || Number(user.verification_status) !== 1) return false;
  const fields = [user.name, user.email, user.gender, user.country, user.state, user.city, user.location ?? user.locality, user.zipcode, user.profile_image ?? user.profile_picture];
  return fields.every((value) => value != null && String(value).trim() !== "") && Array.isArray(user.documents) && user.documents.some((document) => document?.file || document?.fileUrl);
}

export function parseUserProfile(response) {
  if (response?.status !== "success" || !response.data || typeof response.data !== "object" || Array.isArray(response.data)) {
    throw new Error(response?.message || "Unable to load your profile. Please try again.");
  }
  return response.data;
}
