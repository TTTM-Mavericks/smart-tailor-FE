import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { IoMdCloseCircleOutline, IoMdTrash } from 'react-icons/io';
import style from './BrandUpdateSampleProductDialogStyle.module.scss';
import { primaryColor } from '../../../../../root/ColorSystem';
import api, { featuresEndpoints, functionEndpoints, versionEndpoints } from '../../../../../api/ApiConfig';
import { toast } from 'react-toastify';

type Props = {
    isOpen: boolean;
    onClose?: () => void;
    orderID?: string;
    brandID?: any;
    stageID?: any
};

const BrandUpdateSampleProductDialog: React.FC<Props> = ({ isOpen, onClose, orderID, brandID, stageID }) => {
    const [description, setDescription] = useState<string>('');
    const [images, setImages] = useState<File[]>([]);
    const [videos, setVideos] = useState<File[]>([]);
    const [imageError, setImageError] = useState<string>('');
    const [videoError, setVideoError] = useState<string>('');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImageError('');
        if (e.target.files) {
            const fileArray = Array.from(e.target.files);
            if (images.length + fileArray.length <= 4) {
                setImages((prevImages) => [...prevImages, ...fileArray]);
            } else {
                setImageError('You can only upload up to 4 images.');
            }
        }
    };

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVideoError('');
        if (e.target.files) {
            const fileArray = Array.from(e.target.files);
            if (videos.length + fileArray.length <= 1) {
                setVideos((prevVideos) => [...prevVideos, ...fileArray]);
            } else {
                setVideoError('You can only upload 1 video.');
            }
        }
    };

    const handleRemoveImage = (index: number) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    const handleRemoveVideo = (index: number) => {
        setVideos((prevVideos) => prevVideos.filter((_, i) => i !== index));
    };

    const fileToBase64 = (file: File) => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const imagePromises = images.map(file => fileToBase64(file));
        const videoPromises = videos.map(file => fileToBase64(file));

        try {
            const imageBase64s = await Promise.all(imagePromises);
            const videoBase64s = await Promise.all(videoPromises);

            console.log('Order ID:', orderID);
            console.log('brand ID:', brandID);

            console.log('Description:', description);
            console.log('Images (base64):', imageBase64s[0]);
            console.log('Videos (base64):', videoBase64s[0]);

            try {
                const bodyRequest = {
                    orderStageID: stageID,
                    orderID: orderID,
                    brandID: brandID,
                    description: description || '',
                    imageUrl: imageBase64s[0] || '',
                    video: videoBase64s[0] || ''
                }

                console.log(bodyRequest);

                const response = await api.post(`${versionEndpoints.v1 + featuresEndpoints.SampleProduct + functionEndpoints.SampleProduct.addSampleProduct}`, bodyRequest);
                if (response.status === 200) {
                    console.log('detail order: ', response.data);
                    toast.success(`${response.message}`, { autoClose: 4000 });
                    console.log(response.message);

                }
                else {
                    console.log('detail error: ', response.message);
                    toast.error(`${response.message}`, { autoClose: 4000 });
                }
            } catch (error) {
                console.log(error);
                toast.error(`${error}`, { autoClose: 4000 });
            }




            // Perform your API call with the base64 data if needed
        } catch (error) {
            console.error('Error converting files to base64:', error);
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} aria-labelledby="dialog-title" maxWidth="md" fullWidth>
            <DialogTitle id="dialog-title">
                Update Sample Product
                <IoMdCloseCircleOutline
                    cursor="pointer"
                    size={20}
                    color="red"
                    onClick={onClose}
                    style={{ position: 'absolute', right: 20, top: 20 }}
                />
            </DialogTitle>
            <DialogContent dividers className={`${style.sampleModel__dialogContent} bg-gray-100`}>
                <div className="p-4 bg-white shadow-md rounded-md">
                    <h2 className="text-lg font-semibold mb-4">Order {orderID}</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">Description</label>
                            <textarea
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                placeholder="Enter description..."
                            />

                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">Upload Images</label>
                            <input
                                lang="en"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            {imageError && <p className="text-red-500 mt-2">{imageError}</p>}
                            <div className="mt-2 flex flex-wrap gap-4">
                                {images.map((image, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt={`Upload Preview ${index + 1}`}
                                            className="w-32 h-32 object-cover rounded-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
                                        >
                                            <IoMdTrash size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">Upload Videos</label>
                            <input
                                lang="en"
                                type="file"
                                multiple
                                accept="video/*"
                                onChange={handleVideoChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            {videoError && <p className="text-red-500 mt-2">{videoError}</p>}
                            <div className="mt-2 flex flex-wrap gap-4">
                                {videos.map((video, index) => (
                                    <div key={index} className="relative">
                                        <video
                                            src={URL.createObjectURL(video)}
                                            controls
                                            className="w-32 h-32 object-cover rounded-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveVideo(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
                                        >
                                            <IoMdTrash size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <DialogActions>
                            <button
                                type="submit"
                                className="px-5 py-2.5 text-sm font-medium text-white"
                                style={{
                                    borderRadius: 4,
                                    color: 'white',
                                    backgroundColor: primaryColor,
                                }}
                            >
                                Submit
                            </button>
                        </DialogActions>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default BrandUpdateSampleProductDialog;
