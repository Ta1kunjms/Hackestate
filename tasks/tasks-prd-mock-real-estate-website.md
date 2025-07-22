## Relevant Files

- `src/components/HeroFilter/HeroFilter.tsx` - Hero section with search/filter controls
- `src/components/HeroFilter/HeroFilter.test.tsx` - Unit tests for hero filter
- `src/components/PropertyList/PropertyList.tsx` - Property listings grid
- `src/components/PropertyList/PropertyList.test.tsx` - Unit tests for property list
- `src/components/PropertyCard/PropertyCard.tsx` - Individual property card
- `src/components/PropertyCard/PropertyCard.test.tsx` - Unit tests for property card
- `src/components/PropertyDetail/PropertyDetail.tsx` - Property detail page with image gallery
- `src/components/PropertyDetail/PropertyDetail.test.tsx` - Unit tests for property detail
- `src/components/ContactForm/ContactForm.tsx` - Contact/lead form on property detail page
- `src/components/ContactForm/ContactForm.test.tsx` - Unit tests for contact form
- `src/data/properties.ts` - Static mock data for property listings
- `src/styles/` - CSS modules or styled-components for site styling

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Tasks

- [ ] 1.0 Build hero section with search/filter controls
  - [ ] 1.1 Design and implement hero section layout
  - [ ] 1.2 Add filter controls (price, location, property type, etc.)
  - [ ] 1.3 Connect filter controls to property data
  - [ ] 1.4 Write unit tests for hero filter functionality
- [ ] 2.0 Implement property listings grid and real-time filtering
  - [ ] 2.1 Create property listings grid component
  - [ ] 2.2 Render property cards based on filtered data
  - [ ] 2.3 Ensure real-time updates as filters change
  - [ ] 2.4 Write unit tests for property list and filtering
- [ ] 3.0 Create property detail page with image gallery
  - [ ] 3.1 Build property detail page layout
  - [ ] 3.2 Display all property info (price, address, beds, baths, sqft, description)
  - [ ] 3.3 Implement image gallery with navigation
  - [ ] 3.4 Write unit tests for property detail and gallery
- [ ] 4.0 Add contact/lead form to property detail page
  - [ ] 4.1 Design and implement contact/lead form
  - [ ] 4.2 Validate form fields and handle submission
  - [ ] 4.3 Display confirmation or error messages
  - [ ] 4.4 Write unit tests for contact form
- [ ] 5.0 Style site to match Zillow and ensure responsiveness
  - [ ] 5.1 Apply Zillow-inspired styles to all components
  - [ ] 5.2 Ensure responsive layout for mobile and desktop
  - [ ] 5.3 Use modern typography and spacing
  - [ ] 5.4 Test site appearance on multiple devices
- [ ] 6.0 Integrate static mock data for all listings
  - [ ] 6.1 Create static mock data file for properties
  - [ ] 6.2 Connect all components to use mock data
  - [ ] 6.3 Write unit tests for data integration
- [ ] 7.0 Ensure accessibility and usability across devices
  - [ ] 7.1 Add alt text to all images
  - [ ] 7.2 Ensure keyboard navigation for all controls
  - [ ] 7.3 Test and fix accessibility issues (a11y)
  - [ ] 7.4 Write unit tests for accessibility features 