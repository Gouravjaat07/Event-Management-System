// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// export const exportToPDF = (registrations, eventTitle) => {
//     // ✅ Landscape mode
//     const doc = new jsPDF("landscape", "pt", "A4");

//     // Title
//     doc.setFontSize(18);
//     doc.text(`Registrations - ${eventTitle}`, 40, 40);

//     const columns = [
//         "S.No",
//         "Event Name",
//         "Name",
//         "College ID",
//         "Course",
//         "Year",
//         "College Name",
//         "Contact",
//         "Email",
//         "Team Name",
//         "Team Members",
//     ];

//     const rows = registrations.map((r, i) => ([
//         i + 1,
//         r.eventId?.title || "",
//         r.name || r.userId?.name || "",
//         r.collegeId || "",
//         r.course || "",
//         r.year || "",
//         r.collegeName || "",
//         r.contact || "",
//         r.email || r.userId?.email || "",
//         r.teamName || "Solo",
//         (r.teamMembers || []).join(", "),
//     ]));

//     autoTable(doc, {
//         head: [columns],
//         body: rows,

//         startY: 70,
//         theme: "grid",

//         styles: {
//             fontSize: 9,
//             cellPadding: 4,
//             overflow: "linebreak",   // ✅ important
//             valign: "middle",
//         },

//         headStyles: {
//             fillColor: [30, 136, 229],
//             textColor: 255,
//             halign: "center",
//         },

//         columnStyles: {
//             0: { cellWidth: 40 },
//             1: { cellWidth: 90 },
//             2: { cellWidth: 100 },
//             3: { cellWidth: 90 },
//             4: { cellWidth: 90 },
//             5: { cellWidth: 50 },
//             6: { cellWidth: 90 },
//             7: { cellWidth: 80 },
//             8: { cellWidth: 140 },
//             9: { cellWidth: 80 },
//             10:{ cellWidth: 170 },
//         },

//         margin: { left: 30, right: 30 },
//     });

//     doc.save(`${eventTitle}_registrations.pdf`);
// };


import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";

export const exportToPDF = (registrations, eventTitle) => {
    const doc = new jsPDF("landscape", "pt", "A4");

    doc.text(`Registrations - ${eventTitle}`, 14, 15);

    const tableData = registrations.map((r, i) => [
        i + 1,
        // 🔹 Event
        r.eventId?.title || eventTitle,

        // 🔹 SOLO fields (fallback to userId if needed)
        r.name || r.userId?.name || "",
        r.collegeId || r.userId?.collegeId || "",
        r.course || "",
        r.year || "",
        r.collegeName || "",

        // 🔹 COMMON college fields
        r.contact || "",
        r.email || r.userId?.email || "",

        // 🔹 TEAM fields
        r.teamName || "Solo",
        r.teamMembers?.join(", ") || "",
    ]);

    // Autotable func call
    autoTable(doc, {
        head: [["S. No.", "Event Name", "Name", "College ID", "Course Name", "Year", "College Name", "Contact", "Email", "Team Name", "Team Members"]],
        body: tableData,
        startY: 20,
    });

    doc.save(`${eventTitle}_registrations.pdf`);
};

