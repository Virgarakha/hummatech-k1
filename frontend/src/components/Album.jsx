import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Album() {
  const { albumId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const fetchPhotos = async () => {
    try {
      const response = await axios.get(`/albums/${albumId}`);
      setPhotos(response.data.photos);
      console.log(response.data.photos);
    } catch (err) {
      setError('Failed to fetch photos');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('album_id', albumId);
    formData.append('date', new Date().toISOString().split('T')[0]);

    try {
      const response = await axios.post('/photos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPhotos([...photos, response.data]);
      setFile(null);
    } catch (err) {
      setError('Failed to upload photo');
    }
  };

  const handleFavorite = async (photoId) => {
    try {
      await axios.post(`/photos/${photoId}/favorite`);
      fetchPhotos();
    } catch (err) {
      setError('Failed to favorite photo');
    }
  };

  const handleTrash = async (photoId) => {
    try {
      await axios.post(`/photos/${photoId}/trash`);
      setPhotos(photos.filter((photo) => photo.id !== photoId));
    } catch (err) {
      setError('Failed to move to trash');
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [albumId]);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">Album Photos</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleUpload} className="mb-6">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-2"
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">Upload Photo</button>
      </form>
      <div className="grid grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="relative p-4 bg-white rounded-lg shadow">
            <img
              src={`http://localhost:8000/storage/${photo.photo}`}
              alt="Photo"
              className="w-full h-48 object-cover rounded"
            />
            <div className="mt-2 flex justify-between">
              <button
                onClick={() => handleFavorite(photo.id)}
                className={`p-2 rounded ${photo.is_favorited ? 'bg-yellow-400' : 'bg-gray-200'}`}
              >
                Favorite
              </button>
              <button
                onClick={() => handleTrash(photo.id)}
                className="p-2 bg-red-500 text-white rounded"
              >
                Trash
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Album;