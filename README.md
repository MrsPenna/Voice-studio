# Classroom Voice Studio

A professional voice announcement system for educational settings built with React, TypeScript, and Material-UI.

## Features

- 🎤 **Audio Recording & Processing** - Record and process voice announcements with professional effects
- 🎯 **Project Management** - Organize announcements into projects
- 🎨 **Voice Profiles** - Create and manage custom voice profiles with warmth, speed, and volume controls
- 📊 **Spreadsheet Import** - Import announcements from CSV/Excel files
- 💾 **Project Export** - Export projects as ZIP files with audio files and metadata
- 📅 **Scheduling** - Schedule announcements for specific times with recurring options
- 🔔 **Notifications** - Get notified before scheduled announcements
- 📱 **Progressive Web App** - Full offline support with service worker caching
- 🌓 **Dark Mode** - Beautiful dark theme support
- ⚡ **Real-time Sync** - Auto-save functionality with IndexedDB

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI)
- **State Management**: Zustand with persistence
- **Database**: Dexie (IndexedDB wrapper)
- **Audio Processing**: WaveSurfer.js, Web Audio API
- **Build Tool**: Vite with PWA support
- **File Import/Export**: XLSX, JSZip
- **Routing**: React Router v6

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Building

```bash
npm run build
```

## Project Structure

```
src/
├── components/        # Reusable UI components
├── pages/            # Page components
├── services/         # Business logic services
├── store/            # Zustand state management
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
├── types/            # TypeScript type definitions
├── theme/            # Material-UI theme configuration
├── App.tsx           # Main app component
└── main.tsx          # Entry point
```

## Key Services

### Audio Services
- `AudioRecordingService` - Record audio from microphone
- `AudioProcessingService` - Apply effects (pitch, speed, warmth, noise reduction)
- `AudioWaveformService` - Display and interact with waveforms

### Data Services
- `MicrosoftGraphService` - OneDrive integration
- `SpreadsheetImportService` - Import from CSV/Excel
- `ZipExportService` - Export projects as ZIP

### State Management (Zustand Stores)
- `projectStore` - Project and announcement management
- `voiceProfileStore` - Voice profile management
- `scheduledStore` - Scheduled announcements
- `oneDriveStore` - OneDrive file management
- `uiStore` - UI state and settings

## Custom Hooks

- `useAudioRecording` - Audio recording with level monitoring
- `useAudioWaveform` - Waveform visualization and playback
- `useOnlineStatus` - Online/offline status monitoring
- `useAutoSave` - Automatic saving functionality
- `useVoicePreset` - Voice profile presets
- `useNotification` - Web notifications API

## Database Schema (IndexedDB)

- **projects** - Project metadata and settings
- **announcements** - Individual announcement records
- **voiceProfiles** - Voice profile configurations
- **scheduledAnnouncements** - Scheduled announcements
- **oneDriveFiles** - OneDrive file references
- **appState** - Application state persistence

## PWA Features

- Service Worker caching strategies
- Offline support
- Install as app prompt
- Push notifications
- Web app manifest

## Voice Profile Settings

- **Warmth** (50-150): Adjust the tone from cool to warm
- **Speed** (50-150): Control speech rate
- **Volume** (0-200): Adjust output volume
- **Quality Presets**: Professional, Energetic, Calm, Announcer, Storyteller

## Audio Quality Levels

- **Low**: 128 kbps
- **Standard**: 192 kbps (default)
- **High**: 256+ kbps
- **Premium**: 320 kbps
- **Studio/Archive**: Maximum quality

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers with PWA support

## Keyboard Shortcuts

- `Ctrl+S` / `Cmd+S` - Save project
- `Ctrl+N` / `Cmd+N` - New project
- `Space` - Play/Pause audio

## Contributing

Contributions are welcome! Please follow the existing code style and submit pull requests to the main branch.

## License

MIT License - See LICENSE file for details

## Support

For issues, feature requests, or questions, please open an issue on GitHub.
