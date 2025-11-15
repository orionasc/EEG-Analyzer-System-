import SwiftUI

@MainActor
final class NeuralInterfaceState: ObservableObject {
    enum Panel: String, CaseIterable, Identifiable {
        case overview = "Cortical Overview"
        case acquisition = "Signal Acquisition"
        case analytics = "Cognitive Analytics"
        case experiments = "Hypothesis Lab"
        case settings = "Interface Settings"

        var id: String { rawValue }
        var icon: String {
            switch self {
            case .overview: return "globe.asia.australia"
            case .acquisition: return "waveform"
            case .analytics: return "chart.xyaxis.line"
            case .experiments: return "wand.and.sparkles"
            case .settings: return "slider.horizontal.3"
            }
        }
    }

    @Published var isProcessing: Bool = false
    @Published var selectedPanel: Panel = .overview
    @Published var highlightedNode: UUID? = nil

    func activateProcessingTemporary() {
        guard !isProcessing else { return }
        isProcessing = true
        Task { [weak self] in
            try? await Task.sleep(for: .seconds(2.4))
            await MainActor.run {
                self?.isProcessing = false
            }
        }
    }
}
