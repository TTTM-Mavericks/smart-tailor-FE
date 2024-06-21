// FileUpload.tsx
import React, { useState } from 'react';

const FileUpload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch('/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    alert('File uploaded and replaced successfully');
                } else {
                    alert('File upload failed');
                }
            } catch (error) {
                console.error('Error uploading file:', error);
                alert('Error uploading file');
            }
        }
    };

    return (
        <div>
            <input type="file" accept=".xlsx" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default FileUpload;
