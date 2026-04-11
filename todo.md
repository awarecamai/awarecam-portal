# AwareCam Partner Portal — TODO

## Phase 2: Database Schema & Global Styles
- [x] Extend drizzle schema: roles, documents, access_logs, chat_messages
- [x] Apply database migration
- [x] Set global color palette, typography, dark theme in index.css
- [x] Update index.html with fonts

## Phase 3: Auth & Dashboard Layout
- [x] Role-based routing (reseller, end_user, admin)
- [x] Login / landing page
- [x] PortalLayout with role-aware sidebar navigation
- [x] Language context (EN/HE) with RTL support

## Phase 4: Document Library
- [x] Document library page with category tabs (Legal, Setup Guides, Sales Training, Technical Reference)
- [x] In-browser markdown preview modal
- [x] Download button per document
- [x] Language toggle surfaces Hebrew docs for integrators

## Phase 5: AI Assistant
- [x] AI chat page with quick-start prompts
- [x] System prompt: onboarding, camera compatibility, plan comparison, quote generation
- [x] Quote generator flow (camera count, plan tier, add-ons)
- [x] Formatted price breakdown output (wholesale + retail)
- [x] Persist chat history in DB per user

## Phase 6: Installation Guides & Sales Training
- [x] Visual installation guide: Kiosk (Raspberry Pi)
- [x] Visual installation guide: Windows Edge Device
- [x] Visual installation guide: Direct RTSP
- [x] Troubleshooting section per guide
- [x] Sales training page: objection handling
- [x] Sales training page: industry brochures (Cannabis, Construction, Education, Mining, Oil & Gas)
- [x] Platform presentation materials (6-slide deck)

## Phase 7: Admin Dashboard
- [x] User management table (list, assign roles, deactivate)
- [x] Resource access activity log per user
- [x] Admin-only route guard

## Phase 8: Delivery
- [ ] Run vitest
- [ ] Save checkpoint
- [ ] Deliver live preview link

## Phase 9: Document Library Seeding
- [x] Read all 22 AwareCam markdown docs and extract content
- [x] Write seed script to insert all documents into the DB
- [x] Run seed script and verify documents appear in the portal

## Phase 10: Installation Guides Rebuild
- [x] Full Base44 account creation walkthrough (step-by-step with screenshots)
- [x] Base44 onboarding flow (add site, add cameras, configure AI agents)
- [x] Kiosk (Raspberry Pi) full install guide with images
- [x] Windows Edge Device full install guide with images
- [x] Direct RTSP (cloud-only) full install guide with images
- [x] Troubleshooting section for each deployment type
- [x] Fix nested anchor tag hydration error in PortalLayout

## Phase 11: Logo Integration
- [x] Extract AwareCam logo from awarecam.com
- [x] Upload logo to CDN
- [x] Add logo to portal sidebar, login page, and favicon
- [x] Add logo to all markdown documentation files

## Phase 12: Full Product Guide & Base44 Removal
- [x] Visit app.awarecam.com and capture screenshots of all key screens
- [x] Upload all screenshots to CDN
- [x] Remove all Base44 references from portal code (Installation.tsx, seeder, docs)
- [x] Replace app.awarecam.com references throughout (was Base44)
- [x] Rebuild Installation Guides as full A-to-Z product guide with real screenshots
- [x] Cover: account creation, add site, add camera, draw zone/fence, select AI agents, setup email/SMS alerts, view alerts
