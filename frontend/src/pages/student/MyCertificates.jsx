import { useEffect, useState } from "react";
import { getMyCertificates } from "../../services/certificateService";
import { useAuth } from "../../context/AuthContext";

const MyCertificates = () => {
  const { user } = useAuth();
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    getMyCertificates(user.id).then(res => setCerts(res.data));
  }, []);

  return (
    <div>
      <h2>My Certificates</h2>

      {certs.map(c => (
        <div key={c._id}>
          <p>{c.eventId.title}</p>
          <a href={c.certificateUrl} download>
            Download PDF
          </a>
        </div>
      ))}
    </div>
  );
};

export default MyCertificates;
