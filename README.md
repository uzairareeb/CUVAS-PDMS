
# Postgraduate Data Management System (PDMS)
## Directorate of Advanced Studies

This system is designed for internal use by the Directorate of Advanced Studies to manage postgraduate student progress, milestones, and official notifications.

### Features
1. **Student Management**: Full CRUD for student records with exact departmental fields.
2. **Milestone Tracking**: Automatic calculation of GS forms and thesis deadlines.
3. **Notification System**: Generation of official DAS letters for student progress notifications.
4. **Bulk Import**: Import student lists via CSV.
5. **Dashboard Analytics**: Real-time stats on degree distribution, department counts, and overdue tasks.
6. **Audit Trail**: Security logging of all staff actions.

### Local Setup (XAMPP Environment)
1. **Database Setup**:
   - Open phpMyAdmin.
   - Create a new database named `das_pdms`.
   - Import the provided `db_schema.sql` file.
   
2. **Frontend Preview**:
   - This version is provided as a modern React SPA for high-performance interaction.
   - For a PHP implementation, use the `db_schema.sql` to build your PDO models based on the logic provided in `store.tsx`.

3. **Login Credentials**:
   - Username: `admin`
   - Password: `any` (Simulated in preview environment)

### Usage Guide
- **Adding Students**: Navigate to 'Students' and click 'Add New Student'. Fill in all fields including Registration Number and Session.
- **Milestones**: Milestones are auto-calculated based on the Session Start Date. You can manually mark them as completed in the Student Profile.
- **Notifications**: Go to a student's profile and click 'Generate Letter' to produce a professional PDF-ready notification.
- **Bulk Import**: Use the 'Bulk Upload' section to process large batches of student data.

### Compliance
The system follows official government-style UI requirements, prioritizing clarity, professionalism, and ease of use for administrative staff.
