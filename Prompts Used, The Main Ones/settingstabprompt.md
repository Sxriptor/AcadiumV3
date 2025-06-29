# profilesettingsprompt.md

## 🎯 GOAL:
Build a **Settings section** with 6 functional tabs for the existing Vibe School dashboard. These tabs should integrate seamlessly with the current design system and layout — dark theme, modern aesthetics, clean spacing, and responsive components.

## 🧠 CONTEXT:
The dashboard is already designed with slate blacks, accent purples/greens, Inter or Satoshi fonts, and futuristic spacing. This Settings interface should match that styling — do **not** introduce new themes or off-brand visuals.

---

## ✅ STRUCTURE: 6 Tabs

### 1. Profile Settings
**Purpose**: Let users update basic identity info  
**Fields**:
- Profile picture (upload/change)
- Display name
- Username
- Email address
- Bio (multiline input)
- Social links (Twitter, GitHub, Discord, etc.)
- ✅ Save Changes button

---

### 2. Notifications
**Purpose**: Allow fine-grained notification control  
**Options**:
- Toggle: Course announcements  
- Toggle: AI assistant messages  
- Toggle: Weekly performance summary  
- Toggle: Community replies / mentions  
- ✅ Save Notification Settings

---

### 3. Security
**Purpose**: Manage account security  
**Features**:
- Change password (3 fields: current, new, confirm)
- Toggle: Enable 2FA (with modal if needed)
- Section: View active sessions (device/location/option to revoke)
- Linked accounts (Google, Discord, GitHub) — with revoke option
- Danger Zone: Delete account (confirmation modal)

---

### 4. Appearance
**Purpose**: Customize UI experience  
**Controls**:
- Theme toggle (Light / Dark / System — default to Dark)
- Font size selector (Small / Normal / Large)
- UI density toggle (Comfortable / Compact)
- Optional: Primary accent selector (within approved colors)
- ✅ Save Appearance Settings

---

### 5. Billing
**Purpose**: Display and manage subscription/payments  
**Info Display**:
- Current plan (There is only one plan) still show what plan they are as like "active" 
- Next renewal date
- Payment method (view/edit)
- Action buttons: Upgrade / Cancel Plan
- Invoices (table or cards with download links)

---

### 6. Help & Support
**Purpose**: User assistance hub  
**Sections**:
- FAQ / Help Center link
- "Contact Support" button (modal or link to form)
- Report a bug (form: title, description)
- Submit a feature request (optional)
- Link to join or open Community Discord

---

## ✨ STYLE & UX REQUIREMENTS:

- Match **existing dashboard theme**

- Tabs UI:
  - Horizontal or vertical navigation (consistent with rest of dashboard)
  - Use icons (optional) to enhance navigation clarity
- Inputs & buttons:
  - Rounded, spacious, clean
  - Use same button components as dashboard
- Interactions:
  - Smooth transitions between tabs
  - Auto-save or Save buttons depending on UX flow
  - Modals for destructive actions (e.g., delete account, revoke session)

---

## 🔁 OPTIONAL ENHANCEMENTS:
- Toast notifications on save success/error


