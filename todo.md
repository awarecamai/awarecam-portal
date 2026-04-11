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
