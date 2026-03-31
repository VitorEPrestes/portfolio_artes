import { lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HoldToExplore from "./components/HoldToExplore";

const Showcase = lazy(() => import("./components/Showcase"));
const Gallery = lazy(() => import("./components/Gallery"));
const Pricing = lazy(() => import("./components/Pricing"));
const Terms = lazy(() => import("./components/Terms"));
const Discord = lazy(() => import("./components/Discord"));
const Footer = lazy(() => import("./components/Footer"));

export default function App() {
  return (
    <>
      <a href="#showcase" className="skip-link">
        Pular para o conteúdo
      </a>
      <div className="scanlines" />
      <Navbar />
      <main>
        <Hero />
        <Suspense fallback={null}>
          <div className="section-sep" />
          <Showcase />
          <div className="section-sep section-sep--alt" />
          <Gallery />
          <div className="section-sep" />
          <Pricing />
          <div className="section-sep section-sep--alt" />
          <Terms />
          <div className="section-sep" />
          <section className="section texture-noise" id="construction">
            <div className="container">
              <HoldToExplore />
            </div>
          </section>
          <div className="section-sep section-sep--alt" />
          <Discord />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
}
