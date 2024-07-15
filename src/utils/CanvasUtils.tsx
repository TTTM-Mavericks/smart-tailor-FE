import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { useEffect, RefObject } from 'react';


export const __handleDownloadElementAsPng = async (elementId: string, fileName: string) => {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error('Element not found');
        return;
    }

    try {
        const canvas = await html2canvas(element);
        canvas.toBlob(blob => {
            if (blob) {
                saveAs(blob, fileName);
            } else {
                console.error('Failed to convert canvas to blob');
            }
        }, 'image/png');
    } catch (error) {
        console.error('Error capturing element', error);
    }
};

export const __handleGetElementAsBase64 = async (elementId: string): Promise<string | undefined> => {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error('Element not found');
        return undefined;
    }

    try {
        const canvas = await html2canvas(element);
        return canvas.toDataURL('image/png');
    } catch (error) {
        console.error('Error capturing element', error);
        return undefined;
    }
};


export const __handleClickOutside = (ref: RefObject<HTMLElement>, handler: (event: MouseEvent | TouchEvent) => void) => {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }
            handler(event);
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
};
