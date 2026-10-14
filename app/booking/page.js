import BookingBanner from "../../components/BookingBanner/page";
import BookingAccess from "./BookingAccess";
import ClinicSelection from "../../components/ClinicSelection/ClinicSelection";
import { Suspense } from "react";

export const metadata = { title: "Book Appointment" };

export default function BookingPage() {
    return (
        <main>
            <BookingAccess>
                <BookingBanner />
                <Suspense fallback={null}><ClinicSelection /></Suspense>
            </BookingAccess>
        </main>
    );
}
