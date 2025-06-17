// Downloads.js
import { useState } from 'react';
import { cropList, mandalVillageMap } from '../data/dropDownData'; // adjust path
import axios from 'axios';

function Downloads() {
  const [mandal, setMandal] = useState('');
  const [village, setVillage] = useState('');
  const [crop, setCrop] = useState('');
  const [totalArea, setTotalArea] = useState(null);
  const [countFarmers, setCountFarmers] = useState(null);

  const API_URL = process.env.REACT_APP_API_BASE_URL;

  const mandals = Object.keys(mandalVillageMap);
  const villages = mandal ? mandalVillageMap[mandal] : [];

  const handleDownload = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/download`,
        { mandal, village, crop },
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      // ✅ Generate timestamped filename on frontend
      const timestamp = new Date().toISOString().replace(/T/, '_').replace(/:/g, '-').split('.')[0];
      const filename = `Farmers_${mandal}_${village}_${crop}_${timestamp}.xlsx`;

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename); // force filename here
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // cleanup
      window.URL.revokeObjectURL(url); // free memory
    } catch (err) {
      console.error('Download failed', err);
      alert('Something went wrong. Please try again.');
    }
  };

  const handleGetTotalArea = async () => {
    try {
      const response = await axios.post(`${API_URL}/totalarea`, {
        mandal, village, crop
      });
      const fetchedArea = response.data.totalArea || 0;
      const fetchedCount = response.data.countFarmers || 0;
      setTotalArea(fetchedArea);
      setCountFarmers(fetchedCount);
      console.log(fetchedArea, fetchedCount);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch total area.');
    }
  };

  return (
    <div className="p-4">
      <h3 className="mb-3">Download Farmer Data</h3>
      <div className="form-group mb-2">
        <label>Mandal</label>
        <select className="form-control" value={mandal} onChange={e => {
          setMandal(e.target.value);
          setVillage('');
          setCrop('');
        }}>
          <option value="">-- Select Mandal --</option>
          {mandals.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div className="form-group mb-2">
        <label>Village</label>
        <select className="form-control" value={village} onChange={e => {
          setVillage(e.target.value);
          setCrop('');
        }} disabled={!mandal}>
          <option value="">-- Select Village --</option>
          {villages.map(v => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </div>

      <div className="form-group mb-3">
        <label>Crop</label>
        <select className="form-control" value={crop} onChange={e => setCrop(e.target.value)}>
          <option value="">-- Select Crop --</option>
          {cropList.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="d-flex gap-3 mb-3">
        <button className="btn btn-success" onClick={handleDownload} disabled={!mandal && !village && !crop}>
          Download Excel
        </button>
        <button className="btn btn-info" onClick={handleGetTotalArea} disabled={!mandal && !village && !crop}>
          Get Total Area
        </button>
      </div>

      {totalArea !== null && (
        <div className="alert alert-primary">
          Total Area for selected data: <strong>{totalArea}</strong> {totalArea === 1 ? 'hectare' : 'hectares'}
        </div>
      )}
      {countFarmers !== null && (
        <div className="alert alert-secondary">
          Total number of Farmers in selected data: <strong>{countFarmers}</strong>
        </div>
      )}
    </div>
  );
}

export default Downloads;