import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { createRoot } from 'react-dom/client';
import styles from './TextEditorStyle.module.scss';
import html2canvas from 'html2canvas';
import CustomButton from '../CustomButton/CustomButton';
import { primaryColor } from '../../root/ColorSystem';
import { renderToStaticMarkup } from 'react-dom/server';


// Define the props for the Editor component
interface EditorProps {
    placeholder?: string;
    onSetText?: (txtBase64: any) => void;
}


/*
 * Event handler to be attached using Quill toolbar module
 */
const insertStar = function (this: any) {
    const cursorPosition = this.getSelection()?.index;
    if (cursorPosition !== null && cursorPosition !== undefined) {
        this.insertText(cursorPosition, '★');
        this.setSelection(cursorPosition + 1);
    }
};

/*
 * Custom toolbar component including insertStar button and dropdowns
 */
const CustomToolbar: React.FC = () => (
    <div id="toolbar">
        <select className="ql-header" defaultValue={''} onChange={(e) => e.persist()}>
            <option value="1"></option>
            <option value="2"></option>
            <option value=""></option>
        </select>
        <select className="ql-color">
            <option value="red"></option>
            <option value="green"></option>
            <option value="blue"></option>
            <option value="orange"></option>
            <option value="violet"></option>
            <option value="#d0d1d2"></option>
            <option value=""></option>
        </select>
        <button className="ql-bold"></button>
        <button className="ql-italic"></button>
        <button className="ql-indent" value="-1"></button>
        <button className="ql-indent" value="+1"></button>
        <select className="ql-size" defaultValue="szie" >
            <option value="small"></option>
            <option value="normal"></option>
            <option value="large"></option>
            <option value="huge"></option>
        </select>
    </div>
);

// Quill modules to attach to editor
const quillModules = {
    toolbar: {
        container: '#toolbar',
        handlers: {
            insertStar: insertStar,
        },
    },
};

// Quill editor formats
const quillFormats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'color',
];

/*
 * Editor component with custom toolbar and content containers
 */
const TextEditor: React.FC<EditorProps> = ({ placeholder, onSetText }) => {

    // ---------------UseState Variable---------------//
    const [editorHtml, setEditorHtml] = useState('');
    const quillRef = useRef<ReactQuill>(null);
    const [angle, setAngle] = useState<number>(0);

    const applyCurvature = () => {
        if (quillRef.current) {
            const editorElement = quillRef.current.editor?.root;
            if (editorElement) {
                editorElement.style.transform = `rotate(${angle}deg)`;
            }
        }
    };

    // ---------------Usable Variable---------------//
    // ---------------UseEffect---------------//
    useEffect(() => {
        if (quillRef.current) {
            const quill = quillRef.current.getEditor();
            quill.getModule('toolbar').addHandler('insertStar', insertStar.bind(quill));
        }
    }, []);


    // ---------------FunctionHandler---------------//

    const print = () => {
        console.log(editorHtml);
        if (editorHtml) {
            const txt = __handleConvertHtmlToSvg(editorHtml)
            console.log(txt);
        }

    }

    const __handleChange = useCallback(() => {
        if (quillRef.current) {
            const quill = quillRef.current.getEditor();
            const text = quill.getText().trim();
            if (text.length <= 100) {
                setEditorHtml(quill.root.innerHTML);
            }
        }
    }, []);

    const __handleConvertToImage = async () => {
        const editorElement = document.querySelector('.ql-editor');
        if (editorElement) {
            const canvas = await html2canvas(editorElement as HTMLElement, {
                backgroundColor: null, // Set background to transparent
                useCORS: true // Enable cross-origin resource sharing if needed
            });
            const imgData = canvas.toDataURL('image/png');
            console.log(imgData);
            if (onSetText) {
                onSetText(imgData);
            }
        }
    };

    const __handleConvertHtmlToSvg = (html: string): string => {
        // Create a parser and parse the HTML string
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
      
        // Select the first element in the document
        const rootElement = doc.documentElement;
      
        // Get all text nodes and elements in the root element
        const textSpans = Array.from(rootElement.childNodes).map((node, index) => {
          if (node.nodeType === Node.TEXT_NODE) {
            return <tspan key={index}>{node.textContent}</tspan>;
          }
      
          const element = node as HTMLElement;
          const styles = window.getComputedStyle(element);
          const tag = element.tagName.toLowerCase();
          const attrs: { [key: string]: string | number } = {};
      
          if (tag === 'strong' || tag === 'em' || tag === 'span') {
            if (tag === 'strong') attrs['font-weight'] = 'bold';
            if (tag === 'em') attrs['font-style'] = 'italic';
            if (element.style.color) attrs['fill'] = element.style.color;
            if (element.classList.contains('ql-size-large')) attrs['font-size'] = 30;
            if (element.classList.contains('ql-size-small')) attrs['font-size'] = 15;
      
            return (
              <tspan key={index} {...attrs}>
                {element.textContent}
              </tspan>
            );
          }
      
          return <tspan key={index}>{element.textContent}</tspan>;
        });
      
        // Generate SVG markup with text path
        return renderToStaticMarkup(
          <svg width="300" height="300" viewBox="0 0 300 300">
            <defs>
              <path
                id="circlePath"
                d="M 150, 150 m -100, 0 a 100,100 0 1,1 200,0 a 100,100 0 1,1 -200,0"
              />
            </defs>
            <text font-size="20" font-family="Arial" text-anchor="middle">
              <textPath href="#circlePath" startOffset="50%">
                {textSpans}
              </textPath>
            </text>
          </svg>
        );
      };

    return (
        <div className={styles.textEditor__container}>
            <CustomToolbar />
            <ReactQuill
                ref={quillRef}
                value={editorHtml}
                onChange={__handleChange}
                placeholder={placeholder}
                modules={quillModules}
                formats={quillFormats}
                className={styles.textEditor__container__inputForm}
            />
            <div className={styles.textEditor__countLetters}>
                <span>
                    {editorHtml.length} / 100
                </span>
            </div>

            <div className="angle-adjustment">
                <input
                    type="range"
                    min="-180"
                    max="180"
                    value={angle}
                    onChange={(e) => setAngle(parseInt(e.target.value))}
                />
                <button onClick={print}>Apply Curvature</button>
            </div>


            <div className={styles.textEditor__button}>
                <CustomButton
                    type="filled"
                    title="Add Text"
                    handleClick={() => __handleConvertToImage()}
                    customStyles={`font-size: 0.75rem; line-height: 1rem; background-color: ${primaryColor}; width: 250'`}
                />
            </div>
            {__handleConvertHtmlToSvg(editorHtml)}

        </div>
    );
};

// /*
//  * Render component on page
//  */
const container = document.querySelector('.app');
if (container) {
    const root = createRoot(container);
    root.render(<TextEditor />);
}


export default TextEditor;