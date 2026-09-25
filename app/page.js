import Banner from "../components/Banner/page";
import About from "../components/About/page";
import Services from "../components/Services/page";
import DoctorTalk from "../components/DoctorTalk/page";
import Instrument from "../components/Instrument/page";
import WhyChoose from "../components/WhyChoose/page";
import Team from "../components/Team/page";
import Testimonials from "../components/Testimonials/page";
import AppointmentSteps from "../components/AppointmentSteps/page";
import Insights from "../components/Insights/page";
import HealthFaq from "../components/HealthFaq/page";

export default function Home() {
  return (
    <main>
      <Banner />
      <About />
      <Services />
      <DoctorTalk />
      <Instrument />
      <WhyChoose />
      <Team />
      <Testimonials />
      <AppointmentSteps />
      <Insights />
      <HealthFaq />
    </main>
  );
}
