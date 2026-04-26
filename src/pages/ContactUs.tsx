import React, { useState } from "react";
import { useToast } from "../components/ui/ToastProvider";

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactUs() {
  const toast = useToast();

  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    console.log("Contact form submitted:", form);

    toast.show("Your query has been submitted successfully.", "success");

    setForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Contact Us
        </h1>

        <p className="text-gray-500 text-center mt-2 mb-8">
          Submit your query and our team will contact you soon.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full h-11 px-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full h-11 px-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="subject"
            type="text"
            placeholder="Subject"
            value={form.subject}
            onChange={handleChange}
            required
            className="w-full h-11 px-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            name="message"
            placeholder="Write your query here..."
            value={form.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none resize-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg shadow-lg hover:opacity-90 transition"
          >
            Submit Query
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Back to{" "}
          <a href="/login" className="text-blue-600 font-semibold">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
