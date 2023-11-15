"use client"; // This is a client component
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
// import { cookies } from 'next/headers'


const UploadForm = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    // Initialize Supabase client
    // const cookieStore = cookies()
    // const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) {
            alert('Please select a file first!');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file[]', file);

            const response = await fetch('https://email-ai-service-kl7byg23kq-uc.a.run.app/upload-documents', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                let errorMsg = 'File upload failed'; // Default error message
                if (result && typeof result === 'object' && 'error' in result) {
                    // Check if result is an object and has an 'error' property
                    const error = result.error;
                    if (typeof error === 'string') {
                        // If the error is a string, use it as the error message
                        errorMsg = error;
                    }
                }
                throw new Error(errorMsg);
            }
            // // Then, upload to Supabase
            // const { error: supabaseError } = await supabase.storage
            //     .from('email-user-uploads')
            //     .upload(`private/${file.name}`, file);

            // if (supabaseError) {
            //     throw supabaseError;
            // }
            alert('File uploaded successfully');
        } catch (error) {
            if (error instanceof Error) {
                console.error('Upload error:', error);
                alert(`Upload error: ${error.message}`);
            } else {
                // Handle the case where the error is not an Error instance
                console.error('Unknown upload error:', error);
                alert('An unknown error occurred during upload.');
            }
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
