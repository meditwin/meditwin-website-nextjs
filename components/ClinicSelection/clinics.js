export const MEDICAL_API_URL = (process.env.NEXT_PUBLIC_API_URL || "https://api.carencurewellness.com").replace(/\/+$/, "");

function imageUrl(medical, apiUrl) {
    const image = medical.imageUrl || medical.image;
    if (!image) return "";
    const path = String(image).replace(/\\/g, "/");
    if (/^https?:\/\//i.test(path)) return path;
    const relative = path.replace(/^\/+/, "");
    return `${apiUrl}/${relative.startsWith("uploads/") ? relative : `uploads/medical/${relative}`}`;
}

export function parseMedicalClinics(response, apiUrl = MEDICAL_API_URL) {
    if (response?.status !== "success" || !Array.isArray(response.data)) {
        throw new Error(response?.message || "Unable to load clinics. Please try again later.");
    }
    return response.data.map((medical) => ({
        ...medical,
        id: medical.id ?? medical._id ?? medical.slug,
        name: medical.name || "",
        mobile: medical.mobile == null ? "" : String(medical.mobile),
        image: imageUrl(medical, apiUrl)
    }));
}
