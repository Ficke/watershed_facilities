# Watershed Facilities: Smart Doc Upload MVP

A prototype implementation of Watershed's Smart Doc Upload feature for streamlined utility bill processing and Scope 2 emissions management.

## Overview

This prototype demonstrates the MVP outlined in the Watershed Facilities PRD - a system that automatically extracts and validates utility bill data, reducing manual entry from multiple days to under 30 minutes while maintaining audit-quality accuracy.

### The Problem We're Solving

Building Operators (retail chains, banks, real estate firms, healthcare systems) struggle with Scope 2 emissions management due to:
- **Highly distributed data**: Utility bills come as PDFs from multiple providers
- **Poor data quality**: Manual entry is error-prone and hard to verify
- **Lack of actionability**: Without clean data, sustainability teams can't identify reduction opportunities
- **Competitive pressure**: Bundled solutions from utility management companies are winning customers

### Our Solution: Smart Doc Upload

The MVP enables facilities managers to:
1. **Upload mixed utility bill formats** via familiar drag-and-drop interface
2. **Automatic data extraction** with confidence scoring and validation
3. **Focused validation** - review only uncertain fields with document context
4. **Immediate insights** - data flows directly into footprint analysis platform

## Features Implemented

### ✅ Core Upload Flow
- **Multi-format document upload** with drag-and-drop interface
- **Batch processing** with progress indicators
- **Smart validation workflow** flagging uncertain extractions
- **Upload results summary** showing processed vs. review-needed files

### ✅ Modern B2B UX
- **Consistent navigation** with proper back button flow
- **Fixed header/footer system** preventing layout shifts
- **Professional styling** following enterprise design patterns
- **Responsive layout** optimized for desktop workflow

### ✅ Integration Ready
- **Dataset organization** matching Watershed's measurement categories
- **Footprint dashboard** showing emissions analysis and breakdowns
- **Task management** system for tracking processing status

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ficke/watershed_facilities.git
   cd watershed_facilities_prototype
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser to `http://localhost:5173`**

### Usage

1. **Navigate to Utilities**: Click "Upload Utilities" in the task list
2. **Upload Bills**: Drag and drop utility bill PDFs or click to browse
3. **Review Results**: See which files processed successfully vs. need review
4. **Validate Data**: For flagged files, confirm extracted values
5. **View Insights**: Data flows into the carbon footprint dashboard

## Technical Architecture

### Built With
- **React 18** - Modern component architecture
- **Tailwind CSS** - Utility-first styling for rapid development
- **Lucide React** - Professional icon library
- **Vite** - Fast development build tool

### Key Components
- `App.jsx` - Main application with unified header/footer system
- `components/components.jsx` - All UI components in single file
- `mockData.js` - Sample data matching Watershed's data model

### Design Patterns
- **Unified Layout System** - Single source of truth for headers/footers
- **State-driven Navigation** - Centralized view management
- **Component Composition** - Reusable UI patterns
- **Responsive Design** - Desktop-first B2B workflow optimization

## Prototype Scope

### ✅ Implemented (MVP)
- Smart document upload interface
- Processing workflow with validation
- Upload results with success/review categorization
- Footprint dashboard with emissions breakdown
- Professional B2B styling and navigation

### 🚧 Future Milestones (Per PRD)
- **M1**: Intelligent validation with anomaly detection
- **M2**: Direct utility provider integrations
- **M3**: Real-time IoT monitoring capabilities

## Success Metrics (Target)

Based on the PRD, this MVP aims to achieve:
- **Customer Growth**: 75 → 130 Building Operator customers (73% growth)
- **Churn Reduction**: 28% → 18% within 6 months
- **Time Savings**: 2-3 days → <30 minutes for monthly utility processing
- **NPS Improvement**: 45% → 65% promoters for Scope 2 workflow

## Development

### Project Structure
```
src/
├── App.jsx                 # Main app with routing logic
├── components/
│   └── components.jsx      # All UI components
├── mockData.js            # Sample datasets and footprint data
├── main.jsx               # React app entry point
└── index.css              # Global styles
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Contributing

This is a prototype implementation. For production development:
1. Follow Watershed's engineering standards
2. Implement actual OCR/ML extraction pipeline
3. Add comprehensive error handling
4. Integrate with existing Watershed platform APIs
5. Add proper authentication and security measures

---

**Note**: This is a functional prototype demonstrating the Smart Doc Upload MVP user experience. The actual implementation would require backend services for document processing, machine learning models for data extraction, and integration with Watershed's existing platform infrastructure.