import Hero from "../components/home/Hero";
import Products from "../components/home/Products";
import FeaturedProjects from "../components/home/FeaturedProjects";
import Services from "../components/home/Services";
import "../app/globals.css";

export default function Home() {
  return (
    <>
      <Hero />
      <Products />
      <FeaturedProjects />
      <Services />
    </>
  );
}