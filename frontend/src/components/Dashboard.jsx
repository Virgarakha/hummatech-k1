import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [albums, setAlbums] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const fetchAlbums = async () => {
    try {
      const response = await axios.get('/albums');
      setAlbums(response.data);
    } catch (err) {
      setError('Failed to fetch albums');
    }
  };

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/albums', { title });
      setAlbums([...albums, response.data]);
      setTitle('');
    } catch (err) {
      setError('Failed to create album');
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">Albums</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleCreateAlbum} className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Album title"
            className="p-2 border rounded mr-2"
            required
          />
          <button type="submit" className="bg-red-600 text-white p-2 rounded">Create Album</button>
        </div>
      </form>
      <div className="grid grid-cols-3 gap-4">
        {albums.map((album) => (
          <Link
            key={album.id}
            to={`/album/${album.id}`}
            className="p-4 bg-white rounded-lg shadow hover:bg-gray-100"
          >
            <h3 className="text-lg font-semibold">{album.title}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;