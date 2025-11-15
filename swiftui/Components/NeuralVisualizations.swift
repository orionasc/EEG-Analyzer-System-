import SwiftUI

struct SignalWaveform: View {
    var body: some View {
        TimelineView(.animation) { timeline in
            Canvas { context, size in
                let path = waveformPath(size: size, time: timeline.date.timeIntervalSinceReferenceDate)
                context.stroke(path, with: .linearGradient(Color.neural.gradientPathway(intensity: 0.8), startPoint: .zero, endPoint: CGPoint(x: size.width, y: size.height)), style: StrokeStyle(lineWidth: 2.4, lineCap: .round))
            }
        }
        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
        .background(
            RoundedRectangle(cornerRadius: 18, style: .continuous)
                .fill(Color.neural.surfaceSecondary.opacity(0.28))
        )
    }

    private func waveformPath(size: CGSize, time: TimeInterval) -> Path {
        var path = Path()
        let amplitude = size.height / 3
        let baseFrequency = 2.0
        let step = size.width / 60
        var x: CGFloat = 0
        var started = false

        while x <= size.width {
            let progress = Double(x / size.width)
            let y = size.height / 2 + sin(progress * .pi * baseFrequency + time * 1.4) * amplitude * CGFloat(0.6 + sin(time * 0.7) * 0.1)
            if !started {
                path.move(to: CGPoint(x: x, y: y))
                started = true
            } else {
                path.addLine(to: CGPoint(x: x, y: y))
            }
            x += step
        }
        return path
    }
}

struct AttentionStacks: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            ForEach(0..<4) { index in
                HStack {
                    Capsule(style: .continuous)
                        .fill(Color.neural.gradientPathway(intensity: Double(index) * 0.2 + 0.3))
                        .frame(width: CGFloat(120 + index * 36), height: 14)
                        .overlay(
                            Capsule(style: .continuous)
                                .stroke(Color.neural.accentSignal.opacity(0.3), lineWidth: 1)
                        )
                    Spacer()
                    Text("Band \(index + 1)")
                        .neuralTextStyle(.caption)
                }
            }
        }
        .padding(12)
        .background(
            RoundedRectangle(cornerRadius: 18, style: .continuous)
                .fill(Color.neural.surfaceSecondary.opacity(0.32))
        )
    }
}

struct AnalyticsRow: View {
    let index: Int
    private var metrics: [(String, Double, String)] = [
        ("Theta Resonance", 0.72, "Stable"),
        ("Context Vector", 0.64, "Rising"),
        ("Coherence Flux", 0.83, "Locked")
    ]

    var body: some View {
        let metric = metrics[index % metrics.count]
        HStack(spacing: 18) {
            VStack(alignment: .leading, spacing: 4) {
                Text(metric.0)
                    .neuralTextStyle(.headline)
                Text(metric.2)
                    .neuralTextStyle(.caption)
            }
            Spacer()
            ArcGauge(value: metric.1)
                .frame(width: 80, height: 80)
        }
        .padding(20)
        .background(
            RoundedRectangle(cornerRadius: 20, style: .continuous)
                .fill(Color.neural.surfaceSecondary.opacity(0.35))
                .overlay(
                    RoundedRectangle(cornerRadius: 20, style: .continuous)
                        .stroke(Color.neural.pathwayBlue.opacity(0.4), lineWidth: 1)
                )
        )
    }
}

struct ExperimentRow: View {
    let index: Int
    @State private var isEngaged: Bool = false

    var body: some View {
        HStack(alignment: .center, spacing: 16) {
            Circle()
                .fill(Color.neural.gradientPathway(intensity: Double(index) * 0.3 + 0.4))
                .frame(width: 48, height: 48)
                .overlay(
                    Image(systemName: index == 0 ? "sparkles" : "bolt.horizontal")
                        .font(.system(size: 18, weight: .medium, design: .rounded))
                        .foregroundStyle(Color.neural.accentSignal)
                )
            VStack(alignment: .leading, spacing: 4) {
                Text(index == 0 ? "Claude synthesis loop" : "Neural empathy tuning")
                    .neuralTextStyle(.body)
                Text(index == 0 ? "Iterate on conceptual scaffolds" : "Warmth gradients for dialogue")
                    .neuralTextStyle(.caption)
            }
            Spacer()
            Button {
                withAnimation(.spring(response: 0.5, dampingFraction: 0.7)) {
                    isEngaged.toggle()
                }
            } label: {
                Label(isEngaged ? "Engaged" : "Activate", systemImage: isEngaged ? "checkmark" : "play.fill")
                    .neuralTextStyle(.caption)
                    .foregroundStyle(Color.neural.accentSignal)
            }
            .buttonStyle(SignalButtonStyle())
            .overlay(alignment: .bottom) {
                if isEngaged {
                    TractographyDivider()
                        .frame(width: 120, height: 3)
                        .offset(y: 18)
                        .transition(.opacity.combined(with: .move(edge: .bottom)))
                }
            }
        }
        .padding(18)
        .background(
            RoundedRectangle(cornerRadius: 22, style: .continuous)
                .fill(Color.neural.surfaceSecondary.opacity(0.4))
        )
    }
}

struct ArcGauge: View {
    var value: Double

    var body: some View {
        ZStack {
            Circle()
                .trim(from: 0, to: 0.75)
                .stroke(Color.neural.surfaceSecondary.opacity(0.5), style: StrokeStyle(lineWidth: 8, lineCap: .round))
                .rotationEffect(.degrees(135))
            Circle()
                .trim(from: 0, to: value * 0.75)
                .stroke(Color.neural.gradientPathway(intensity: value), style: StrokeStyle(lineWidth: 8, lineCap: .round))
                .rotationEffect(.degrees(135))
            Circle()
                .fill(Color.neural.surfacePrimary)
                .frame(width: 36, height: 36)
                .overlay(
                    Text(String(format: "%.0f%%", value * 100))
                        .neuralTextStyle(.caption)
                )
        }
    }
}
