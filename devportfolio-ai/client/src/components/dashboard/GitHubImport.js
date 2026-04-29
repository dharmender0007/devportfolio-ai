import React, { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import usePortfolioStore from '../../hooks/usePortfolioStore';

export default function GitHubImport({ onDone }) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const { fetchPortfolio } = usePortfolioStore();

  const handlePreview = async () => {
    if (!username.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/github/user/${username.trim()}`);
      setPreview(data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'GitHub user not found');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/github/import', { username: username.trim() });
      await fetchPortfolio();
      toast.success(`✅ Imported ${data.projectsImported} projects from GitHub!`);
      onDone();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Import failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Import from GitHub</h2>
      <p className="text-gray-400 text-sm mb-6">
        Enter your GitHub username to fetch your repositories, stars, and profile.
      </p>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          className="input-field"
          placeholder="e.g. torvalds"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handlePreview()}
        />
        <button onClick={handlePreview} disabled={loading || !username.trim()} className="btn-secondary whitespace-nowrap">
          {loading ? '…' : 'Preview'}
        </button>
      </div>

      {preview && (
        <div className="bg-gray-800 rounded-xl p-5 mb-6 flex items-start gap-4">
          <img src={preview.avatar_url} alt={preview.login} className="w-14 h-14 rounded-full" />
          <div className="flex-1">
            <div className="font-semibold text-lg">{preview.name || preview.login}</div>
            <div className="text-gray-400 text-sm mb-2">{preview.bio}</div>
            <div className="flex gap-4 text-sm text-gray-400">
              <span>📦 {preview.public_repos} repos</span>
              <span>👥 {preview.followers} followers</span>
              {preview.location && <span>📍 {preview.location}</span>}
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        {preview && (
          <button onClick={handleImport} disabled={loading} className="btn-primary">
            {loading ? 'Importing…' : '⚡ Import to Portfolio'}
          </button>
        )}
        <button onClick={onDone} className="btn-ghost text-gray-400">
          Skip for now →
        </button>
      </div>
    </div>
  );
}
