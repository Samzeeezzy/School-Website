# Smart Amazing School Pulse — GitHub starter

This is a responsive **frontend prototype** for the school management system. It includes a dashboard preview for Founder, Admin, Teacher, and Parent, with sample student/teacher/parent records, subjects, fee summaries, CA/examination scores, and a complaint form fallback.

## Files
- `index.html` — app entry page
- `style.css` — responsive styling
- `app.js` — demo data and frontend interactions

## Run locally
Open `index.html` in a modern browser, or use VS Code Live Server.

## Publish on GitHub Pages
1. Create a GitHub repository, for example `smart-amazing-school-pulse`.
2. Upload `index.html`, `style.css`, `app.js`, and `README.md` to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`, then save.
6. Wait for GitHub Pages to publish the site.

## Important production limitations
This is a frontend demo, not a secure production school management system.

- The role selector is for preview only. It is **not authentication** and must not be used to protect real student records.
- Data is saved in the current browser's `localStorage`; it is not shared between devices and is not a central database.
- Parent registration, identity verification, and child-to-parent linking need a backend and secure authentication.
- Founder/Admin/Teacher permissions must be enforced server-side.
- Real payments need a payment provider and server-side verification. This demo does not collect money.
- Automatic complaint email delivery needs a backend email service (for example, Resend or SMTP) and a school recipient address. Do not put API keys or SMTP passwords in `app.js`. The current form can open the user's default email app, but does not send automatically.
- Before real use, add a secure backend/database, audit logs, input validation, backups, access controls, and privacy safeguards.

This starter is designed to help preview the interface and begin organizing the GitHub frontend. It does not automatically import or replace your existing Base44 project files.
