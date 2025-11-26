import React from "react";

type EditAppointmentDialogProps = {
  open: boolean;
  appointment: any;
  onClose: () => void;
  onSave: (data: any) => void;
};

// Convert datetime-local → ISO format for Prisma
function toISO(datetime: string) {
  // If user leaves it empty, return undefined
  if (!datetime) return undefined;

  const d = new Date(datetime);
  if (isNaN(d.getTime())) return undefined;

  return d.toISOString();
}

export default function EditAppointmentDialog({
  open,
  appointment,
  onClose,
  onSave,
}: EditAppointmentDialogProps) {
  // Hooks must always run
  const [form, setForm] = React.useState({
    id: "",
    startTime: "",
    endTime: "",
    notes: "",
  });

  // Load appointment data whenever modal opens
  React.useEffect(() => {
    if (open && appointment) {
      // Convert ISO → datetime-local format (remove Z + seconds)
      const convertToLocal = (iso: string) =>
        iso ? iso.slice(0, 16) : "";

      setForm({
        id: appointment.id || "",
        startTime: convertToLocal(appointment.startTime),
        endTime: convertToLocal(appointment.endTime),
        notes: appointment.notes || "",
      });
    }
  }, [open, appointment]);

  if (!open) return null;

  const handleSave = () => {
    onSave({
      id: form.id,
      startTime: toISO(form.startTime),
      endTime: toISO(form.endTime),
      notes: form.notes,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Edit Appointment
        </h2>

        <label className="block text-sm">Start Time</label>
        <input
          type="datetime-local"
          className="w-full border px-3 py-2 rounded mb-3"
          value={form.startTime}
          onChange={(e) => setForm({ ...form, startTime: e.target.value })}
        />

        <label className="block text-sm">End Time</label>
        <input
          type="datetime-local"
          className="w-full border px-3 py-2 rounded mb-3"
          value={form.endTime}
          onChange={(e) => setForm({ ...form, endTime: e.target.value })}
        />

        <label className="block text-sm">Notes</label>
        <textarea
          className="w-full border px-3 py-2 rounded mb-3"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />

        <div className="flex justify-end space-x-3 mt-4">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
