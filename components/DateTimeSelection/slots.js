import { clinicTime } from "../DoctorSelection/doctors";

export function doctorSchedule(records, { doctorId, medicalId, departmentId }, now = new Date()) {
    const current = clinicTime(now);
    const dates = {};
    for (const record of records) {
        if (String(record.doctor_id) !== String(doctorId)) continue;
        if (medicalId != null && String(record.medical_id) !== String(medicalId)) continue;
        if (departmentId != null && String(record.department_id) !== String(departmentId)) continue;
        const details = record.availability_details || [record];
        for (const detail of details) {
            const date = detail.availability_date;
            if (!date || date < current.date) continue;
            for (const session of detail.time_details || []) {
                if (Number(session.status) !== 1) continue;
                for (const slot of session.appointment_slots || []) {
                    if (!slot.start_time || !slot.end_time) continue;
                    if (date === current.date && slot.start_time.slice(0, 5) <= current.time) continue;
                    const id = `${record._id}:${date}:${slot.start_time}:${slot.end_time}`;
                    const value = {
                        id,
                        availabilityId: record._id,
                        doctorId: record.doctor_id,
                        medicalId: record.medical_id,
                        departmentId: record.department_id,
                        date,
                        startTime: slot.start_time,
                        endTime: slot.end_time,
                        booked: slot.appointment_status == null || Number(slot.appointment_status) !== 0
                    };
                    dates[date] ||= [];
                    if (!dates[date].some((item) => item.id === id)) dates[date].push(value);
                }
            }
        }
    }
    for (const slots of Object.values(dates)) slots.sort((a, b) => a.startTime.localeCompare(b.startTime));
    return dates;
}

export function displayTime(time) {
    const [hour, minute] = time.split(":").map(Number);
    return `${String(hour % 12 || 12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
}

export function calendarDays(month) {
    const [year, monthNumber] = month.split("-").map(Number);
    const first = new Date(year, monthNumber - 1, 1);
    const count = Math.ceil((first.getDay() + new Date(year, monthNumber, 0).getDate()) / 7) * 7;
    return Array.from({ length: count }, (_, index) => {
        const day = new Date(year, monthNumber - 1, index - first.getDay() + 1);
        return {
            date: `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`,
            day: day.getDate(),
            inMonth: day.getMonth() === monthNumber - 1
        };
    });
}
