export function parseDepartments(response, apiUrl) {
    if (response?.status !== "success" || !Array.isArray(response.data)) {
        throw new Error(response?.message || "Unable to load specialties. Please try again later.");
    }
    return response.data.map((department) => {
        const image = String(department.imageUrl || department.image || "").replace(/\\/g, "/");
        const relative = image.replace(/^\/+/, "");
        return {
            ...department,
            id: department.id ?? department._id ?? department.slug,
            name: department.name || "",
            description: department.description || "",
            image: !image
                ? ""
                : /^https?:\/\//i.test(image)
                  ? image
                  : `${apiUrl.replace(/\/+$/, "")}/${relative.startsWith("uploads/") ? relative : `uploads/department/${relative}`}`
        };
    });
}
