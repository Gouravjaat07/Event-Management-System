import { useState } from "react";
import { uploadTemplate, issueAllCertificates } from "../../services/certificateService";

const HostCertificates = ({ eventId }) => {
  const [file, setFile] = useState(null);

  if (!eventId) {
    return <p>Select an event to manage certificates</p>;
  }

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Certificate Management</h3>

      <input
        type="file"
        accept=".docx"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button
        disabled={!file}
        onClick={() => uploadTemplate(eventId, file)}
      >
        Upload Template
      </button>

      <br /><br />

      <button onClick={() => issueAllCertificates(eventId)} disabled>
        Issue Certificate for All
      </button>
    </div>
  );
};

export default HostCertificates;


// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import api from "../../services/api";
// import { uploadTemplate } from "../../services/certificateService";
// import { issueAllCertificates } from "../../services/certificateService";


// export const HostCertificates = ({ eventId }) => {
//   const [file, setFile] = useState(null);

//   return (
//     <div>
//       <h3>Certificate Management</h3>

//       <input
//         type="file"
//         accept=".docx"
//         onChange={(e) => setFile(e.target.files[0])}
//       />

//       <button onClick={() => uploadTemplate(eventId, file)}>
//         Upload Template
//       </button>

//       <button onClick={() => issueAllCertificates(eventId)}>
//         Issue Certificate for All
//       </button>
//     </div>
//   );
// };
