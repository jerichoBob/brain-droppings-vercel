'use client';

import { useState } from 'react';
import { handleEnexFile } from '@/lib/enex-converter';

export default function EnexImporter() {
    const [isImporting, setIsImporting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsImporting(true);
        setError(null);

        try {
            // First, process the file locally
            const exportInfo = await handleEnexFile(file);

            // Then send to the API
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/import', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to import notes');
            }

            const result = await response.json();
            console.log('Import successful:', result);
            
            // You might want to trigger a refresh of your notes list here
            // or update your application state
            
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to import file');
            console.error('Import error:', err);
        } finally {
            setIsImporting(false);
        }
    };

    return (
        <div className="p-4">
            <label className="block mb-4">
                <span className="text-gray-700">Import Evernote Export (.enex)</span>
                <input
                    type="file"
                    accept=".enex"
                    onChange={handleFileSelect}
                    disabled={isImporting}
                    className="block w-full mt-1 text-sm"
                />
            </label>

            {isImporting && (
                <div className="text-blue-600">
                    Importing your notes...
                </div>
            )}

            {error && (
                <div className="text-red-600">
                    {error}
                </div>
            )}
        </div>
    );
}
