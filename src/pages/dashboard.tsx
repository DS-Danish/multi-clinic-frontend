import React, { useState, useEffect } from "react";
import { getCurrentUser, logoutUser } from "../utils/auth";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";
import "../styles/dashboard.css"; // ✅ moved CSS here

export default function Dashboard() {
  const [user, setUser] = useState(getCurrentUser());

  useEffect(() => {
    const current = getCurrentUser();
    if (!current) window.location.href = "/login";
    setUser(current);
  }, []);

  const handleLogout = (): void => {
    logoutUser();
    window.location.href = "/login";
  };

  if (!user) return <div className="loading">Loading...</div>;

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="header-left">
            <div className="logo-container">🏥</div>
            <div>
              <h1 className="header-title">Clinic Management Dashboard</h1>
              <p className="header-subtitle">
                Manage your clinics efficiently and with style.
              </p>
            </div>
          </div>
          <div className="user-info">
            <div className="user-avatar">{user.name.charAt(0)}</div>
            <div className="user-details">
              <div className="user-name">{user.name}</div>
              <div className="user-role">{user.role}</div>
            </div>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="stats-grid">
          <div className="stats-card">
            <div className="stats-content">
              <div>
                <div className="stats-title">Clinics</div>
                <div className="stats-value">12</div>
              </div>
            </div>
          </div>
          <div className="stats-card">
            <div className="stats-content">
              <div>
                <div className="stats-title">Patients</div>
                <div className="stats-value">320</div>
              </div>
            </div>
          </div>
          <div className="stats-card">
            <div className="stats-content">
              <div>
                <div className="stats-title">Appointments</div>
                <div className="stats-value">85</div>
              </div>
            </div>
          </div>
        </div>

        <Card className="add-clinic-card">
          <CardHeader>
            <CardTitle>Add New Clinic</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="form-grid">
              <div className="form-group">
                <Label>Name</Label>
                <Input placeholder="Clinic Name" />
              </div>
              <div className="form-group">
                <Label>Specialization</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cardiology">Cardiology</SelectItem>
                    <SelectItem value="neurology">Neurology</SelectItem>
                    <SelectItem value="physiotherapy">Physiotherapy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="form-group-full">
                <Label>Address</Label>
                <Textarea placeholder="Clinic Address" />
              </div>
            </div>
            <div className="form-actions">
              <Button className="btn-primary">Save</Button>
              <Button className="btn-secondary" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="footer">
        <p className="footer-text">
          © {new Date().getFullYear()} Multi-Clinic Management System
        </p>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </footer>
    </div>
  );
}
