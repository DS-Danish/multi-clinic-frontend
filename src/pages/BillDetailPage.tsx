import React, { useEffect, useState } from "react";
import { BillingAPI } from "../services/billing.service";
import { useParams } from "react-router-dom";
import { useToast } from "../components/ui/ToastProvider";

export default function BillDetailPage() {
  const toast = useToast();
  const { billId } = useParams();
  const [bill, setBill] = useState<any>(null);
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const loadBill = async () => {
      try {
        setLoading(true);
        const res = await BillingAPI.getBill(String(billId));
        setBill(res.data);
        setAmount(res.data.totalAmount - (res.data.discount ?? 0));
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to load bill details";
        toast.show(Array.isArray(message) ? message[0] : message, "error");
      } finally {
        setLoading(false);
      }
    };

    loadBill();
  }, [billId]);

  const pay = async () => {
    if (amount <= 0) {
      toast.show("Payment amount must be greater than 0", "error");
      return;
    }

    try {
      setPaying(true);
      await BillingAPI.payBill(String(billId), {
        amount,
        method: "CASH",
      });
      toast.show("Payment successful", "success");

      const res = await BillingAPI.getBill(String(billId));
      setBill(res.data);
      setAmount(res.data.totalAmount - (res.data.discount ?? 0));
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to process payment";
      toast.show(Array.isArray(message) ? message[0] : message, "error");
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!bill) return <div>Unable to load bill.</div>;

  return (
    <div>
      <h1>Invoice #{bill.id}</h1>

      <p>Total: {bill.totalAmount}</p>
      <p>Discount: {bill.discount}</p>
      <p>Status: {bill.status}</p>

      <h3>Payments</h3>
      <ul>
        {bill.payments?.map((p: any) => (
          <li key={p.id}>
            {p.amount} via {p.method}
          </li>
        ))}
      </ul>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <button onClick={pay} disabled={paying}>
        {paying ? "Processing..." : "Pay"}
      </button>
    </div>
  );
}
