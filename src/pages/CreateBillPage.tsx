import React, { useState } from "react";
import { BillingAPI } from "../services/billing.service";

export default function CreateBillPage() {
  const [form, setForm] = useState({
    appointmentId: "",
    patientId: "",
    totalAmount: 0,
    discount: 0,
  });

  const submit = async () => {
    const res = await BillingAPI.createBill(form);
    alert("Bill Created: " + res.data.id);
  };

  return (
    <div>
      <h1>Create Bill</h1>

      <input
        placeholder="Appointment ID"
        onChange={(e) =>
          setForm({ ...form, appointmentId: e.target.value })
        }
      />

      <input
        placeholder="Patient ID"
        onChange={(e) => setForm({ ...form, patientId: e.target.value })}
      />

      <input
        placeholder="Total Amount"
        type="number"
        onChange={(e) =>
          setForm({ ...form, totalAmount: Number(e.target.value) })
        }
      />

      <input
        placeholder="Discount"
        type="number"
        onChange={(e) =>
          setForm({ ...form, discount: Number(e.target.value) })
        }
      />

      <button onClick={submit}>Create Bill</button>
    </div>
  );
}
