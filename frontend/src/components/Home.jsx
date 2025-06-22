import { Link } from 'react-router-dom';
import bg from '../assets/bg.png'
import { useEffect } from 'react';

function Home(props) {
	useEffect(() => {
		document.title = "UdhyanSetu - "+props.title;
	},[props.title])

	return (
		<div className="bg-light min-vh-100 d-flex flex-column">
			{/* Hero Section */}
			<div
				className="position-relative container-fluid text-white d-flex align-items-center justify-content-center"
				style={{ minHeight: '70vh', overflow: 'hidden' }}
			>
				<div
					className="position-absolute top-0 start-0 w-100 h-100"
					style={{
						backgroundImage: `url(${bg})`,
						backgroundSize: 'cover',
						backgroundPosition: 'center',
						filter: 'brightness(40%)',
						zIndex: 1,
					}}
				></div>
				<div className="container text-center p-5 rounded" style={{ zIndex: 2 }}>
					<h6 className="display-6 fw-bold text-white">Welcome to</h6>
					<h1 className="display-2 fw-bold text-white">UdhyanSetu</h1>
					<p className="lead text-white">
						Empowering horticulture with smart data solutions.
					</p>
					<div className="mt-4">
						<Link to="/register" className="btn btn-warning btn-lg me-3">
							Register Farmer
						</Link>
						<Link to="/login" className="btn btn-outline-light btn-lg">
							User Login
						</Link>
					</div>
				</div>
			</div>

			{/* Features Section */}
			<div className="container py-5">
				<div className="row text-center">
					<div className="col-md-4 mb-4">
						<i className="bi bi-person-lines-fill display-4 text-success"></i>
						<h4 className="mt-3">Easy Farmer Registration</h4>
						<p>Quickly register and manage farmer profiles with location-wise tracking.</p>
					</div>
					<div className="col-md-4 mb-4">
						<i className="bi bi-graph-up-arrow display-4 text-success"></i>
						<h4 className="mt-3">Crop Data Insights</h4>
						<p>Track crops by mandal and village, and analyze trends with ease.</p>
					</div>
					<div className="col-md-4 mb-4">
						<i className="bi bi-cloud-download-fill display-4 text-success"></i>
						<h4 className="mt-3">Export Reports</h4>
						<p>Download farmer data as Excel files for reporting and analysis.</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Home;