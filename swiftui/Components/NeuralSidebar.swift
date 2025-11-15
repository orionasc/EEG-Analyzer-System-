import SwiftUI

struct NeuralSidebar: View {
    @EnvironmentObject private var state: NeuralInterfaceState

    var body: some View {
        VStack(alignment: .leading, spacing: 28) {
            VStack(alignment: .leading, spacing: 8) {
                Text("Claude Cognitive Lab")
                    .neuralTextStyle(.title)
                Text("Neural operations console")
                    .neuralTextStyle(.caption)
            }
            .padding(.bottom, 12)

            ForEach(NeuralInterfaceState.Panel.allCases) { panel in
                Button {
                    withAnimation(.spring(response: 0.45, dampingFraction: 0.82)) {
                        state.selectedPanel = panel
                    }
                } label: {
                    HStack(spacing: 14) {
                        Image(systemName: panel.icon)
                            .font(.system(size: 18, weight: .semibold, design: .rounded))
                            .foregroundStyle(state.selectedPanel == panel ? Color.neural.accentSignal : Color.neural.textTertiary)
                        VStack(alignment: .leading, spacing: 2) {
                            Text(panel.rawValue)
                                .neuralTextStyle(.body)
                            TractographyDivider()
                                .frame(height: 2)
                                .opacity(state.selectedPanel == panel ? 1 : 0)
                        }
                        Spacer()
                    }
                    .padding(.horizontal, 20)
                    .padding(.vertical, 12)
                    .background(
                        RoundedRectangle(cornerRadius: 18, style: .continuous)
                            .fill(Color.neural.surfaceSecondary.opacity(state.selectedPanel == panel ? 0.55 : 0.28))
                            .overlay(
                                RoundedRectangle(cornerRadius: 18, style: .continuous)
                                    .stroke(Color.neural.pathwayBlue.opacity(state.selectedPanel == panel ? 0.45 : 0.2), lineWidth: 1)
                            )
                    )
                }
            }

            Spacer()

            VStack(alignment: .leading, spacing: 12) {
                Text("Cortical Sync")
                    .neuralTextStyle(.headline)
                NeuralProgressView(progress: state.isProcessing ? 0.78 : 0.18)
            }
            .padding(20)
            .background(
                RoundedRectangle(cornerRadius: 22, style: .continuous)
                    .fill(Color.neural.surfaceSecondary.opacity(0.45))
                    .overlay(
                        RoundedRectangle(cornerRadius: 22, style: .continuous)
                            .stroke(Color.neural.pathwayPurple.opacity(0.4), lineWidth: 1)
                    )
            )
        }
        .padding(24)
        .frame(maxWidth: 320)
        .background(
            RoundedRectangle(cornerRadius: 28, style: .continuous)
                .fill(Color.neural.surfaceSecondary.opacity(0.65))
                .overlay(
                    RoundedRectangle(cornerRadius: 28, style: .continuous)
                        .stroke(Color.neural.outline.opacity(0.35), lineWidth: 1)
                )
                .shadow(color: Color.black.opacity(0.18), radius: 48, x: 0, y: 28)
        )
    }
}
