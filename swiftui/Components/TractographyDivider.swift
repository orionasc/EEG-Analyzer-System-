import SwiftUI

struct TractographyDivider: View {
    var body: some View {
        Canvas { context, size in
            var path = Path()
            let midY = size.height / 2
            path.move(to: CGPoint(x: 0, y: midY))
            path.addCurve(to: CGPoint(x: size.width, y: midY), control1: CGPoint(x: size.width * 0.35, y: midY - 4), control2: CGPoint(x: size.width * 0.65, y: midY + 4))
            context.stroke(path, with: .linearGradient(Color.neural.gradientPathway(intensity: 0.6), startPoint: .zero, endPoint: CGPoint(x: size.width, y: midY)), style: StrokeStyle(lineWidth: 1.6, lineCap: .round, dash: [6, 6], dashPhase: 2))
        }
    }
}

struct NeuralProgressView: View {
    var progress: Double

    var body: some View {
        GeometryReader { proxy in
            ZStack(alignment: .leading) {
                RoundedRectangle(cornerRadius: 12, style: .continuous)
                    .fill(Color.neural.surfacePrimary.opacity(0.25))
                RoundedRectangle(cornerRadius: 12, style: .continuous)
                    .fill(LinearGradient(gradient: Gradient(colors: [Color.neural.pathwayPurple, Color.neural.pathwayBlue]), startPoint: .leading, endPoint: .trailing))
                    .frame(width: proxy.size.width * progress)
                    .animation(.easeInOut(duration: 1.2), value: progress)
                HStack {
                    Circle()
                        .fill(Color.neural.accentSignal.opacity(0.8))
                        .frame(width: 12, height: 12)
                        .offset(x: proxy.size.width * progress - 6)
                        .shadow(color: Color.neural.accentSignal.opacity(0.8), radius: 12, x: 0, y: 0)
                }
            }
        }
        .frame(height: 20)
    }
}
