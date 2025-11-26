import React, { useEffect, useState } from "react";
import api from "../services/api";

interface Clinic {
  id: number;
  name: string;
  location: string;
  contact: string;
}

export const ClinicList: React.FC = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Try to fetch from backend
    api
      .get("/clinics")
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setClinics(res.data);
        } else {
          // fallback if empty API
          setClinics([
            { id: 1, name: "City Care Hospital", location: "Karachi", contact: "021-1234567" },
            { id: 2, name: "Wellness Clinic", location: "Lahore", contact: "042-7654321" },
            { id: 3, name: "Heartline Medical Center", location: "Islamabad", contact: "051-9876543" },
            { id: 4, name: "Family Health Clinic", location: "Hyderabad", contact: "022-2468101" },
          ]);
        }
      })
      .catch((err) => {
        console.error("Error fetching clinics:", err);
        // fallback if API fails
        setClinics([
          { id: 1, name: "City Care Hospital", location: "Karachi", contact: "021-1234567" },
          { id: 2, name: "Wellness Clinic", location: "Lahore", contact: "042-7654321" },
          { id: 3, name: "Heartline Medical Center", location: "Islamabad", contact: "051-9876543" },
          { id: 4, name: "Family Health Clinic", location: "Hyderabad", contact: "022-2468101" },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading clinics...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Clinics</h2>
      {clinics.length === 0 ? (
        <p>No clinics found</p>
      ) : (
        <ul>
          {clinics.map((c) => (
            <li key={c.id}>
              <strong>{c.name}</strong> — {c.location} ({c.contact})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
