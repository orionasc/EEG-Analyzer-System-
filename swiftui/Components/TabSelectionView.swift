import SwiftUI

struct TabSelectionView: View {
    @Binding var selected: NeuralInterfaceState.Panel
    var namespace: Namespace.ID

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 18) {
                ForEach(NeuralInterfaceState.Panel.allCases) { panel in
                    tab(for: panel)
                }
            }
            .padding(.vertical, 8)
        }
    }

    private func tab(for panel: NeuralInterfaceState.Panel) -> some View {
        Button {
            withAnimation(.spring(response: 0.5, dampingFraction: 0.78)) {
                selected = panel
            }
        } label: {
            VStack(alignment: .leading, spacing: 6) {
                HStack(spacing: 10) {
                    Image(systemName: panel.icon)
                        .font(.system(size: 16, weight: .semibold, design: .rounded))
                        .foregroundStyle(panel == selected ? Color.neural.accentSignal : Color.neural.textTertiary)
                    Text(panel.rawValue)
                        .neuralTextStyle(.body)
                }
                if panel == selected {
                    RoundedRectangle(cornerRadius: 12, style: .continuous)
                        .fill(Color.neural.accentSignal.opacity(0.6))
                        .frame(height: 4)
                        .matchedGeometryEffect(id: "underline", in: namespace)
                } else {
                    RoundedRectangle(cornerRadius: 12, style: .continuous)
                        .fill(Color.clear)
                        .frame(height: 4)
                }
            }
            .padding(.horizontal, 18)
            .padding(.vertical, 12)
            .background(
                RoundedRectangle(cornerRadius: 24, style: .continuous)
                    .fill(Color.neural.surfaceSecondary.opacity(panel == selected ? 0.58 : 0.28))
                    .overlay(
                        RoundedRectangle(cornerRadius: 24, style: .continuous)
                            .stroke(Color.neural.pathwayBlue.opacity(panel == selected ? 0.5 : 0.25), lineWidth: 1)
                    )
            )
        }
    }
}
