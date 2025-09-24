# Imperium Maledictum Character Creator & Viewer - Roadmap

## Project Overview

A lightweight, web-based character creator and viewer for the Imperium Maledictum tabletop RPG with Foundry VTT integration. Built with vanilla JavaScript and minimal dependencies for maximum portability and ease of deployment.

## Technical Architecture

### Lightweight Technology Stack
- **Frontend**: Pure HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend**: Node.js with built-in HTTP server (no Express/frameworks)
- **Storage**: File-based (JSON) with optional database upgrade path
- **Integration**: Foundry VTT REST API relay for live character data
- **Deployment**: Single executable or Docker container
- **Dependencies**: Minimal (only dotenv for configuration)

### Design Philosophy
- **Zero Build Process**: No webpack, babel, or compilation steps
- **Framework-Free**: Pure JavaScript for maximum compatibility
- **Progressive Enhancement**: Works offline for character creation, online for Foundry integration
- **Mobile-First**: Responsive design for tablet/phone use during sessions
- **Themeable**: Cogitator CRT aesthetic with easy color customization

## Implementation Roadmap

### Phase 1: Foundation & Character Creator (Weeks 1-2)
**Status: ✅ COMPLETE**

1. **Core Character Data Model**
   - Character.js with stats, origins, factions, roles
   - Validation and randomization methods
   - HTML form with tabbed interface

2. **User Interface**
   - Cogitator CRT theme implementation
   - Responsive CSS grid layouts
   - Form validation and character sheet display

3. **Static Deployment**
   - Works as standalone HTML files
   - No server required for basic functionality

### Phase 2: Server Infrastructure (Week 3)
**Status: ✅ COMPLETE**

1. **Node.js HTTP Server**
   - Static file serving
   - Environment configuration with dotenv
   - Basic API endpoint structure

2. **Foundry VTT Integration**
   - REST API relay connection
   - Authentication handling
   - Client/world discovery

### Phase 3: Character Viewer (Week 4)
**Status: ✅ IN PROGRESS**

1. **API Data Parser**
   - Parse complex Foundry actor data
   - Extract essential character information
   - Simplified data structure for frontend

2. **Character Display Interface**
   - character-viewer.html page
   - Dynamic data loading
   - Tabbed character sheet layout

### Phase 4: Enhanced Features (Weeks 5-6)

1. **Character Management**
   - Create `character-list.html` for browsing multiple characters
   - Add character search and filtering
   - Implement character comparison views

2. **Data Persistence**
   - Local storage for created characters
   - Export/import functionality (JSON format)
   - Optional server-side character storage

3. **Advanced Foundry Integration**
   - Real-time character updates
   - Support for multiple connected worlds
   - Character synchronization options

### Phase 5: Polish & Deployment (Week 7)

1. **Error Handling & UX**
   - Comprehensive error messages
   - Loading states and progress indicators
   - Offline mode indicators

2. **Performance & Optimization**
   - Lazy loading for character lists
   - Image optimization and caching
   - Memory usage optimization

3. **Packaging & Distribution**
   - Docker container configuration
   - Standalone executable (pkg/nexe)
   - Installation documentation

### Phase 6: Advanced Features (Week 8+)

1. **Character Tools**
   - Dice roller integration
   - Combat tracker
   - Equipment calculator

2. **Multi-System Support**
   - Plugin architecture for other RPG systems
   - Configurable character templates
   - System-specific validation rules

## File Structure Design

```
impmal-character-tools/
├── public/                  # Static web assets
│   ├── index.html          # Landing page
│   ├── character-creator.html
│   ├── character-viewer.html
│   ├── character-list.html
│   ├── css/
│   │   ├── styles.css      # Main styles
│   │   ├── themes.css      # Color themes
│   │   └── mobile.css      # Mobile overrides
│   ├── js/
│   │   ├── character.js    # Character data model
│   │   ├── creator.js      # Character creation logic
│   │   ├── viewer.js       # Character viewing logic
│   │   ├── foundry-api.js  # Foundry integration
│   │   └── utils.js        # Shared utilities
│   └── assets/
│       ├── images/
│       ├── fonts/
│       └── icons/
├── server/                 # Server-side code
│   ├── server.js          # Main HTTP server
│   ├── api/
│   │   ├── foundry.js     # Foundry API proxy
│   │   ├── characters.js  # Character management
│   │   └── storage.js     # Data persistence
│   └── config/
│       ├── default.json   # Default configuration
│       └── systems.json   # RPG system definitions
├── data/                  # Data storage
│   ├── characters/        # Saved characters
│   ├── systems/           # RPG system data
│   └── cache/             # API response cache
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
├── docs/
│   ├── INSTALL.md
│   ├── API.md
│   └── DEVELOPMENT.md
├── package.json
├── README.md
└── ROADMAP.md             # This file
```

## Development Priorities

### Critical Path Items
1. ✅ Character viewer with parsed Foundry data
2. 📋 Character list/browser interface
3. 📋 Multi-character support
4. 📋 Improved error handling

### Nice-to-Have Features
- Character export/sharing
- Print-friendly character sheets
- Dark/light theme toggle
- Mobile app wrapper (Cordova/Electron)
- GM tools integration

## Success Metrics

### Technical Goals
- **Zero-dependency frontend** (except for optional Foundry integration)
- **Sub-500ms page load** times on mobile
- **Works offline** for character creation
- **Single-file deployment** option available

### User Experience Goals
- **5-minute character creation** from start to finish
- **Tablet-friendly** interface for session use
- **Accessible** (WCAG 2.1 AA compliance)
- **Cross-platform** compatibility (all modern browsers)

## Deployment Options

### Development
```bash
npm start  # Development server on localhost:3000
```

### Production Options

1. **Node.js Server**
   ```bash
   npm install --production
   npm start
   ```

2. **Docker Container**
   ```bash
   docker build -t impmal-tools .
   docker run -p 3000:3000 impmal-tools
   ```

3. **Static Hosting** (character creator only)
   - Deploy public/ folder to any static host
   - No server required for basic functionality

4. **Standalone Executable**
   ```bash
   pkg server.js --out-path dist/
   ```

This roadmap prioritizes rapid development with minimal complexity while maintaining the ability to scale and add features incrementally.