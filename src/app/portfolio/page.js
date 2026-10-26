"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPortfolioPageRequest } from "../../redux/Portfolio/actions";
import PortfolioBanner from "../../components/portfolio/PortfolioBanner";
import ProjectsListing from "../../components/portfolio/ProjectsListing";
import { Suspense } from "react";


export default function PortfolioPage() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.Portfolio ?? {});

  useEffect(() => {
    dispatch(getPortfolioPageRequest());
  }, [dispatch]);


  if (loading && !data) {
    return <p className="portfolioPageStatus">Loading…</p>;
  }

  if (error) {
    return <p className="portfolioPageStatus">{error}</p>;
  }

  return (
    <>
      <PortfolioBanner />
      <Suspense fallback={null}>
        <ProjectsListing />
      </Suspense>
    </>
  );
}