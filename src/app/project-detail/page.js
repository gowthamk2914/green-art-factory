import ProjectDetailBanner from "../../components/projectDetail/ProjectDetailBanner";
import ProjectDetailDesignApproach from "../../components/projectDetail/ProjectDetailDesignApproach";
import ProjectDetailGallery from "../../components/projectDetail/ProjectDetailGallery";
import ProjectDetailKeyHighlights from "../../components/projectDetail/ProjectDetailKeyHighlights";
import ProjectDetailProcess from "../../components/projectDetail/ProjectDetailProcess";
import ProjectDetailStats from "../../components/projectDetail/ProjectDetailStats";
import ProjectDetailWhyChooseUs from "../../components/projectDetail/ProjectDetailWhyChooseUs";
import CommonContactEnquiry from "../../components/common/CommonContactEnquiry";
import ProjectDetailRelatedProjects from "../../components/projectDetail/ProjectDetailRelatedProjects";

export default function Categories() {
  return (
    <>
      <ProjectDetailBanner />
      <ProjectDetailStats />
      <ProjectDetailGallery />
      <ProjectDetailDesignApproach />
      <ProjectDetailProcess />
      <ProjectDetailKeyHighlights />
      <ProjectDetailWhyChooseUs />
      <ProjectDetailRelatedProjects />
      <CommonContactEnquiry />
      

    </>
  );
}