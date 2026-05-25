# Security Specification

## 1. Data Invariants
- **Users**: A user document must exist and its ID must strictly match the authenticated user's ID. Roles (e.g., student, admin) cannot be self-assigned during creation or updated by the user themselves.
- **Courses**: Information about courses should be read-only for students and only modifiable by administrators.
- **Enrollments**: A student can only register themselves for a course. An enrollment document must link valid `userId` with `courseId`. The `userId` must match the creator.
- **Tasks/Assignments**: Tasks belong to courses. Read access is available to enrolled students.
- **Grades**: Grades are strictly read-only for the student mapping to `studentId`, and can only be authored by instructors or admins.

## 2. Setting the "Dirty Dozen" Payloads

1. **Spoofed Identity Update**: Updating a user's own `role` to `'admin'`.
2. **Missing Essential Fields**: Creating a user profile missing `email`.
3. **Cross-User Write**: A student creates an enrollment for another `userId`.
4. **Invalid Value Type**: Setting `credits` in a course as a massive string.
5. **Unauthorized Status Modification**: A student setting an assignment grade to 'A'.
6. **Orphaned Writes**: Creating an enrollment for a `courseId` that doesn't exist.
7. **PII Blanket Read**: Querying `/users` collection for a list of all names/emails without being an admin.
8. **Recursive Array DoW**: Submitting an array of prerequisites with 1 million items to crash the DB parser.
9. **Creation Shadow Field**: Adding an allowed property plus `isVerified: true` maliciously during create.
10. **Client-Trusted ID List**: Listing enrollments passing `userId` via query without checking `resource.data`.
11. **Spoofed Email Constraint**: Modifying the document with another's admin email, but with `email_verified: false` from auth token.
12. **Immutable Field Tamper**: Changing the `createdAt` timestamp during an update.

## 3. Test Runner
Will be implemented under `firestore.rules.test.ts`.
