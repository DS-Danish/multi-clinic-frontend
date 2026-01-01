# Backend Implementation Guide for Appointment Status

## Required Backend Changes

### 1. Database Schema (Prisma)

Add this enum to your schema.prisma file:

```prisma
enum AppointmentStatus {
  PENDING
  SCHEDULED  
  COMPLETED
  CANCELLED
}
```

Update the Appointment model:

```prisma
model Appointment {
  id         String            @id @default(cuid())
  status     AppointmentStatus @default(PENDING)  // Changed from String to enum
  
  // ... other existing fields
  patientId  String
  doctorId   String
  clinicId   String
  startTime  DateTime
  endTime    DateTime
  notes      String?
  createdAt  DateTime          @default(now())
  updatedAt  DateTime          @updatedAt
  
  // ... relations
}
```

After updating schema, run:
```bash
npx prisma migrate dev --name add_appointment_status_enum
```

### 2. Patient Appointment Creation Endpoint

**Current:** `POST /appointments`
**Required Status:** `PENDING`

```typescript
// In appointment.controller.ts
@Post()
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(Role.PATIENT, Role.DOCTOR)
async createAppointment(@Body() dto: CreateAppointmentDto, @GetUser('userId') userId: string) {
  return this.appointmentService.createAppointment(dto, userId);
}

// In appointment.service.ts
async createAppointment(dto: CreateAppointmentDto, userId: string) {
  // Verify patient/doctor authorization
  // Check for scheduling conflicts
  
  return this.prisma.appointment.create({
    data: {
      ...dto,
      patientId: userId, // or from dto
      status: AppointmentStatus.PENDING, // Explicitly set to PENDING
      startTime: new Date(dto.startTime),
      endTime: new Date(dto.endTime),
    },
    include: {
      doctor: true,
      clinic: true,
      patient: true,
    },
  });
}
```

### 3. Receptionist Appointment Creation Endpoint

**Current:** `POST /receptionist/appointments`
**Required Status:** `SCHEDULED`

```typescript
// In receptionist.controller.ts
@Post('appointments')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(Role.RECEPTIONIST)
async createAppointment(@Body() dto: CreateAppointmentDto, @GetUser('userId') userId: string) {
  return this.receptionistService.createAppointment(dto, userId);
}

// In receptionist.service.ts
async createAppointment(dto: CreateAppointmentDto, receptionistId: string) {
  // Verify receptionist works at the clinic
  // Check for scheduling conflicts
  
  return this.prisma.appointment.create({
    data: {
      ...dto,
      status: AppointmentStatus.SCHEDULED, // Receptionist creates as SCHEDULED
      startTime: new Date(dto.startTime),
      endTime: new Date(dto.endTime),
    },
    include: {
      doctor: true,
      clinic: true,
      patient: true,
    },
  });
}
```

### 4. Receptionist Accept Appointment Endpoint

**Current:** `PATCH /receptionist/appointments/:id/accept`
**Status Change:** `PENDING` → `SCHEDULED`

```typescript
// In receptionist.controller.ts
@Patch('appointments/:id/accept')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(Role.RECEPTIONIST)
async acceptAppointment(@Param('id') id: string, @GetUser('userId') userId: string) {
  return this.receptionistService.acceptAppointment(id, userId);
}

// In receptionist.service.ts
async acceptAppointment(appointmentId: string, receptionistId: string) {
  // Find appointment
  const appointment = await this.prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { clinic: true },
  });

  if (!appointment) {
    throw new NotFoundException('Appointment not found');
  }

  // Verify appointment is PENDING
  if (appointment.status !== AppointmentStatus.PENDING) {
    throw new BadRequestException('Only pending appointments can be accepted');
  }

  // Verify receptionist works at this clinic
  const receptionist = await this.prisma.user.findFirst({
    where: {
      id: receptionistId,
      role: Role.RECEPTIONIST,
      clinicId: appointment.clinicId,
    },
  });

  if (!receptionist) {
    throw new ForbiddenException('You can only accept appointments for your clinic');
  }

  // Update to SCHEDULED
  const updated = await this.prisma.appointment.update({
    where: { id: appointmentId },
    data: { status: AppointmentStatus.SCHEDULED },
    include: {
      doctor: true,
      clinic: true,
      patient: true,
    },
  });

  // Optional: Send notification to patient
  // await this.notificationService.notify(...)

  return updated;
}
```

### 5. List Pending Appointments Endpoint

**Current:** `GET /receptionist/appointments/pending`
**Filter:** Only `PENDING` status

```typescript
// In receptionist.controller.ts
@Get('appointments/pending')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(Role.RECEPTIONIST)
async listPendingAppointments(@GetUser('userId') userId: string, @Query() query: any) {
  return this.receptionistService.listPendingAppointments(userId, query);
}

// In receptionist.service.ts
async listPendingAppointments(receptionistId: string, query: any) {
  // Get receptionist's clinic
  const receptionist = await this.prisma.user.findUnique({
    where: { id: receptionistId },
    select: { clinicId: true },
  });

  if (!receptionist?.clinicId) {
    throw new NotFoundException('Receptionist clinic not found');
  }

  // Fetch only PENDING appointments for this clinic
  return this.prisma.appointment.findMany({
    where: {
      clinicId: receptionist.clinicId,
      status: AppointmentStatus.PENDING, // Only pending
    },
    include: {
      patient: {
        select: { id: true, name: true, email: true },
      },
      doctor: {
        select: { id: true, name: true },
      },
      clinic: {
        select: { id: true, name: true },
      },
    },
    orderBy: { startTime: 'asc' },
  });
}
```

### 6. Cancel Appointment Endpoints

**Patient Cancel:** `PATCH /appointments/:id/cancel`
**Receptionist Cancel:** `PATCH /receptionist/appointments/:id/cancel`
**Status Change:** `PENDING` or `SCHEDULED` → `CANCELLED`

```typescript
// In appointment.service.ts
async cancelPatientAppointment(appointmentId: string, patientId: string) {
  const appointment = await this.prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment) {
    throw new NotFoundException('Appointment not found');
  }

  if (appointment.patientId !== patientId) {
    throw new ForbiddenException('You can only cancel your own appointments');
  }

  // Cannot cancel if already completed or cancelled
  if (appointment.status === AppointmentStatus.COMPLETED) {
    throw new BadRequestException('Cannot cancel a completed appointment');
  }

  if (appointment.status === AppointmentStatus.CANCELLED) {
    throw new BadRequestException('Appointment is already cancelled');
  }

  // Update to CANCELLED
  return this.prisma.appointment.update({
    where: { id: appointmentId },
    data: { status: AppointmentStatus.CANCELLED },
    include: {
      doctor: true,
      clinic: true,
    },
  });
}
```

### 7. Update Appointment Validation

Both patient and receptionist update endpoints should prevent editing COMPLETED or CANCELLED appointments:

```typescript
async updatePatientAppointment(appointmentId: string, dto: any, patientId: string) {
  const appointment = await this.prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment) {
    throw new NotFoundException('Appointment not found');
  }

  // Verify ownership
  if (appointment.patientId !== patientId) {
    throw new ForbiddenException('You can only update your own appointments');
  }

  // Verify status allows editing
  if (appointment.status === AppointmentStatus.CANCELLED) {
    throw new BadRequestException('Cannot update a cancelled appointment');
  }

  if (appointment.status === AppointmentStatus.COMPLETED) {
    throw new BadRequestException('Cannot update a completed appointment');
  }

  // Proceed with update...
  // (existing conflict checking and update logic)
}
```

### 8. Optional: Complete Appointment Endpoint

```typescript
// In receptionist.controller.ts or doctor.controller.ts
@Patch('appointments/:id/complete')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(Role.RECEPTIONIST, Role.DOCTOR)
async completeAppointment(@Param('id') id: string, @GetUser('userId') userId: string) {
  return this.appointmentService.completeAppointment(id, userId);
}

// In appointment.service.ts
async completeAppointment(appointmentId: string, userId: string) {
  const appointment = await this.prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { clinic: true },
  });

  if (!appointment) {
    throw new NotFoundException('Appointment not found');
  }

  // Only SCHEDULED appointments can be completed
  if (appointment.status !== AppointmentStatus.SCHEDULED) {
    throw new BadRequestException('Only scheduled appointments can be completed');
  }

  // Verify authorization (doctor or receptionist at the clinic)
  // ... authorization logic ...

  return this.prisma.appointment.update({
    where: { id: appointmentId },
    data: { 
      status: AppointmentStatus.COMPLETED,
      // Optionally add: completedAt: new Date()
    },
    include: {
      doctor: true,
      clinic: true,
      patient: true,
    },
  });
}
```

## DTOs to Update

```typescript
// create-appointment.dto.ts
export class CreateAppointmentDto {
  @IsString()
  clinicId: string;

  @IsString()
  doctorId: string;

  @IsString()
  @IsOptional()
  patientId?: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsString()
  @IsOptional()
  notes?: string;

  // Do NOT include status in DTO - it's set by the service layer
}

// update-appointment.dto.ts
export class UpdateAppointmentDto {
  @IsDateString()
  @IsOptional()
  startTime?: string;

  @IsDateString()
  @IsOptional()
  endTime?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  // Do NOT allow status updates via this DTO
  // Status changes via dedicated endpoints only
}
```

## Testing Checklist

### Patient Flow
- [ ] Patient creates appointment → Status is PENDING
- [ ] Patient sees "Appointment request sent!" message
- [ ] Patient can edit PENDING appointment
- [ ] Patient can cancel PENDING appointment
- [ ] Patient cannot edit COMPLETED appointment
- [ ] Patient cannot edit CANCELLED appointment

### Receptionist Flow  
- [ ] Receptionist creates appointment → Status is SCHEDULED
- [ ] Receptionist sees pending appointments (PENDING status only)
- [ ] Receptionist accepts pending appointment → Status becomes SCHEDULED
- [ ] Receptionist can cancel PENDING appointments
- [ ] Receptionist can cancel SCHEDULED appointments
- [ ] Accepted appointments no longer appear in pending list

### General
- [ ] Status transitions follow the allowed flow
- [ ] Cannot transition from COMPLETED to any other status
- [ ] Cannot transition from CANCELLED to any other status
- [ ] Appointment updates respect status restrictions
- [ ] Status badges display correctly in UI
