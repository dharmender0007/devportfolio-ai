import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import MinimalTheme from '../components/portfolio/MinimalTheme';
import DarkDeveloperTheme from '../components/portfolio/DarkDeveloperTheme';
import CreativeModernTheme from '../components/portfolio/CreativeModernTheme';

export default function PublicPortfolioPage() {
  const { slug } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/portfolio/${slug}`);
        setPortfolio(data.portfolio);

        // Set SEO meta tags dynamically
        const p = data.portfolio;
        if (p.seo?.title) document.title = p.seo.title;
        else if (p.personalInfo?.name) document.title = `${p.personalInfo.name} – Portfolio`;

        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && p.seo?.description) metaDesc.setAttribute('content', p.seo.description);
      } catch (err) {
        setError(err.response?.data?.error || 'Portfolio not found');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading portfolio…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-center px-6">
        <div>
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold mb-2">Portfolio not found</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <a href="/" className="btn-primary">← Back to Home</a>
        </div>
      </div>
    );
  }

  // Render the correct theme
  const themeMap = {
    'minimal': MinimalTheme,
    'dark-developer': DarkDeveloperTheme,
    'creative-modern': CreativeModernTheme,
  };

  const ThemeComponent = themeMap[portfolio?.theme] || MinimalTheme;
  return <ThemeComponent portfolio={portfolio} />;
}
