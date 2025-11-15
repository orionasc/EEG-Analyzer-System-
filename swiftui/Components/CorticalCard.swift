import SwiftUI

struct CorticalCard<Content: View>: View {
    let title: String
    let subtitle: String
    let content: Content

    init(title: String, subtitle: String, @ViewBuilder content: () -> Content) {
        self.title = title
        self.subtitle = subtitle
        self.content = content()
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .neuralTextStyle(.headline)
                Text(subtitle)
                    .neuralTextStyle(.caption)
            }
            content
                .neuralCardPadding()
        }
        .padding(24)
        .background(
            RoundedRectangle(cornerRadius: 28, style: .continuous)
                .fill(Color.neural.surfacePrimary)
                .overlay(
                    RoundedRectangle(cornerRadius: 28, style: .continuous)
                        .stroke(Color.neural.outline.opacity(0.25), lineWidth: 1)
                        .blendMode(.overlay)
                )
                .shadow(color: Color.neural.surfaceSecondary.opacity(0.2), radius: 28, x: 0, y: 22)
        )
        .overlay(alignment: .topTrailing) {
            Capsule()
                .fill(Color.neural.accentSignal.opacity(0.35))
                .frame(width: 62, height: 22)
                .overlay(
                    Capsule()
                        .stroke(Color.neural.accentSignal.opacity(0.8), lineWidth: 1)
                )
                .offset(y: -11)
        }
    }
}

private struct NeuralCardPadding: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding(18)
            .background(
                RoundedRectangle(cornerRadius: 20, style: .continuous)
                    .fill(Color.neural.surfaceSecondary.opacity(0.35))
                    .overlay(
                        RoundedRectangle(cornerRadius: 20, style: .continuous)
                            .stroke(Color.neural.pathwayPurple.opacity(0.35), lineWidth: 1)
                    )
            )
    }
}

extension View {
    func neuralCardPadding() -> some View {
        modifier(NeuralCardPadding())
    }
}
