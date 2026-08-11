'use client';

import { useState } from 'react';

export default function MergePDFPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setDownloadUrl(null);
      setError(null);
    }
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('कृपया कम्तिमा २ वटा PDF फाइलहरू छान्नुहोस्।');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('http://localhost:5000/api/merge-pdf', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setDownloadUrl(data.downloadUrl);
      } else {
        setError(data.error || 'Merge गर्न असफल भयो।');
      }
    } catch (err) {
      console.error(err);
      error handling
      setError('Server सँग जडान हुन सकेन। Backend चलिरहेको छ कि छैन जाँच गर्नुहोस्।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Merge PDF</h1>
        <p className="text-gray-600 mb-6">धेरै वटा PDF फाइलहरूलाई एउटै फाइलमा जोड्नुहोस्।</p>

        <div className="mb-4">
          <input
            type="file"
            accept="pdf"
            multiple
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {files.length > 0 && (
          <div className="mb-4 text-sm text-gray-700">
            <p className="font-semibold">छानिएका फाइलहरू ({files.length}):</p>
            <ul className="list-disc pl-5">
              {files.map((file, idx) => (
                <li key={idx}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}

        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

        <button
          onClick={handleMerge}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'मर्ज हुँदैछ...' : 'PDF मर्ज गर्नुहोस्'}
        </button>

        {downloadUrl && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-green-700 font-semibold mb-2">तपाईंको PDF सफलतापूर्वक मर्ज भयो!</p>
            <a
              href={downloadUrl}
              download
              className="inline-block bg-green-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-700"
            >
              फाइल डाउनलोड गर्नुहोस्
            </a>
          </div>
        )}
      </div>
    </div>
  );
}