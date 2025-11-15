import SwiftUI

struct NeuralRootView: View {
    @StateObject private var state = NeuralInterfaceState()
    @State private var pathwayIntensity: Double = 0.2
    @State private var searchText: String = ""
    @Namespace private var animation

    var body: some View {
        ZStack {
            Color.neural.surfaceTertiary.ignoresSafeArea()
            NeuralActivationLayer(activityLevel: $pathwayIntensity)
                .ignoresSafeArea()

            VStack(spacing: 32) {
                header
                HStack(alignment: .top, spacing: 32) {
                    NeuralSidebar()
                        .environmentObject(state)
                    mainContent
                        .environmentObject(state)
                }
                .padding(.bottom, 32)
            }
            .padding(32)
        }
        .onChange(of: state.isProcessing) { _, processing in
            withAnimation(.easeInOut(duration: 1.6)) {
                pathwayIntensity = processing ? 0.9 : 0.3
            }
        }
    }

    private var header: some View {
        HStack(alignment: .center, spacing: 24) {
            VStack(alignment: .leading, spacing: 6) {
                Text("Claude Neural Analyzer")
                    .neuralTextStyle(.display)
                Text("Frontier cognition mapped onto live EEG flux")
                    .neuralTextStyle(.body)
            }
            Spacer()
            NeuralFormField(title: "Quantum Query", placeholder: "Search cortical narratives", text: $searchText) {
                Image(systemName: "scope")
                    .font(.system(size: 18, weight: .semibold, design: .rounded))
                    .foregroundStyle(Color.neural.accentSignal)
            }
            .frame(maxWidth: 380)
            Button(action: state.activateProcessingTemporary) {
                Label("Initiate Computation", systemImage: "bolt.horizontal.circle")
                    .neuralTextStyle(.body)
                    .foregroundStyle(Color.neural.accentSignal)
            }
            .buttonStyle(SignalButtonStyle())
        }
    }

    private var mainContent: some View {
        VStack(alignment: .leading, spacing: 28) {
            TabSelectionView(selected: $state.selectedPanel, namespace: animation)
            ScrollView(.vertical, showsIndicators: false) {
                VStack(spacing: 24) {
                    overviewGrid
                    analyticsSlabs
                    experimentDeck
                    settingsDeck
                    NeuralEmptyState(title: "Awaiting next dataset", description: "Upload a fresh EEG capture or invite Claude to synthesize a cognitive scenario. Neural pathways remain primed for the next activation.")
                        .frame(maxWidth: .infinity)
                }
                .padding(.trailing, 12)
            }
        }
        .padding(32)
        .background(
            RoundedRectangle(cornerRadius: 36, style: .continuous)
                .fill(Color.neural.surfacePrimary)
                .overlay(
                    RoundedRectangle(cornerRadius: 36, style: .continuous)
                        .stroke(Color.neural.pathwayPurple.opacity(0.35), lineWidth: 1.2)
                )
                .shadow(color: Color.black.opacity(0.16), radius: 60, x: 0, y: 28)
        )
    }

    private var overviewGrid: some View {
        LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 24), count: 2), spacing: 24) {
            CorticalCard(title: "Signal Continuity", subtitle: "Harmonic phase coupling") {
                SignalWaveform()
                    .frame(height: 140)
            }
            CorticalCard(title: "Adaptive Attention", subtitle: "Claude focus bands") {
                AttentionStacks()
                    .frame(height: 140)
            }
        }
    }

    private var analyticsSlabs: some View {
        CorticalCard(title: "Cognitive Analytics", subtitle: "Eigenvector activations") {
            VStack(alignment: .leading, spacing: 16) {
                ForEach(0..<3) { index in
                    AnalyticsRow(index: index)
                }
            }
        }
    }

    private var experimentDeck: some View {
        CorticalCard(title: "Hypothesis Lab", subtitle: "Iterative co-creation") {
            VStack(alignment: .leading, spacing: 16) {
                ForEach(0..<2) { index in
                    ExperimentRow(index: index)
                }
                SignalPopover(title: "Activation Burst", description: "Localized neural cluster responsive to Claude prompts") {
                    Text("Maintain warm signal flow for empathetic reasoning. Reduce spectral noise for high precision outputs.")
                }
            }
        }
    }

    private var settingsDeck: some View {
        CorticalCard(title: "Interface Settings", subtitle: "Calibrate cognitive surface") {
            VStack(alignment: .leading, spacing: 18) {
                Toggle(isOn: $state.isProcessing.animation(.easeInOut(duration: 0.8))) {
                    Text("Amplify Computation Mode")
                        .neuralTextStyle(.body)
                        .foregroundStyle(Color.neural.textPrimary)
                }
                .toggleStyle(SignalToggleStyle())

                Toggle(isOn: .constant(true)) {
                    Text("Adaptive empathy resonance")
                        .neuralTextStyle(.body)
                }
                .toggleStyle(SignalToggleStyle())

                Toggle(isOn: .constant(false)) {
                    Text("Stealth latency damping")
                        .neuralTextStyle(.body)
                }
                .toggleStyle(SignalToggleStyle())
            }
        }
    }
}
