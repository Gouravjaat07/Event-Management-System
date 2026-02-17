import * as XLSX from "xlsx";

export const exportToExcel = (registrations, eventTitle) => {
    const data = registrations.map((r, index) => ({
        S_NO: index + 1,
        // 🔹 Event
        Event_Title: r.eventId?.title || eventTitle,

        // 🔹 SOLO fields (fallback to userId if needed)
        Name: r.name || "",
        College_ID: r.collegeId || "",
        Course_Name: r.course || "",
        Year: r.year || "",
        College_Name: r.collegeName || "",

        // 🔹 TEAM fields
        Team_Name: r.teamName || "Solo",
        Team_Members: r.teamMembers?.join(", ") || "",

        // 🔹 COMMON college fields
        Contact: r.contact || "",
        Email: r.email || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");

    XLSX.writeFile(workbook, `${eventTitle}_registrations.xlsx`);
};

