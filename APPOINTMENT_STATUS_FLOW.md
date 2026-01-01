# Appointment Status Flow Documentation

## Status Enum
The appointment status should be an enum with the following values:
- `PENDING` - Initial status when created by patient or doctor
- `SCHEDULED` - Confirmed by receptionist or created by receptionist
- `COMPLETED` - Appointment has been completed
- `CANCELLED` - Appointment has been cancelled

## Status Transitions

### 1. Patient Creates Appointment
**Endpoint:** `POST /appointments`
**Initial Status:** `PENDING`
**Flow:**
- Patient selects clinic, doctor, and time
- Appointment is created with status `PENDING`
- Patient sees "Appointment request sent!" message
- Receptionist needs to confirm/accept this appointment

### 2. Doctor Creates Appointment
**Endpoint:** `POST /appointments` (doctor context)
**Initial Status:** `PENDING`
**Flow:**
- Doctor creates appointment for a patient
- Appointment is created with status `PENDING`
- Receptionist needs to confirm/accept this appointment

### 3. Receptionist Creates Appointment
**Endpoint:** `POST /receptionist/appointments`
**Initial Status:** `SCHEDULED`
**Flow:**
- Receptionist creates appointment directly
- Since receptionist is authorized to confirm, status is `SCHEDULED`
- No additional confirmation needed

### 4. Receptionist Accepts/Confirms Appointment
**Endpoint:** `PATCH /receptionist/appointments/:id/accept`
**Status Change:** `PENDING` → `SCHEDULED`
**Flow:**
- Receptionist views pending appointments
- Clicks "Accept" button on a pending appointment
- Status changes from `PENDING` to `SCHEDULED`
- Patient is notified that their appointment is confirmed

### 5. Appointment Completion
**Endpoint:** `PATCH /appointments/:id/complete` (to be implemented)
**Status Change:** `SCHEDULED` → `COMPLETED`
**Flow:**
- After appointment occurs, doctor or receptionist marks as completed
- Status changes to `COMPLETED`
- No further edits allowed

### 6. Appointment Cancellation
**Endpoint:** 
- Patient: `PATCH /appointments/:id/cancel`
- Receptionist: `PATCH /receptionist/appointments/:id/cancel`
**Status Change:** `PENDING` or `SCHEDULED` → `CANCELLED`
**Flow:**
- Can be cancelled by patient, doctor, or receptionist
- Works on both `PENDING` and `SCHEDULED` appointments
- Once cancelled, appointment cannot be edited or reactivated

## UI Behavior

### Patient Portal
- **Can Edit/Cancel:** Appointments with status `PENDING` or `SCHEDULED`
- **Cannot Edit/Cancel:** Appointments with status `COMPLETED` or `CANCELLED`
- **Status Display:**
  - `PENDING`: Yellow badge - "Waiting for confirmation"
  - `SCHEDULED`: Blue badge - "Confirmed"
  - `COMPLETED`: Green badge - "Completed"
  - `CANCELLED`: Red badge - "Cancelled"

### Receptionist Dashboard
- Shows only `PENDING` appointments in the pending queue
- "Accept" button changes status from `PENDING` → `SCHEDULED`
- Can cancel both `PENDING` and `SCHEDULED` appointments
- Can edit appointment details for non-cancelled/completed appointments

### Doctor Portal
- Views all their appointments regardless of status
- Can see appointment status for scheduling purposes
- May have ability to complete appointments (to be implemented)

## Backend Requirements

### Database Schema (Prisma)
```prisma
enum AppointmentStatus {
  PENDING
  SCHEDULED
  COMPLETED
  CANCELLED
}

model Appointment {
  id         String            @id @default(cuid())
  status     AppointmentStatus @default(PENDING)
  // ... other fields
}
```

### Status Validation Rules
1. **Creation:**
   - Patient/Doctor creates → `PENDING`
   - Receptionist creates → `SCHEDULED`

2. **Updates:**
   - Only `PENDING` and `SCHEDULED` appointments can be edited
   - Cannot update `COMPLETED` or `CANCELLED` appointments
   - Patient can only update their own appointments

3. **Transitions:**
   - `PENDING` → `SCHEDULED` (via receptionist accept)
   - `PENDING` → `CANCELLED` (via cancel action)
   - `SCHEDULED` → `COMPLETED` (via complete action)
   - `SCHEDULED` → `CANCELLED` (via cancel action)

4. **Restrictions:**
   - Cannot go from `COMPLETED` → any other status
   - Cannot go from `CANCELLED` → any other status
   - Cannot skip `SCHEDULED` and go directly to `COMPLETED`

## Implementation Checklist

### Backend
- [ ] Create AppointmentStatus enum in Prisma schema
- [ ] Update Appointment model to use enum with default PENDING
- [ ] Ensure patient/doctor appointment creation sets PENDING
- [ ] Ensure receptionist appointment creation sets SCHEDULED
- [ ] Implement accept endpoint to change PENDING → SCHEDULED
- [ ] Implement complete endpoint to change SCHEDULED → COMPLETED
- [ ] Add validation to prevent editing COMPLETED/CANCELLED appointments
- [ ] Add validation for valid status transitions

### Frontend
- [x] Create appointment types file with status enum
- [x] Update PatientDetailPage to use status enum
- [x] Add status badge rendering with proper colors
- [x] Update edit/cancel button visibility based on status
- [x] Update receptionist page to handle status properly
- [x] Update success messages to reflect status changes
- [ ] Add "Complete" button for receptionist/doctor (optional)
- [ ] Test all status transitions

## Notes
- The status column MUST be an enum in the database for data integrity
- All status checks should use the enum values, not string literals
- Consider adding timestamps: `scheduledAt`, `completedAt`, `cancelledAt`
- Consider adding `cancellationReason` field for cancelled appointments
