import React, { useEffect, useState } from "react";
import { getCurrentUser, logoutUser } from "../utils/auth";
import { Button } from "../components/ui/button";
import "../styles/patientdetails.css";

export default function PatientDetailPage() {
  const [user, setUser] = useState(getCurrentUser());

  useEffect(() => {
    const current = getCurrentUser();
    if (!current) {
      window.location.href = "/login";
    } else {
      setUser(current);
    }
  }, []);

  // ✅ Define logout handler BEFORE return
  const handleLogout = (): void => {
    logoutUser();
    window.location.href = "/login";
  };

  if (!user) return <div className="loading">Loading...</div>;

  return (
    <div className="patient-page">
      <div className="patient-card">
        <h1 className="title">Patient Details</h1>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>

        <Button className="logout-btn" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
}
