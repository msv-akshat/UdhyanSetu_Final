import farm_tech from "../assets/farm_tech.png"
import { useEffect } from "react";

function About(props) {
  useEffect(() => {
		document.title = "UdhyanSetu - "+props.title;
	},[props.title])

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-success">About UdhyanSetu</h1>
        <p className="lead text-muted">
          Bridging technology and horticulture for a better tomorrow.
        </p>
      </div>

      <div className="row align-items-center mb-5">
        <div className="col-md-6">
          <img
            src={farm_tech}
            alt="Smart farming"
            className="img-fluid rounded shadow"
          />
        </div>
        <div className="col-md-6">
          <h2 className="fw-semibold">What is UdhyanSetu?</h2>
          <p className="text-muted">
            UdhyanSetu is a digital platform designed to streamline horticultural data collection and
            improve accessibility. Our goal is to empower government employees and farmers through
            intuitive tools that help register, track, and analyze crop and village-level insights.
          </p>
        </div>
      </div>

      <div className="row text-center">
        <div className="col-md-4 mb-4">
          <div className="border rounded p-4 h-100 shadow-sm">
            <h4 className="text-success">Farmer Registration</h4>
            <p className="text-muted">
              Simple forms allow quick farmer onboarding, with support for crop and village tracking.
            </p>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="border rounded p-4 h-100 shadow-sm">
            <h4 className="text-success">Smart Filtering</h4>
            <p className="text-muted">
              Government employees can search, filter, and download data by mandal, village, and crop.
            </p>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="border rounded p-4 h-100 shadow-sm">
            <h4 className="text-success">Data Export</h4>
            <p className="text-muted">
              Easily export farmer details as Excel files for offline use and reporting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
