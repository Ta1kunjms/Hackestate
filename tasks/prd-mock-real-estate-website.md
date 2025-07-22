# PRD: Mock Real-Estate Website

## 1. Introduction/Overview

This document outlines the requirements for a mock real-estate website designed to showcase property listings and provide a Zillow-style search and browsing experience. The site targets all users (buyers, renters, agents) and will use static mock data for listings. The MVP will focus on property search/filter, property detail pages, contact/lead forms, and image galleries, with a layout and style inspired by Zillow.

## 2. Goals

- Allow users to search and filter property listings by key criteria (price, location, type, etc.)
- Display property listings in a visually appealing, responsive layout
- Provide detailed property pages with image galleries
- Enable users to contact agents or submit leads via forms
- Mimic the look and feel of Zillow for familiarity

## 3. User Stories

- As a homebuyer, I want to open the website and be able to filter listings directly in the hero section, so I can easily find properties that match my criteria.
- As a user, I want to view a list of property cards below the search/filter so I can browse available homes.
- As a user, I want to click on a property to see more details and images.
- As a user, I want to fill out a contact form on a property page to reach out to the agent.

## 4. Functional Requirements

1. The system must display a hero section with search/filter controls (price, location, property type, etc.)
2. The system must show a list of property cards below the hero section, updating in real time as filters are applied
3. Each property card must display key info: image, price, address, beds, baths, sqft
4. Clicking a property card must open a detail page with full info and an image gallery
5. The detail page must include a contact/lead form for user inquiries
6. The system must use static mock data for all listings in the MVP
7. The UI must be responsive and styled to resemble Zillow
8. The site must be built with React and Next.js

## 5. Non-Goals (Out of Scope)

- No payments or transaction processing
- No user authentication or account creation
- No scheduling or calendar integration
- No admin panel or listing management in MVP
- No map integration in MVP

## 6. Design Considerations (Optional)

- Follow Zillow’s layout and color scheme for familiarity
- Hero section with prominent search/filter controls
- Listings grid below hero, responsive for mobile/desktop
- Clean, modern typography and spacing
- Image gallery on detail page with swipe/arrow navigation

## 7. Technical Considerations (Optional)

- Use React and Next.js for all pages/components
- Use static mock data (JSON or JS file) for property listings
- Use functional components and hooks
- Use CSS modules or styled-components for styling
- Ensure accessibility (alt text, keyboard navigation)

## 8. Success Metrics

- All features work as described
- Site is visually similar to Zillow
- Responsive and usable on mobile and desktop
- Users can filter, browse, view details, and submit contact forms without errors

## 9. Open Questions

- What fields should be required in the contact/lead form?
- Should there be pagination or infinite scroll for listings?
- Should the hero filter support advanced options (e.g., min/max sqft, year built) in MVP? 