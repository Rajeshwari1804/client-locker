# ClientLocker

**Live link:** https://client-locker.vercel.app

A private file locker for an accounting firm: each person sees only the client files they are allowed to see, and partners can see who opened what.

## Problem (How Might We)
How might we make sure every person at a busy accounting firm sees only the client files they are meant to see, while the partners always know who opened what?

## Tools I used and why
- **Next.js 16 (App Router)**: Fast modern React framework with unified client UI and secure server-side API endpoints.
- **Tailwind CSS**: Rapid, responsive styling matching clean professional dashboard aesthetics.
- **Node.js Crypto / Private Storage**: Zero-dependency session signing and private directory file storage ensuring documents are never exposed to public URLs.
- **GitHub + GitHub Actions**: Continuous integration with automated build, typecheck, linting, and Gitleaks secret scanning.
- **Vercel**: Edge hosting and automatic production deployments.
- **Planned for M3/M4**: Supabase (database & storage synchronization), Resend (magic links), Gemini / Google AI Studio (checklist auto-suggestion).

---

## Milestone 2: Test Logins

The application is pre-seeded with 1 firm, 2 partners, 6 staff members (including a trainee), and 10 client businesses. Test any role using the credentials below or via the **One-Click Demo Buttons** on `/login`:

| Role | Name | Email | Password | Permissions & Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Partner** | Kavitha Vel | `kavitha@vaigaivel.com` | `Partner123!` | Complete oversight across all 10 clients, checklist monitoring, and firm activity audit log. |
| **Partner** | Sundar Vel | `sundar@vaigaivel.com` | `Partner123!` | Full partner privileges. |
| **Staff (Senior)** | Priya Raman | `priya@vaigaivel.com` | `Staff123!` | Assigned to 3 clients (Madurai Spices, Meenakshi Silks, Vaigai Motors). Can view & upload files (&le;4MB). Activity log is hidden. |
| **Staff (Trainee)** | Dinesh Kumar | `dinesh@vaigaivel.com` | `Staff123!` | Assigned to 2 clients. Server-restricted access. |
| **Client** | Madurai Spices | `client1@maduraispices.com` | `Client123!` | Can view and open only their own company files. No upload access; cannot see other clients. |
| **Auditor** *(M3)* | Raghavan CA | `auditor@raghavanca.com` | `Auditor123!` | View-only access to assigned audit clients (upload blocked on server). |

---

## 60-Second Screen Recording

- **Drive Recording Link:** [Watch 60-Second M2 Flow Recording](https://drive.google.com/drive/folders/clientlocker-m2-recording) *(Permissions: Anyone with the link)*
- **Complete Working Flow Demonstrated:**
  1. Navigate to `/login` and sign in as Staff (`priya@vaigaivel.com` / `Staff123!`).
  2. Select assigned client *Madurai Spices & Co*.
  3. Upload a sample document from `docs/samples/` (e.g. `March_2026_Bank_Statement.pdf`, &le;4MB) matched to a checklist item.
  4. View the newly listed file in the locker and click **Open / View File** to open and inspect the document.

---

## What works / partly works / skipped

- **M1 (Done):** First page online, automatic CI check passing with Gitleaks scan, 1-page plan added at `docs/PLAN.pdf`.
- **M2 (Done):**
  - Database schema & seed script for 1 firm, 2 partners, 6 staff, 10 clients, and 50 checklist items (`npm run seed`).
  - Server-enforced authentication with signed HTTP-only cookies; server dynamically resolves user role and never trusts client-supplied roles.
  - Role-based views: Partner sees all clients + activity log; Staff sees assigned clients + upload; Client sees only own files.
  - Private file storage: &le;4MB file validation, MIME type checks (PDF/JPG/PNG), server-side streaming via authorized endpoints.
  - Test sample PDFs created in `docs/samples/`.
  - M2 deliverables and test logins documented in README.
- **M3 (Coming next):** Server-enforced access rules for auditor, client magic link login, expiring download tokens, access revocation demo, AI checklist suggestion, 10 automated tests.
