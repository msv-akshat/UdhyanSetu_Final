import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function UploadFarmerExcel() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const API_URL = process.env.REACT_APP_API_BASE_URL;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select an Excel file first');
      return;
    }

    const formData = new FormData();
    formData.append("excel", file);

    try {
      setUploading(true);
      const res = await axios.post(`${API_URL}/upload-excel`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      toast.success(res.data.message);
      setFile(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h3>Upload Farmer Excel File</h3>
      <div className="mb-3">
        <input
          type="file"
          accept=".xlsx"
          className="form-control"
          onChange={handleFileChange}
        />
      </div>
      <button
        onClick={handleUpload}
        className="btn btn-primary"
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}

export default UploadFarmerExcel;
