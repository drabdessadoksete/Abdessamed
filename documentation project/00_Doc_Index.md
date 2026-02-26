## Project Documentation Index

This documentation suite describes the full architecture of the **Cabinet Dentaire Dr. Abdessadok** web application.  
It is written so that any developer or AI agent can:
- Understand how the system is structured end‑to‑end
- Safely modify, add, or remove features
- Migrate the stack to new infrastructure
- Rebuild the same architecture for a different business niche (white‑label)

The project is a modern React single‑page application (SPA) built with **Vite**, styled with **Tailwind CSS**, and backed primarily by **Supabase** (PostgreSQL + Storage + Auth).  
There is also a local **Express** server for file‑based data storage that can be used as an alternative backend.

---

## How to Use This Documentation

Recommended reading order:

1. **01_Architecture_Overview.md**  
   High‑level mental model: what runs where, how data flows, and which technologies are involved.  
   Read this first to understand the big picture before touching code.

2. **02_Frontend_Structure.md**  
   Deep dive into the React/Vite front‑end: routing, components, i18n, styling and how UI pieces fit together.  
   Use this when you need to change UI, navigation, interactions, or add a new page/component.

3. **03_Backend_and_Data.md**  
   Explains the data layer and backend options:
   - Supabase tables, storage, and auth used by the live app
   - The optional Express JSON‑file backend under `server/`  
   Use this when adding new entities, changing data models, or wiring new API functionality.

4. **04_Payment_Integration.md**  
   This project currently **does not implement any payment integration**.  
   The file documents this fact and provides a template for how to add a payment gateway cleanly on top of the existing architecture.

5. **05_Rebuild_Template.md**  
   A prescriptive “fill‑in‑the‑blanks” blueprint for cloning this architecture:
   - Which environment variables, API keys and secrets are required
   - Which brand elements (logos, colors, text content) to replace
   - How to recreate the Supabase schema and optional Express backend
   - A step‑by‑step checklist to white‑label the system for another clinic or an entirely different business niche  
   Use this file as the main runbook when rebuilding or duplicating the project.

---

## Directory / Files Overview

- **00_Doc_Index.md** (this file)  
  Entry point and table of contents for the documentation set.

- **01_Architecture_Overview.md**  
  High‑level system architecture, tech stack, environments, and runtime responsibilities.

- **02_Frontend_Structure.md**  
  Front‑end folder structure, routing, major components, i18n, and styling conventions.

- **03_Backend_and_Data.md**  
  Supabase data model, storage buckets, authentication, plus the optional Express/JSON backend and its REST endpoints.

- **04_Payment_Integration.md**  
  States that no payment provider is wired in today; includes a design template for future payment integration.

- **05_Rebuild_Template.md**  
  Concrete checklist and placeholders to rebuild this system for a new brand or business domain.

Keep this documentation in sync with the codebase. When you introduce a new major feature, endpoint, or external provider, update the relevant file(s) and, if necessary, extend the rebuild template.

