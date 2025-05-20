import { useState, useEffect } from 'react';
import axios from 'axios';

function Trash() {
  const [trashedPhotos, setTrashedPhotos] = useState([]);
  const [error, setError] = useState('');

  const fetchTrashedPhotos = async () => {
    try {
      const response = await axios.get('/photos', {
        params: { trashed: true },
      });
      setTrashedPhotos(response.data);
    } catch (err) {
      setError('Failed to fetch trashed photos');
    }
  };

  const handleDelete = async (photoId) => {
    try {
      await axios.delete(`/photos/${photoId}/trash`);
      setTrashedPhotos(trashedPhotos.filter((photo) => photo.id !== photoId));
    } catch (err) {
      setError('Failed to delete photo');
    }
  };

  useEffect(() => {
    fetchTrashedPhotos();
  }, []);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">Trash</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-3 gap-4">
        {trashedPhotos.map((photo) => (
          <div key={photo.id} className="p-4 bg-white rounded-lg shadow">
            <img
              src={`http://localhost:8000/storage/${photo.photo}`}
              alt="Trashed Photo"
              className="w-full h-48 object-cover rounded"
            />
            <button
              onClick={() => handleDelete(photo.id)}
              className="mt-2 w-full bg-red-600 text-white p-2 rounded"
            >
              Delete Permanently
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Trash;