import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

/**
 * Generate Certificate PDF
 * @param {Object} params
 * @param {String} params.userName
 * @param {String} params.eventTitle
 * @param {String} params.issueDate
 * @returns {String} filePath
 */
const generateCertificate = ({
  userName,
  eventTitle,
  issueDate = new Date().toDateString(),
}) => {
  // Ensure certificates directory exists
  const certDir = path.join("certificates");
  if (!fs.existsSync(certDir)) {
    fs.mkdirSync(certDir);
  }

  const fileName = `${userName.replace(/\s/g, "_")}_${Date.now()}.pdf`;
  const filePath = path.join(certDir, fileName);

  const doc = new PDFDocument({
    size: "A4",
    margin: 50,
  });

  doc.pipe(fs.createWriteStream(filePath));

  // ===== CERTIFICATE DESIGN =====

  doc
    .fontSize(28)
    .text("Certificate of Participation", { align: "center" });

  doc.moveDown(2);

  doc
    .fontSize(18)
    .text("This is to certify that", { align: "center" });

  doc.moveDown(1);

  doc
    .fontSize(26)
    .fillColor("#2c3e50")
    .text(userName, { align: "center" });

  doc.moveDown(1);

  doc
    .fontSize(18)
    .fillColor("black")
    .text(`has successfully participated in`, { align: "center" });

  doc.moveDown(1);

  doc
    .fontSize(22)
    .text(eventTitle, { align: "center" });

  doc.moveDown(2);

  doc
    .fontSize(14)
    .text(`Issued on: ${issueDate}`, { align: "center" });

  doc.moveDown(4);

  doc
    .fontSize(12)
    .text("Authorized Signature", { align: "right" });

  doc.end();

  return filePath;
};

export default generateCertificate;