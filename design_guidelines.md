# AI Fitness Coach App - Design Guidelines

## Design Approach: Reference-Based
**Primary References:** Nike Training Club (energetic, motivational), MyFitnessPal (information clarity), Linear (clean interfaces, smooth interactions)

**Core Principle:** Create an energizing, motivational experience that makes fitness planning feel achievable and exciting through bold visuals and clear information hierarchy.

---

## Typography System

**Headings:**
- H1: 3xl (mobile) / 5xl (desktop), bold weight, tight leading for impact
- H2: 2xl (mobile) / 4xl (desktop), semibold, used for section headers
- H3: xl (mobile) / 2xl (desktop), semibold, for card titles and subsections
- H4: lg / xl, medium weight, for list items and exercise/meal names

**Body Text:**
- Primary: base (mobile) / lg (desktop), regular weight, relaxed leading for readability
- Secondary: sm / base, medium weight for labels and metadata
- Caption: xs / sm for timestamps, tags, supplementary info

**Font Selection:** Use a modern sans-serif pairing - geometric sans (like Inter or Outfit) for headings, humanist sans (like Source Sans) for body text

---

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24 consistently
- Micro spacing (component internals): 2-4
- Component padding: 6-8
- Section spacing: 12-20
- Major sections: 24+

**Container Strategy:**
- Full-width hero: w-full with inner max-w-7xl, px-6 md:px-12
- Content sections: max-w-6xl mx-auto, px-4 md:px-8
- Forms: max-w-2xl for optimal readability

---

## Page Structure & Layouts

### 1. Hero Section (Landing/Home)
- Full viewport height (min-h-screen) with AI-generated fitness imagery background
- Centered content with blurred backdrop for CTAs
- Primary headline: Bold statement about personalized fitness ("Your AI-Powered Fitness Journey Starts Here")
- Subheadline: Brief value proposition
- Primary CTA button with blurred background (backdrop-blur-lg with semi-transparent bg)
- Trust indicators: "Personalized Plans • AI-Powered • Voice Enabled"

### 2. Onboarding Form
- Multi-step wizard layout with progress indicator at top
- Single column, centered form (max-w-2xl)
- Group related inputs: Personal Info → Fitness Profile → Goals → Preferences
- Each step takes 60-80vh to prevent overwhelming users
- Large, touch-friendly input fields with clear labels above inputs
- Visual feedback for selections (cards with selected state for goals/preferences)
- Step indicator: Horizontal progress bar or numbered steps

### 3. Workout Plan Display
- Grid layout: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
- Exercise cards with:
  - AI-generated image at top (aspect-ratio 4:3)
  - Exercise name (H4)
  - Sets/Reps/Duration in compact badge layout
  - Difficulty indicator (Beginner/Intermediate/Advanced)
  - Click to expand for full view with large image
- Filter/sort bar above grid: Muscle group, difficulty, equipment
- Daily workout sections with day headers (H3)

### 4. Diet Plan Display
- Grid layout: 1 column (mobile), 2 columns (desktop)
- Meal cards with:
  - AI-generated food image at top (aspect-ratio 16:9)
  - Meal name and meal type badge (Breakfast/Lunch/Dinner/Snack)
  - Macros display: Calories, Protein, Carbs, Fats in compact grid
  - Ingredients list in collapsed state
  - Click to expand for detailed nutrition and preparation
- Day-by-day tabs or accordion for weekly meal plan

### 5. Image Modal/Overlay
- Full-screen overlay (dark backdrop with blur)
- Centered image with max dimensions that preserve aspect ratio
- Image details below: Exercise name/Meal name, instructions/ingredients
- Close button (X) in top-right corner
- Smooth fade-in animation

---

## Component Library

**Navigation:**
- Sticky header with logo left, primary nav center, user profile right
- Mobile: Hamburger menu with slide-in drawer
- Navigation items: Home, My Plans, Progress, Profile

**Buttons:**
- Primary: Large, rounded corners (rounded-lg), medium-semibold text
- Secondary: Outline style with same sizing
- Icon buttons: Square with rounded corners for actions
- CTA on images: backdrop-blur-lg with semi-transparent background, NO hover/active states needed

**Cards:**
- Exercise/Meal cards: Rounded corners (rounded-xl), subtle shadow, hover lift effect
- Padding: p-4 (mobile), p-6 (desktop)
- Image aspect ratios: Exercises 4:3, Meals 16:9

**Form Inputs:**
- Text inputs: Full rounded (rounded-lg), border, generous padding (p-3 md:p-4)
- Select dropdowns: Match input styling
- Radio/Checkbox groups: Card-based selection for goals/preferences (grid layout)
- Labels: Bold, positioned above inputs with mb-2

**Badges/Tags:**
- Small, rounded-full pills for categories, difficulty, meal types
- Compact padding (px-3 py-1), small text (text-xs md:text-sm)

**Progress Indicators:**
- Horizontal bar for form steps
- Circular progress for workout completion
- Percentage-based width transitions

---

## Images

**Hero Image:**
- Full-width, full-height background image showing energetic fitness scene
- Use AI-generated or stock photo: Person mid-workout in bright, modern gym
- Apply overlay gradient (dark to transparent top-to-bottom) for text readability

**Exercise Images:**
- Generated via DALL-E: Fit athlete demonstrating proper form in clean gym
- Displayed in cards (aspect-ratio 4:3)
- Full-size view in modal when clicked

**Meal Images:**
- Generated via DALL-E: Professional food styling, vibrant plated meals
- Displayed in cards (aspect-ratio 16:9)
- Full-size view in modal when clicked

---

## Interaction Patterns

**Form Flow:**
- Linear progression through steps with "Next" button
- Allow back navigation without losing data
- Validate each step before proceeding
- Success animation on final submission

**Plan Viewing:**
- Tab navigation for different days/weeks
- Click any exercise/meal card to view full details with large image
- Swipe gestures on mobile for day navigation

**Image Display:**
- Click card to open modal with full-size AI-generated image
- Modal includes exercise instructions or meal preparation details
- Smooth transitions (fade + scale)

---

## Responsive Behavior

**Breakpoints:**
- Mobile: < 768px (single column, stacked layouts)
- Tablet: 768px - 1024px (2 columns for plans)
- Desktop: 1024px+ (3 columns for exercises, 2 for meals)

**Mobile-First Adjustments:**
- Larger touch targets (min 44px height)
- Simplified navigation (hamburger menu)
- Single column forms
- Reduced text sizes but maintained hierarchy
- Full-width CTAs

---

## Key Screens Summary

1. **Landing:** Hero with CTA → Feature highlights → How it works → Testimonials
2. **Onboarding:** 4-step form wizard → Profile → Goals → Location → Diet
3. **Dashboard:** Quick stats → Today's workout preview → Today's meals → Progress chart
4. **Workout Plan:** Weekly view → Filterable exercise grid → Click for image/details
5. **Diet Plan:** Weekly view → Meal grid by day → Click for image/nutrition