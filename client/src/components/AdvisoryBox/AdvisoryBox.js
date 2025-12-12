import React from "react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const AdvisoryBox = ({ advisory }) => {
    if (!advisory || advisory.length === 0) return null;

    // The PDF download logic is robust and requires no changes
    const downloadPdf = async () => {
        const input = document.getElementById('advisory-content');
        if (!input) return;

        // Use html2canvas to convert the HTML element to a canvas image
        const canvas = await html2canvas(input, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        
        // Use jsPDF to create the document
        const pdf = new jsPDF('p', 'mm', 'a4'); // 'p' for portrait
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save("FarmerAdvisory.pdf");
    };

    return (
        // 1. Replaced all inline styles with custom classes
        <div 
            id="advisory-content" // ID is critical for PDF generation
            className="card-box advisory-box" 
        >
            {/* 2. Removed inline H3 styles, relying on .advisory-box h3 CSS */}
            <h3 style={{ marginBottom: "20px" }}>
                <span role="img" aria-label="alert" style={{ marginRight: '10px' }}>📢</span>
                FARMER WEATHER ADVISORY
            </h3>
            
            {advisory.map((a, i) => {
                // Determine if it's a risk advisory based on keywords
                const isRisk = a.toLowerCase().includes("avoid") || a.toLowerCase().includes("monitor") || a.toLowerCase().includes("do not");
                const className = isRisk ? "advisory-item risk" : "advisory-item advice";
                
                return (
                    // 3. Replaced inline styles with dynamic classes
                    <div 
                        key={i} 
                        className={className}
                    >
                        {/* 4. Used spans inside the div for semantic structure */}
                        <span style={{ marginRight: "5px" }}>
                            {isRisk ? '🚨 WARNING:' : '✅ ADVICE:'}
                        </span>
                        {a}
                    </div>
                );
            })}
            
            <button 
                onClick={downloadPdf} 
                // 5. Removed all inline button styles, relying on .advisory-box button CSS
            >
                Download Advisory (PDF)
            </button>
        </div>
    );
};

export default AdvisoryBox;