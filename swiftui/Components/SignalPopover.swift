import SwiftUI

struct SignalPopover<Content: View>: View {
    let title: String
    let description: String
    let content: Content

    init(title: String, description: String, @ViewBuilder content: () -> Content) {
        self.title = title
        self.description = description
        self.content = content()
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .neuralTextStyle(.headline)
                Text(description)
                    .neuralTextStyle(.caption)
            }
            TractographyDivider()
                .frame(height: 3)
            content
                .neuralTextStyle(.body)
        }
        .padding(20)
        .background(
            RoundedRectangle(cornerRadius: 24, style: .continuous)
                .fill(Color.neural.surfaceSecondary.opacity(0.88))
                .overlay(
                    RoundedRectangle(cornerRadius: 24, style: .continuous)
                        .stroke(Color.neural.pathwayBlue.opacity(0.5), lineWidth: 1.2)
                )
        )
        .overlay(alignment: .top) {
            Capsule(style: .continuous)
                .fill(Color.neural.accentSignal)
                .frame(width: 80, height: 6)
                .offset(y: -18)
        }
        .shadow(color: Color.black.opacity(0.35), radius: 44, x: 0, y: 24)
    }
}
