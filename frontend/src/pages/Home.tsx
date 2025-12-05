
import AcercaDe from "../components/AcercaDe";
import ComoFunciona from "../components/ComoFunciona";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import SearchForm from "../components/SearchForm";
import ServicesSection from "../components/ServicesSection";
import UneteTecnico from "../components/UneteTecnico";
import TechnicianDashboard from "./TechnicianDashboard/TechnicianDashboard";

const Home = () => {
  return (
    <>
      <Header />
      <Hero />
      <SearchForm />
      <main className="home-main">
        <ServicesSection />
      </main>
      <ComoFunciona />
      <AcercaDe />

      <FAQ />
      <UneteTecnico />

    </>
  );
};

export default Home;
