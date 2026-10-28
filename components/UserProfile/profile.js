import axios from "axios";

export const PROFILE_API_URL = (process.env.NEXT_PUBLIC_API_URL || "https://api.carencurewellness.com").replace(/\/+$/, "");

export function profileValues(user) {
    return {
        name: user?.name || "",
        gender: String(user?.gender || "").toLowerCase(),
        country: String(user?.country ?? ""),
        state: String(user?.state ?? ""),
        city: String(user?.city ?? ""),
        zipcode: user?.zipcode || "",
        location: user?.location || user?.locality || ""
    };
}

export function profileAssetUrl(value, folder = "uploads/users") {
    if (!value) return "";
    const path = String(value).replace(/\\/g, "/");
    if (/^https?:\/\//i.test(path)) return path;
    const relative = path.replace(/^\/+/, "");
    return `${PROFILE_API_URL}/${relative.startsWith("uploads/") ? relative : `${folder}/${relative}`}`;
}

export async function saveProfile({ values, photo, document, token }) {
    if (!token) throw new Error("Please log in to edit your profile.");
    // Only editable profile fields are sent. Email, mobile and account flags stay untouched.
    const payload = Object.fromEntries(Object.keys(profileValues()).map((key) => [key, String(values[key] ?? "").trim()]));
    if (Object.values(payload).some((value) => !value)) throw new Error("Please fill in all required profile fields.");
    if (document) payload.documents = [{ name: "Profile Document", file: null }];
    const form = new FormData();
    form.append("user_data", JSON.stringify(payload));
    if (photo) form.append("profile_image", photo);
    if (document) form.append("documents", document);
    const { data } = await axios.put(`${PROFILE_API_URL}/users`, form, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 60000
    });
    if (data?.status !== "success") throw new Error(data?.message || data?.error || "Unable to save your profile.");
    return data;
}
