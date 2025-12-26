import React, { useEffect, useState } from "react";
import { BillingAPI } from "../services/billing.service";
import { useParams } from "react-router-dom";

export default function BillDetailPage() {
  const { billId } = useParams();
  const [bill, setBill] = useState<any>(null);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    BillingAPI.getBill(String(billId)).then((res: any) => {
      setBill(res.data);
      setAmount(res.data.totalAmount - (res.data.discount ?? 0));
    });
  }, [billId]);

  const pay = async () => {
    await BillingAPI.payBill(String(billId), {
      amount,
      method: "CASH",
    });
    alert("Payment successful");
  };

  if (!bill) return <div>Loading...</div>;

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
      <button onClick={pay}>Pay</button>
    </div>
  );
}
