import React from "react";
import jsPDF from 'jspdf';

const AdvisoryBox = ({ advisory }) => {
    if (!advisory || advisory.length === 0) return null;

    const downloadPdf = () => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        let yPosition = 20;

        // Title
        pdf.setFontSize(20);
        pdf.setFont('helvetica', 'bold');
        pdf.text('FARMER WEATHER ADVISORY', 20, yPosition);
        yPosition += 15;

        // Subtitle
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.text('Critical insights for your farming decisions', 20, yPosition);
        yPosition += 20;

        // Advisory items
        advisory.forEach((item, index) => {
            const isRisk = item.toLowerCase().includes("avoid") || item.toLowerCase().includes("monitor") || item.toLowerCase().includes("do not");
            const label = isRisk ? 'WARNING:' : 'ADVICE:';

            // Label
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(isRisk ? 230 : 46, isRisk ? 81 : 125, isRisk ? 0 : 50); // Orange for risk, green for advice
            pdf.text(label, 20, yPosition);
            yPosition += 10;

            // Item text
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(0, 0, 0); // Black

            // Split long text into lines
            const lines = pdf.splitTextToSize(item, 170);
            lines.forEach(line => {
                if (yPosition > 270) { // Check if we need a new page
                    pdf.addPage();
                    yPosition = 20;
                }
                pdf.text(line, 20, yPosition);
                yPosition += 7;
            });

            yPosition += 10; // Extra space between items
        });

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