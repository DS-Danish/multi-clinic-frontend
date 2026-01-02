import React from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, ArrowLeft } from "lucide-react";
import { Button } from "../../../components/ui/button";

export default function ReceptionistsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin-dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Dashboard
          </Button>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Receptionist Management</h1>
              <p className="text-gray-600 mt-2">
                Manage your clinic's reception staff
              </p>
            </div>
            
            <Button onClick={() => navigate("/admin-dashboard/receptionists/add")}>
              <UserPlus className="mr-2" size={20} />
              Add Receptionist
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-gray-500 text-center py-12">
            Receptionist list will be displayed here. This feature is under development.
          </p>
        </div>
      </div>
    </div>
  );
}
