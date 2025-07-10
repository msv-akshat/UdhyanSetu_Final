import { useState, useEffect } from 'react';
import axios from 'axios';
import { mandalVillageMap, cropList } from '../data/dropDownData';
import bg from "../assets/loginbg.png"

function Register(props) {
  useEffect(() => {
    document.title = "UdhyanSetu - " + props.title;
  }, [props.title])

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    mandal: '',
    village: '',
    crop: '',
    area: '',
  });
  const [hover, setHover] = useState(false);
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const villagesFromMandal = formData.mandal ? mandalVillageMap[formData.mandal] || [] : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Here you'd typically send the formData to your backend
    console.log('Registering:', formData);
    try {
      const cleanArea = parseFloat(formData.area).toFixed(2);

      const res = await axios.post(`${API_URL}/register`, {
        name: formData.name,
        phone: formData.phone,
        mandal: formData.mandal,
        village: formData.village,
        crop: formData.crop,
        area: cleanArea,
      });
      if (res.data.success) {
        alert("Registration successful!");
      }
    }
    catch (error) {
      if (error.response?.status === 400) {
        alert("Registration failed: " + error.response.data.error);
      } else {
        console.error("An error occurred during registration:", error);
        alert("An unexpected error occurred. Please try again later.");
      }
    }
    // Reset form
    setFormData({
      name: '',
      phone: '',
      village: '',
      crop: '',
      area: '',
    });
  };

  return (
    <div className="position-relative d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 0 }}
      ></div>
      <div
        className="container rounded shadow position-relative"
        style={{
          padding: '4rem',
          width: '100%',
          maxWidth: '600px',
          backgroundColor: 'rgba(97, 220, 115, 0.15)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )',
          zIndex: 1,
          color: 'white',
        }}
      >
        <h2 className="mb-5 mt-1 text-center fw-bold text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
          Farmer Registration
        </h2>

        <form className="form-horizontal" onSubmit={handleSubmit}>

          <div className="mb-4 row">
            <label htmlFor="name" className="col-sm-3 col-form-label">Name</label>
            <div className="col-sm-9">
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                autoComplete="off"
                required
              />
            </div>
          </div>

          <div className="mb-4 row">
            <label htmlFor="phone" className="col-sm-3 col-form-label">Phone no:</label>
            <div className="col-sm-9">
              <input
                type="text"
                className="form-control"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your Phone number"
                autoComplete="off"
                required
              />
            </div>
          </div>

          <div className="mb-4 row">
            <label htmlFor="mandal" className="col-sm-3 col-form-label">Mandal</label>
            <div className="col-sm-9">
              <select
                className="form-select"
                id="mandal"
                name="mandal"
                value={formData.mandal}
                onChange={handleChange}
                required
              >
                <option value="">Select your mandal</option>
                {Object.keys(mandalVillageMap).map((mandal) => (
                  <option key={mandal} value={mandal}>{mandal}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4 row">
            <label htmlFor="village" className="col-sm-3 col-form-label">Village</label>
            <div className="col-sm-9">
              <select
                className="form-select"
                id="village"
                name="village"
                value={formData.village}
                onChange={handleChange}
                required
              >
                <option value="">Select your village</option>
                {villagesFromMandal.map((village) => (
                  <option key={village} value={village}>{village}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4 row">
            <label htmlFor="crop" className="col-sm-3 col-form-label">Crop</label>
            <div className="col-sm-9">
              <select
                className="form-select"
                id="crop"
                name="crop"
                value={formData.crop}
                onChange={handleChange}
                required
              >
                <option value="">Select a crop</option>
                {cropList.map((crop) => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4 row">
            <label htmlFor="area" className="col-sm-3 col-form-label">Area (Ha)</label>
            <div className="col-sm-9">
              <input
                type="text"
                className="form-control"
                id="area"
                name="area"
                value={formData.area}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only valid decimal numbers with up to 2 decimal places and no leading zeros
                  if (/^(0|[1-9]\d*)(\.\d{0,2})?$/.test(value) || value === '') {
                    setFormData({
                      ...formData,
                      area: value,
                    });
                  }
                }}
                placeholder="e.g. 1.25"
                autoComplete="off"
                required
              />
            </div>
          </div>

          <div className="mt-4 mb-0 d-flex justify-content-center">
            <button
              type="submit"
              className="btn px-5"
              style={{
                backgroundColor: hover ? "#f05328" : "#f6653c",
                boxShadow: hover ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
                color: hover ? 'black' : 'white',
                border: 'none',
                transition: '0.3s ease'
              }}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;