"use client"; // This is a client component
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'


const UploadForm = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    // Initialize Supabase client
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            alert('Please select a file first!');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file[]', file);

            const response = await fetch('http://127.0.0.1:5000/upload-documents', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'File upload failed');
            }
            // Then, upload to Supabase
            const { error: supabaseError } = await supabase.storage
                .from('email-user-uploads')
                .upload(`private/${file.name}`, file);

            if (supabaseError) {
                throw supabaseError;
            }
            alert('File uploaded successfully');
        } catch (error) {
            console.error('Upload error:', error);
            alert(`Upload error: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileChange} />
            <button type="submit" disabled={uploading || !file}>
                {uploading ? 'Uploading...' : 'Upload'}
            </button>
        </form>
    );
};

export default UploadForm;
