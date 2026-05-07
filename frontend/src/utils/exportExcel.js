import * as XLSX from "xlsx";

export const exportToExcel = (registrations, eventTitle) => {
    const data = registrations.map((r, index) => ({
        S_NO: index + 1,

        Event_Title: r.eventId?.title || eventTitle,

        Name: r.name || "",
        College_ID: r.collegeId || "",

        Leader_Roll_No: r.rollNo || "",
        Leader_Department: r.department || "",

        Course_Name: r.course || "",
        Year: r.year || "",
        College_Name: r.collegeName || "",

        Contact: r.contact || "",
        Email: r.email || "",

        Team_Name: r.teamName || "Solo",

        Team_Members:
            r.teamMembers?.length
                ? r.teamMembers
                      .map(
                          (m) =>
                              `${m.name} (${m.rollNo} - ${m.department})`
                      )
                      .join(", ")
                : "Solo",

        Project_Name: r.projectName || "",

        Project_Description: r.projectDescription || "",

        Prototype_Link: r.prototypeLink || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");

    XLSX.writeFile(workbook, `${eventTitle}_registrations.xlsx`);
};