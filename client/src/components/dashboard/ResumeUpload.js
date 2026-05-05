import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import usePortfolioStore from '../../hooks/usePortfolioStore';

export default function ResumeUpload({ onDone }) {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const { fetchPortfolio } = usePortfolioStore();

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are accepted');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const { data } = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(data.extracted);
      await fetchPortfolio();
      toast.success('✅ Resume parsed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Upload Your Resume</h2>
      <p className="text-gray-400 text-sm mb-6">
        We'll automatically extract your skills, experience, and education from your PDF.
      </p>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors mb-6
          ${isDragActive ? 'border-sky-500 bg-sky-500/5' : 'border-gray-700 hover:border-gray-600'}`}
      >
        <input {...getInputProps()} />
        <div className="text-4xl mb-3">{uploading ? '⏳' : '📄'}</div>
        {uploading ? (
          <p className="text-gray-400">Parsing your resume…</p>
        ) : isDragActive ? (
          <p className="text-sky-400">Drop your PDF here!</p>
        ) : (
          <>
            <p className="font-medium mb-1">Drag & drop your resume here</p>
            <p className="text-gray-400 text-sm">or click to browse · PDF only · max 5MB</p>
          </>
        )}
      </div>

      {result && (
        <div className="bg-gray-800 rounded-xl p-5 mb-6 space-y-4">
          <h3 className="font-semibold text-green-400">✅ Extracted from your resume:</h3>

          {/* Skills */}
          {result.skills?.length > 0 && (
            <div>
              <p className="text-sm text-gray-400 mb-2">Skills detected ({result.skills.length}):</p>
              <div className="flex flex-wrap gap-2">
                {result.skills.map((s) => (
                  <span key={s} className="px-2 py-1 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-full text-xs">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {result.experience?.length > 0 && (
            <div>
              <p className="text-sm text-gray-400 mb-2">Experience found:</p>
              <ul className="text-sm text-gray-300 space-y-1">
                {result.experience.map((exp, i) => {
                  // Handle both object and string formats safely
                  const label = typeof exp === 'string'
                    ? exp
                    : (exp.role || exp.company || 'Experience entry');
                  return <li key={i} className="truncate">• {label}</li>;
                })}
              </ul>
            </div>
          )}

          {/* Education */}
          {result.education?.length > 0 && (
            <div>
              <p className="text-sm text-gray-400 mb-2">Education found:</p>
              <ul className="text-sm text-gray-300 space-y-1">
                {result.education.map((edu, i) => {
                  // Handle both object and string formats safely
                  const label = typeof edu === 'string'
                    ? edu
                    : (edu.institution || edu.degree || 'Education entry');
                  return <li key={i} className="truncate">• {label}</li>;
                })}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3">
        {result && (
          <button onClick={onDone} className="btn-primary">Next: AI Content →</button>
        )}
        <button onClick={onDone} className="btn-ghost text-gray-400">Skip for now →</button>
      </div>
    </div>
  );
}