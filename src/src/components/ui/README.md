# UI Components Documentation

This directory contains reusable UI components built with Material Tailwind for the real estate website. All components use Tailwind CSS utilities and follow Material Design principles.

## Available Components

### Button

**File:** `Button.tsx`

A flexible button component with multiple variants, sizes, and colors.

**Props:**
- `variant`: `'filled' | 'outlined' | 'text' | 'gradient'` (default: `'filled'`)
- `size`: `'sm' | 'md' | 'lg'` (default: `'md'`)
- `color`: `'blue' | 'green' | 'red' | 'gray' | 'blue-gray'` (default: `'blue'`)
- `fullWidth`: `boolean` (default: `false`)
- `disabled`: `boolean` (default: `false`)
- `loading`: `boolean` (default: `false`) - Shows spinner
- `onClick`: `() => void`
- `type`: `'button' | 'submit' | 'reset'` (default: `'button'`)
- `className`: `string` - Additional CSS classes

**Usage Examples:**
```tsx
import { Button } from '@/components/ui';

// Primary button
<Button variant="filled" color="blue">Get Started</Button>

// Secondary button
<Button variant="outlined" color="green">Learn More</Button>

// Text button
<Button variant="text" color="gray">Cancel</Button>

// Loading state
<Button loading>Submitting...</Button>

// Full width
<Button fullWidth>Contact Agent</Button>
```

**Real Estate Specific Variants:**
- Primary CTA: `variant="filled" color="blue"`
- Secondary CTA: `variant="outlined" color="green"`
- Danger/Delete: `variant="filled" color="red"`
- Ghost/Cancel: `variant="text" color="gray"`

---

### Input

**File:** `Input.tsx`

A form input component with label, validation states, and icons.

**Props:**
- `type`: `'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'` (default: `'text'`)
- `placeholder`: `string`
- `label`: `string`
- `value`: `string`
- `defaultValue`: `string`
- `onChange`: `(e: React.ChangeEvent<HTMLInputElement>) => void`
- `onBlur`: `(e: React.FocusEvent<HTMLInputElement>) => void`
- `disabled`: `boolean` (default: `false`)
- `required`: `boolean` (default: `false`)
- `error`: `boolean` (default: `false`)
- `success`: `boolean` (default: `false`)
- `size`: `'md' | 'lg'` (default: `'md'`)
- `variant`: `'outlined' | 'standard' | 'static'` (default: `'outlined'`)
- `color`: `'blue' | 'green' | 'red' | 'gray'` (default: `'blue'`)
- `icon`: `React.ReactNode`
- `className`: `string`

**Usage Examples:**
```tsx
import { Input } from '@/components/ui';

// Basic input
<Input label="Email Address" type="email" placeholder="Enter your email" />

// With validation
<Input label="Phone" type="tel" error={hasError} />

// Search input
<Input type="search" placeholder="Search properties..." />

// With icon
<Input 
  label="Location" 
  icon={<MapPinIcon className="h-5 w-5" />}
  placeholder="Enter city or zip code"
/>
```

---

### Card

**File:** `Card.tsx`

A flexible card component with header, body, and footer sections.

**Components:**
- `Card` - Main container
- `CardHeader` - Header section
- `CardBody` - Content section  
- `CardFooter` - Footer section

**Card Props:**
- `shadow`: `boolean` (default: `true`)
- `variant`: `'filled' | 'gradient'` (default: `'filled'`)
- `color`: `'transparent' | 'white' | 'gray'` (default: `'white'`)
- `className`: `string`

**Usage Examples:**
```tsx
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui';

// Property card
<Card className="max-w-sm">
  <CardHeader color="blue" className="relative h-56">
    <img src="property.jpg" alt="Property" className="h-full w-full object-cover" />
  </CardHeader>
  <CardBody>
    <h3 className="price-display">$599,000</h3>
    <p className="text-gray-600">Beautiful 3BR/2BA home in downtown</p>
  </CardBody>
  <CardFooter>
    <Button fullWidth>View Details</Button>
  </CardFooter>
</Card>

// Simple content card
<Card>
  <CardBody>
    <h4 className="text-lg font-semibold mb-2">Featured Listing</h4>
    <p>Discover our handpicked selection of premium properties.</p>
  </CardBody>
</Card>
```

**Real Estate Variants:**
- Property listings: Use with `CardHeader` for images
- Agent profiles: Square format with avatar
- Feature cards: Text-only with `CardBody`

---

### Modal

**File:** `Modal.tsx`

A dialog/modal component for forms, confirmations, and detailed views.

**Props:**
- `open`: `boolean` - Controls visibility
- `onClose`: `() => void` - Close handler
- `title`: `string` - Optional header title
- `footer`: `React.ReactNode` - Optional footer content
- `size`: `'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'` (default: `'md'`)
- `dismissible`: `boolean` (default: `true`) - Allow closing by clicking outside
- `className`: `string`

**Usage Examples:**
```tsx
import { Modal, Button } from '@/components/ui';

// Contact form modal
<Modal
  open={isContactOpen}
  onClose={() => setIsContactOpen(false)}
  title="Contact Agent"
  size="lg"
  footer={
    <div className="flex gap-2">
      <Button variant="text" onClick={() => setIsContactOpen(false)}>
        Cancel
      </Button>
      <Button type="submit">Send Message</Button>
    </div>
  }
>
  <ContactForm />
</Modal>

// Confirmation modal
<Modal
  open={showConfirm}
  onClose={() => setShowConfirm(false)}
  title="Delete Property"
  size="sm"
  footer={
    <div className="flex gap-2">
      <Button variant="outlined" onClick={() => setShowConfirm(false)}>
        Cancel
      </Button>
      <Button color="red" onClick={handleDelete}>
        Delete
      </Button>
    </div>
  }
>
  <p>Are you sure you want to delete this property? This action cannot be undone.</p>
</Modal>
```

---

### Form Components

**File:** `Form.tsx`

Form-related components including Select dropdown and Textarea.

#### Select

**Props:**
- `label`: `string`
- `value`: `string`
- `onChange`: `(value?: string) => void`
- `placeholder`: `string`
- `disabled`: `boolean` (default: `false`)
- `error`: `boolean` (default: `false`)
- `size`: `'md' | 'lg'` (default: `'md'`)
- `variant`: `'outlined' | 'standard' | 'static'` (default: `'outlined'`)
- `color`: `'blue' | 'green' | 'red' | 'gray'` (default: `'blue'`)

#### SelectOption

**Props:**
- `value`: `string`
- `disabled`: `boolean` (default: `false`)

#### Textarea

**Props:**
- `label`: `string`
- `placeholder`: `string`
- `value`: `string`
- `defaultValue`: `string`
- `onChange`: `(e: React.ChangeEvent<HTMLTextAreaElement>) => void`
- `rows`: `number` (default: `4`)
- `disabled`: `boolean` (default: `false`)
- `error`: `boolean` (default: `false`)
- (Plus all other Input-like props)

**Usage Examples:**
```tsx
import { Select, SelectOption, Textarea } from '@/components/ui';

// Property type selector
<Select label="Property Type" value={propertyType} onChange={setPropertyType}>
  <SelectOption value="house">House</SelectOption>
  <SelectOption value="condo">Condo</SelectOption>
  <SelectOption value="townhouse">Townhouse</SelectOption>
  <SelectOption value="land">Land</SelectOption>
</Select>

// Message textarea
<Textarea
  label="Message"
  placeholder="Tell us about your property needs..."
  rows={6}
  value={message}
  onChange={(e) => setMessage(e.target.value)}
/>
```

---

## Custom CSS Classes

In addition to the React components, we have custom CSS utility classes in `index.css`:

### Typography Classes
- `.headline-xl` - Extra large headings (4xl-6xl)
- `.headline-lg` - Large headings (3xl-5xl)
- `.headline-md` - Medium headings (2xl-3xl)
- `.body-lg` - Large body text
- `.body-md` - Medium body text
- `.caption` - Small caption text

### Property-Specific Classes
- `.property-card` - Base property card styling
- `.property-card-featured` - Featured property variant
- `.price-display` - Property price styling (2xl-3xl)
- `.price-display-large` - Large price display (3xl-4xl)
- `.property-features` - Flex container for feature tags
- `.feature-tag` - Individual feature tag styling

### Status Badges
- `.property-status-badge` - Base badge styling
- `.status-new` - Green badge for new properties
- `.status-sold` - Red badge for sold properties
- `.status-featured` - Blue badge for featured properties
- `.status-pending` - Yellow badge for pending sales

### Layout Classes
- `.container-sm` - Small container (max-w-2xl)
- `.container-md` - Medium container (max-w-4xl)
- `.container-lg` - Large container (max-w-6xl)
- `.container-xl` - Extra large container (max-w-7xl)
- `.property-grid` - 1-3 column responsive grid
- `.property-grid-large` - 1-2 column responsive grid
- `.agent-grid` - 1-4 column responsive grid

### Form Classes
- `.form-group` - Form field spacing
- `.form-label` - Form label styling
- `.form-input` - Base input styling
- `.form-input-error` - Error state input
- `.form-error` - Error message styling
- `.form-help` - Help text styling

### Navigation Classes
- `.nav-link` - Base navigation link
- `.nav-link-active` - Active navigation state

### Utility Classes
- `.section-padding` - Standard section spacing (py-12 lg:py-20)
- `.card-padding` - Standard card padding (p-6 lg:p-8)
- `.aspect-property` - 4:3 aspect ratio for property images
- `.aspect-property-wide` - 16:9 aspect ratio for wide property images
- `.aspect-agent` - 1:1 aspect ratio for agent photos
- `.truncate-2-lines` - Truncate text to 2 lines
- `.truncate-3-lines` - Truncate text to 3 lines

---

## Color Palette

The components use a custom color palette defined in `tailwind.config.js`:

- **Primary (Blue)**: Main brand color for CTAs and links
- **Secondary (Green)**: Success states and secondary actions
- **Accent (Purple)**: Special highlights and featured content
- **Neutral (Gray)**: Text, borders, and background colors

---

## Usage Guidelines

### Importing Components
```tsx
// Import individual components
import { Button, Input, Card } from '@/components/ui';

// Import with types
import { Button, type ButtonProps } from '@/components/ui';
```

### Consistency Guidelines
1. Use `primary` color for main CTAs
2. Use `secondary` color for less important actions
3. Always include loading states for async actions
4. Use proper semantic HTML (`button`, `input`, etc.)
5. Include proper accessibility attributes
6. Follow the established spacing scale (4, 6, 8, 12, 16, 20, 24)

### Real Estate Specific Usage
- Property cards should use `aspect-property` or `aspect-property-wide`
- Price displays should use `.price-display` or `.price-display-large`
- Status badges should use appropriate `.status-*` classes
- Use `.property-grid` for listing layouts
- Agent photos should use `.aspect-agent` (1:1 ratio)

---

## Examples Directory

See the `Example.tsx` file for live component demonstrations and usage patterns. 