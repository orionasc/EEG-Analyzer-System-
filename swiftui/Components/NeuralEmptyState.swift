import SwiftUI

struct NeuralEmptyState: View {
    var title: String
    var description: String

    var body: some View {
        VStack(spacing: 16) {
            ZStack {
                RoundedRectangle(cornerRadius: 28, style: .continuous)
                    .stroke(Color.neural.pathwayBlue.opacity(0.35), lineWidth: 1.4)
                    .background(
                        RoundedRectangle(cornerRadius: 28, style: .continuous)
                            .fill(Color.neural.surfaceSecondary.opacity(0.35))
                    )
                    .frame(width: 120, height: 120)
                NeuralGlyph()
                    .frame(width: 90, height: 90)
            }
            Text(title)
                .neuralTextStyle(.headline)
            Text(description)
                .multilineTextAlignment(.center)
                .neuralTextStyle(.caption)
                .padding(.horizontal, 24)
        }
        .padding(32)
        .background(
            RoundedRectangle(cornerRadius: 32, style: .continuous)
                .fill(Color.neural.surfacePrimary.opacity(0.92))
                .overlay(
                    RoundedRectangle(cornerRadius: 32, style: .continuous)
                        .stroke(Color.neural.outline.opacity(0.25), lineWidth: 1)
                )
        )
    }
}

private struct NeuralGlyph: View {
    var body: some View {
        Canvas { context, size in
            var path = Path()
            let center = CGPoint(x: size.width / 2, y: size.height / 2)
            let outerRadius = min(size.width, size.height) / 2
            for index in 0..<6 {
                let angle = Double(index) / 6.0 * .pi * 2
                let point = CGPoint(x: center.x + cos(angle) * outerRadius * 0.8, y: center.y + sin(angle) * outerRadius * 0.8)
                path.move(to: center)
                path.addLine(to: point)
            }
            context.stroke(path, with: .linearGradient(Color.neural.gradientPathway(intensity: 0.5), startPoint: .zero, endPoint: CGPoint(x: size.width, y: size.height)), style: StrokeStyle(lineWidth: 2, lineCap: .round))

            for index in 0..<6 {
                let angle = Double(index) / 6.0 * .pi * 2
                let point = CGPoint(x: center.x + cos(angle) * outerRadius * 0.8, y: center.y + sin(angle) * outerRadius * 0.8)
                let circle = Path(ellipseIn: CGRect(x: point.x - 6, y: point.y - 6, width: 12, height: 12))
                context.fill(circle, with: .color(Color.neural.accentSignal.opacity(0.6)))
            }
        }
    }
}
