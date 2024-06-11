// // src/components/HomePage.js
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Viewer, Worker } from "@react-pdf-viewer/core";
// import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
// import "@react-pdf-viewer/core/lib/styles/index.css";
// import "@react-pdf-viewer/default-layout/lib/styles/index.css";

// const HomePage = ({ auth }) => {
//   const navigate = useNavigate();
//   const [pdf, setPdf] = useState(null);
//   const [pdfUrl, setPdfUrl] = useState(null);
  
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file && file.type === "application/pdf") {
//       setPdf(file);
      
//     }
//   };
  
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (pdf != null) {
//       // Perform upload action here if needed
//       const url = URL.createObjectURL(pdf);
//       setPdfUrl(url);
//      // setPdfUrl(URL.createObjectURL(pdf));
//     }
//   };
  
//   const newPlugin = defaultLayoutPlugin();

//   if (!auth.isAuthenticated) {
//     return (
//       <div>
//         <h1>Please login first</h1>
//         <button
//           onClick={() => {
//             navigate("/login");
//           }}
//         >
//           Go back
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="container">
//       <form onSubmit={handleSubmit}>
//         <input
//           type="file"
//           accept="application/pdf"
//           onChange={handleFileChange}
//         />
//         <button type="submit">Upload PDF</button>
//       </form>
//       <h1>View PDF</h1>
//       <div className="pdf-container">
//         <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
//           {pdfUrl ? (
//             <Viewer fileUrl={pdfUrl} plugins={[newPlugin]} />
//           ) : (
//             <>PDF Preview</>
//           )}
//         </Worker>
//       </div>
//     </div>
//   );
// };

// export default HomePage;


// src/components/HomePage.js
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = ({ auth }) => {
    const navigate = useNavigate();
    const [pdf, setPdf] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [uploadError, setUploadError] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            setPdf(file);
            setUploadError('');
        } else {
            setUploadError('Please select a PDF file.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (pdf != null) {
            const formData = new FormData();
            formData.append('pdf', pdf);

            try {
                const response = await axios.post('http://localhost:5000/api/pdfs/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${auth.token}`
                    }
                });
                if (response.status === 201) {
                    const url = URL.createObjectURL(pdf);
                    setPdfUrl(url);
                    console.log('PDF uploaded successfully', response.data);
                }
            } catch (error) {
                console.error('Failed to upload PDF', error);
                setUploadError('Failed to upload PDF. Please try again.');
            }
        }
    };

    const newPlugin = defaultLayoutPlugin();

    if (!auth.isAuthenticated) {
        return (
            <div>
                <h1>Please login first</h1>
                <button
                    onClick={() => {
                        navigate("/login");
                    }}
                >
                    Go back
                </button>
            </div>
        );
    }

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                />
                <button type="submit">Upload PDF</button>
            </form>
            {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}
            <h1>View PDF</h1>
            <div className="pdf-container">
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                    {pdfUrl ? (
                        <Viewer fileUrl={pdfUrl} plugins={[newPlugin]} />
                    ) : (
                        <>PDF Preview</>
                    )}
                </Worker>
            </div>
        </div>
    );
};

export default HomePage;
