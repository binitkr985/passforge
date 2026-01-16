# 🔐 PassForge

**PassForge** is a modern, human-centric password generator built with **Next.js (App Router)**, **Tailwind CSS**, and **ShadCN UI**.

Unlike traditional generators that focus only on randomness, PassForge is designed around **how humans actually remember and type passwords**, while still maintaining strong security guarantees.

---

## 🚀 Versions Overview

PassForge is structured as **multiple generations**, each solving a different problem.

### 🔹 v1 — Basic Generator

A classic password generator with:

* Length control
* Character set toggles
* Strength indicator
* Dark mode

📍 Route: `/v1`

---

### 🔹 v2 — Enhanced Classic Generator

An improved version of v1 with:

* Cleaner UI
* Better feedback and polish
* Refined strength calculation

📍 Route: `/v2`

---

### 🔹 v3 — Smart / Human-Memorable Generator (Current)

The flagship version of PassForge.

Instead of generating random strings, v3 **derives secure passwords from user-memorable input**, while ensuring:

* Keyboard safety
* Platform separation
* Predictable UX

📍 Route: `/` (root)

---

## ✨ Key Features (v3)

* 🧠 **Human-Memorable Password Derivation**
  Generate strong passwords from a base phrase you already remember.

* 🧩 **Platform Presets + Custom Support**
  Choose common platforms (Discord, GitHub, Banking, Social)
  or define **any custom site** (for the millions of lesser-known services).

* 🎚️ **Strength Dial with Read-Only Comparison**
  Preview multiple strength levels **without regenerating**.
  Move the slider to compare, move it back to restore the original password.

* 🔁 **Deterministic Recovery Mode (Optional)**
  Same inputs + master key = same password.
  No storage. No backend.

* ⌨️ **100% Keyboard-Safe (ASCII-Only)**
  Every generated password is typeable on:

  * Laptops
  * Desktops
  * Public computers
  * Terminals

* 🧠 **Live Metrics per Variant**

  * Strength classification
  * Memorability score
  * Typability guarantee

* ⚠️ **Anti-Pattern Warnings**
  Detects:

  * Common sequences
  * Weak base passwords
  * Reuse per platform (local only)

* 📋 **One-Click Copy**
  With visual confirmation.

* 🌙 **Dark / Light Mode**
  Clean and consistent across all versions.

---

## 🗂 Project Structure

```txt
src/
 ├─ app/
 │   ├─ v1/        → Basic generator
 │   ├─ v2/        → Enhanced classic generator
 │   ├─ page.jsx   → PassForge v3 (smart generator)
 │   ├─ layout.jsx
 │   └─ globals.css
 ├─ components/
 └─ lib/
public/
```

---

## 🧠 Security & Privacy

* ✅ Fully client-side
* ✅ No backend
* ✅ No analytics
* ✅ No password storage
* ✅ No network calls

All password generation happens **locally in your browser**.

---

## ⚠️ Browser Password Managers (Important Note)

PassForge **does not and cannot** directly save passwords into browser vaults for other domains.

This is an **intentional browser security restriction**.

Correct usage:

1. Generate a password in PassForge
2. Paste it into the target site
3. Let the browser prompt you naturally

This design avoids misleading or insecure behavior.

---

## 🛠 Tech Stack

* **Next.js (App Router)**
* **React**
* **Tailwind CSS**
* **ShadCN UI**
* **Lucide Icons**

---

## 🌐 Live Demo

🔗 [https://passforge-alpha.vercel.app/](https://passforge-alpha.vercel.app/)

---

## 👤 Author

Built by **[Binit Kr](https://github.com/binitkr985)**
A project focused on **practical security, honest UX, and human-first design**.
