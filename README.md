# EEG Signal Analyzer with AI

An interactive web application that analyzes EEG (electroencephalography) data using AI to demonstrate how artificial intelligence can accelerate neuroscience research by instantly identifying patterns that traditionally require hours of manual analysis.

![EEG Analyzer](https://img.shields.io/badge/Built%20with-React%20%2B%20TypeScript-blue)
![AI Powered](https://img.shields.io/badge/AI-Claude%20API-purple)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

### Signal Processing
- **Bandpass Filtering**: Filters EEG signals in the 0.5-50 Hz range
- **FFT Analysis**: Fast Fourier Transform for frequency domain analysis
- **Power Spectral Density**: Calculates power distribution across frequencies
- **Frequency Band Extraction**:
  - Delta (0.5-4 Hz) - Deep sleep
  - Theta (4-8 Hz) - Drowsiness
  - Alpha (8-13 Hz) - Relaxed wakefulness
  - Beta (13-30 Hz) - Active thinking
  - Gamma (30-50 Hz) - High-level cognition

### Visualizations
- **Time Series Plot**: Multi-channel EEG waveform visualization
- **Power Spectrum**: Frequency domain representation with band markers
- **Frequency Band Distribution**: Bar chart showing power in each frequency band
- **Real-time Metrics**: Dominant frequency, total power, and processing time

### AI Analysis
- **Brain State Classification**: Identifies current brain state (awake, drowsy, asleep, focused)
- **Sleep Stage Detection**: Classifies sleep stages (N1, N2, N3, REM)
- **Anomaly Detection**: Identifies unusual patterns in brain activity
- **Research Insights**: AI-generated recommendations and interpretations

### Data Management
- **Sample Datasets**: Pre-generated EEG data for different brain states
- **CSV Upload**: Support for custom EEG data in CSV format
- **Data Validation**: Automatic validation of uploaded EEG signals

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Visualizations**: Plotly.js
- **Signal Processing**: FFT.js
- **AI Integration**: Anthropic Claude API
- **Data Parsing**: PapaParse

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd EEG-Analyzer-System-
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Set up Claude API key:
   - Get an API key from [Anthropic](https://www.anthropic.com/)
   - The app works without an API key using mock AI analysis
   - Enter your API key in the Control Panel when running the app

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

## Usage

### Using Sample Datasets

1. Click on one of the sample dataset buttons:
   - **Relaxed Wakefulness**: Shows strong alpha waves
   - **Focused Concentration**: High beta and gamma activity
   - **Drowsy State**: Increased theta waves
   - **Deep Sleep**: Dominated by slow delta waves

2. Click "Analyze EEG Data" to process the signal

3. View the results:
   - Time series visualization of the raw signal
   - Power spectrum showing frequency distribution
   - Frequency band breakdown
   - AI-generated insights and recommendations

### Uploading Custom Data

1. Click the upload area in the Data Uploader panel
2. Select a CSV file with the following format:

```csv
Time,Channel1,Channel2,Channel3,...
0.000,1.23,4.56,7.89,...
0.004,1.45,4.23,8.01,...
```

3. The system will validate and load your data
4. Click "Analyze EEG Data" to process

### Using Claude API

1. Enter your Claude API key in the Control Panel
2. The system will use real AI analysis instead of mock analysis
3. Receive detailed, AI-generated insights about brain states

## Project Structure

```
src/
├── components/          # React components
│   ├── TimeSeriesPlot.tsx
│   ├── SpectrogramPlot.tsx
│   ├── FrequencyBandChart.tsx
│   ├── AIInsightPanel.tsx
│   ├── ControlPanel.tsx
│   └── DataUploader.tsx
├── utils/              # Utility functions
│   ├── signalProcessing.ts
│   └── dataGenerator.ts
├── services/           # External services
│   └── aiAnalysis.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx            # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

## Key Algorithms

### Bandpass Filter
Uses FFT-based frequency domain filtering to remove frequencies outside the 0.5-50 Hz range, eliminating noise while preserving relevant EEG signals.

### Power Spectral Density
Implements Welch's method using FFT to calculate the power distribution across frequencies, enabling identification of dominant frequency bands.

### Frequency Band Extraction
Categorizes power into standard EEG frequency bands (delta, theta, alpha, beta, gamma) for clinical interpretation.

### AI Analysis
Leverages Claude AI to interpret frequency band patterns and provide insights about brain states, sleep stages, and anomalies.

## How AI Accelerates Neuroscience Research

Traditional EEG analysis workflow:
1. Manual inspection of waveforms (1-2 hours)
2. Frequency analysis by specialists
3. Pattern recognition based on expertise
4. Report generation (30-60 minutes)

**Total time**: 2-3 hours per recording

AI-powered workflow:
1. Automatic signal processing (< 1 second)
2. AI pattern recognition (1-2 seconds)
3. Instant insights and recommendations

**Total time**: ~2 seconds

**Speed improvement**: 5,400x faster

## Building for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` directory.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features

1. **New Visualizations**: Add components in `src/components/`
2. **Signal Processing**: Extend `src/utils/signalProcessing.ts`
3. **Data Sources**: Modify `src/utils/dataGenerator.ts`
4. **AI Analysis**: Customize prompts in `src/utils/aiEngine.ts`

## Limitations and Disclaimers

- This is a **demonstration tool** for educational purposes
- **Not intended for medical diagnosis** or clinical use
- For medical applications, consult qualified healthcare professionals
- Sample data is synthetically generated for demonstration
- AI analysis provides general insights, not medical advice

## Future Enhancements

- [ ] Real-time EEG streaming support
- [ ] Multi-channel correlation analysis
- [ ] Advanced artifact removal algorithms
- [ ] Export analysis reports as PDF
- [ ] 3D brain visualization
- [ ] Support for other biosignal formats (EDF, BDF)
- [ ] Offline AI analysis mode
- [ ] Mobile-responsive improvements

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built with [React](https://react.dev/)
- Powered by [Claude AI](https://www.anthropic.com/)
- Visualizations by [Plotly.js](https://plotly.com/javascript/)
- Signal processing with [FFT.js](https://github.com/indutny/fft.js)

## Contact

For questions or feedback, please open an issue on the repository.

---

**Note**: This tool demonstrates AI capabilities in neuroscience research. Always consult qualified medical professionals for health-related concerns.
