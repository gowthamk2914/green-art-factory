import AboutStories from "../../components/about/AboutStories";
import MissionVision from "../../components/about/MissionVision";
import CoreValues from "../../components/about/CoreValues";
import TeamMembers from "../../components/about/TeamMembers";
import WorkshopFacility from "../../components/about/WorkshopFacility";
import Certifications from "../../components/about/Certifications";
import Clients from "../../components/about/Clients";

export default function About() {
  return (
    <>
      <AboutStories />
      <MissionVision />
      <CoreValues />
      <TeamMembers />
      <WorkshopFacility />
      <Certifications />
      <Clients />

    </>
  );
}