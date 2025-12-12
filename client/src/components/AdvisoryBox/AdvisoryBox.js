import React from "react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const AdvisoryBox = ({ advisory }) => {
    if (!advisory || advisory.length === 0) return null;

    const downloadPdf = async () => {
        const input = document.getElementById('advisory-content');
        if (!input) return;

        const canvas = await html2canvas(input, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF('p', 'mm', 'a4'); // 'p' for portrait
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save("FarmerAdvisory.pdf");
    };

    return (

        <div
            id="advisory-content"
            className="card-box advisory-box"
        >
            {/* Enhanced Header */}
            <div className="advisory-header">
                <div className="advisory-icon">📢</div>
                <div className="advisory-title">
                    <h3>FARMER WEATHER ADVISORY</h3>
                    <div className="advisory-subtitle">Critical insights for your farming decisions</div>
                </div>
            </div>

            {/* Advisory Content */}
            <div className="advisory-content">
                {advisory.map((a, i) => {

                    const isRisk = a.toLowerCase().includes("avoid") || a.toLowerCase().includes("monitor") || a.toLowerCase().includes("do not");
                    const className = isRisk ? "advisory-item risk" : "advisory-item advice";

                    return (

                        <div
                            key={i}
                            className={className}
                        >
                            <div className="advisory-item-icon">
                                {isRisk ? '🚨' : '✅'}
                            </div>
                            <div className="advisory-item-content">
                                <div className="advisory-item-label">
                                    {isRisk ? 'WARNING' : 'ADVICE'}
                                </div>
                                <div className="advisory-item-text">
                                    {a}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Actions */}
            <div className="advisory-actions">
                <button
                    onClick={downloadPdf}
                    className="download-btn"
                >
                    <span className="btn-icon">📄</span>
                    Download Advisory (PDF)
                </button>
            </div>
        </div>
    );
};

export default AdvisoryBox;