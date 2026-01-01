import React, { useState } from "react";
import api from "../services/api";
import { useToast } from "./ui/ToastProvider";

interface AddClinicProps {
  onAdded: () => void;
}

export const AddClinic: React.FC<AddClinicProps> = ({ onAdded }) => {
  const toast = useToast();
  const [form, setForm] = useState({
    name: "",
    location: "",
    contact: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      await api.post("/clinics", form);
      setForm({ name: "", location: "", contact: "" });
      onAdded();
      toast.show("Clinic added successfully!", "success");
    } catch (err) {
      console.error("Error adding clinic:", err);
      toast.show("Failed to add clinic. Please try again.", "error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 space-y-4 border border-gray-200"
    >
      <h2 className="text-lg font-semibold text-gray-800">
        Add New Clinic
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Clinic Name"
          value={form.name}
          onChange={handleChange}
          className="border rounded-md p-2 focus:ring focus:ring-blue-300 outline-none"
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="border rounded-md p-2 focus:ring focus:ring-blue-300 outline-none"
          required
        />
        <input
          type="text"
          name="contact"
          placeholder="Contact Info"
          value={form.contact}
          onChange={handleChange}
          className="border rounded-md p-2 focus:ring focus:ring-blue-300 outline-none"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Add Clinic
      </button>
    </form>
  );
};
