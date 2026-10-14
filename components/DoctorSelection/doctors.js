export function clinicTime(now = new Date()) {
    const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23"
    }).formatToParts(now);
    const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
    return { date: `${values.year}-${values.month}-${values.day}`, time: `${values.hour}:${values.minute}` };
}

export function availabilityParams({ medicalId, departmentId } = {}, now = new Date()) {
    const params = { date: clinicTime(now).date, status: 0, limit: 100 };
    if (medicalId != null && medicalId !== "") params.medical_id = medicalId;
    if (departmentId != null && departmentId !== "") params.department_id = departmentId;
    return params;
}

export function parseAvailabilityPage(response) {
    if (response?.status !== "success" || !Array.isArray(response.data)) {
        throw new Error(response?.message || "Unable to load available doctors. Please try again later.");
    }
    return response.data;
}

function hasOpenSlot(record, current) {
    return (record.availability_details || []).some(
        (detail) =>
            detail.availability_date >= current.date &&
            (detail.time_details || []).some((session) => {
                if (Number(session.status) !== 1) return false;
                const futureDate = detail.availability_date > current.date;
                if (Array.isArray(session.appointment_slots)) {
                    return session.appointment_slots.some((slot) => Number(slot.appointment_status) === 0 && (futureDate || slot.start_time >= current.time));
                }
                return Number(session.total_slot) > Number(session.book_slot || 0) && (futureDate || session.end_time > current.time);
            })
    );
}

export function availableDoctors(records, apiUrl, filters = {}, now = new Date()) {
    const doctors = new Map();
    const current = clinicTime(now);
    for (const record of records) {
        if (filters.medicalId != null && String(record.medical_id) !== String(filters.medicalId)) continue;
        if (filters.departmentId != null && String(record.department_id) !== String(filters.departmentId)) continue;
        if (!record.doctor?.name || !hasOpenSlot(record, current)) continue;
        const profile = record.doctor;
        const id = record.doctor_id || profile._id;
        if (!id) continue;
        const existing = doctors.get(id);
        if (existing) {
            existing.availability.push(record);
            continue;
        }
        const details = profile.doctor_details || profile.profetional_details || {};
        const image = String(profile.imageUrl || profile.profile_image || "").replace(/\\/g, "/");
        const relative = image.replace(/^\/+/, "");
        doctors.set(id, {
            id,
            name: profile.name,
            image: !image ? "" : /^https?:\/\//i.test(image) ? image : `${apiUrl.replace(/\/+$/, "")}/${relative.startsWith("uploads/") ? relative : `uploads/users/${relative}`}`,
            specialist: details.specialization || "",
            experience: details.experience_years ?? null,
            qualification: details.qualification || "",
            consultationFee: details.consultation_fee ?? null,
            availability: [record]
        });
    }
    return [...doctors.values()];
}
