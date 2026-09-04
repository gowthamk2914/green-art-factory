"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPortfolioPageRequest } from "../../redux/Portfolio/actions";
import PortfolioBanner from "../../components/portfolio/PortfolioBanner";
import ProjectsListing from "../../components/portfolio/ProjectsListing";

export default function PortfolioPage() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.Portfolio ?? {});

  useEffect(() => {
    dispatch(getPortfolioPageRequest());
  }, [dispatch]);

  // TEMPORARY debug line — remove once projects are confirmed showing.
  // Check your browser console: if this never logs anything besides the
  // very first { loading: true, hasData: false }, the saga isn't running
  // (rootSaga.js is missing the PortfolioPageSaga fork). If it logs an
  // error, the request reached the API but failed (check the Network tab
  // for the actual response/status). If it logs hasData: true with
  // projectsCount: 0, the API itself returned an empty projects array.
  useEffect(() => {
    console.log("[PortfolioPage]", {
      loading,
      error,
      hasData: !!data,
      projectsCount: data?.projects?.length,
    });
  }, [loading, error, data]);

  if (loading && !data) {
    return <p className="portfolioPageStatus">Loading…</p>;
  }

  if (error) {
    return <p className="portfolioPageStatus">{error}</p>;
  }

  return (
    <>
      <PortfolioBanner />
      <ProjectsListing />
    </>
  );
}