"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { getProjectDetailRequest } from "../../../redux/ProjectDetail/actions";
import ProjectDetailBanner from "../../../components/projectDetail/ProjectDetailBanner"; // adjust to your actual path
import ProjectDetailStats from "../../../components/projectDetail/ProjectDetailStats"; // adjust to your actual path
import ProjectDetailGallery from "../../../components/projectDetail/ProjectDetailGallery";
import ProjectDetailDesignApproach from "../../../components/projectDetail/ProjectDetailDesignApproach";
import ProjectDetailProcess from "../../../components/projectDetail/ProjectDetailProcess";
import ProjectDetailKeyHighlights from "../../../components/projectDetail/ProjectDetailKeyHighlights";
import ProjectDetailWhyChooseUs from "../../../components/projectDetail/ProjectDetailWhyChooseUs";
import ProjectDetailRelatedProjects from "../../../components/projectDetail/ProjectDetailRelatedProjects";
import CommonContactEnquiry from "../../../components/common/CommonContactEnquiry";



export default function ProjectDetailPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();

  // `ProjectDetail` must match the key used in your rootReducer
  const { data, loading, error } = useSelector((state) => state.ProjectDetail);

  useEffect(() => {
    if (slug) dispatch(getProjectDetailRequest(slug));
  }, [slug, dispatch]);

  if (loading && !data) {
    return <p className="projectDetailStatus">Loading project…</p>;
  }

  if (error && !data) {
    return <p className="projectDetailStatus">We couldn't load this project. {error}</p>;
  }

  if (!data) return null;

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