import ServicesBanner from "../../components/services/ServicesBanner";
import Process from "../../components/services/Process";
import Gallery from "../../components/services/Gallery";
import Faq from "../../components/services/Faq";
import CommonContactEnquiry from "../../components/common/CommonContactEnquiry";
import ServicesTypes from "../../components/services/ServicesTypes";


export default function Services() {
  return (
    <>
      <ServicesBanner />
      <ServicesTypes />
      <Process />
      <Gallery />
      <Faq />
      <CommonContactEnquiry />

    </>
  );
}