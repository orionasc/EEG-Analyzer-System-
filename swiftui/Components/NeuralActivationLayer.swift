import SwiftUI

struct NeuralActivationLayer: View {
    @Binding var activityLevel: Double

    var body: some View {
        TimelineView(.animation) { timeline in
            Canvas { context, size in
                let time = timeline.date.timeIntervalSinceReferenceDate
                let phase = CGFloat(time.remainder(dividingBy: 8.0))
                let noise = CGFloat(sin(time * 0.4) + cos(time * 0.6)) * 0.08

                let nodeCount = Int(12 + activityLevel * 10)
                let nodes = generateNodes(count: nodeCount, in: size, phase: phase)

                drawPathways(nodes: nodes, context: &context, size: size, jitter: noise, phase: phase)
                drawNodes(nodes: nodes, context: &context)
            }
            .animation(.easeInOut(duration: 1.6).repeatForever(autoreverses: true), value: activityLevel)
        }
        .blur(radius: 24)
        .overlay(
            RadialGradient(colors: [Color.neural.surfaceSecondary.opacity(0.1), .clear], center: .center, startRadius: 80, endRadius: 360)
                .blendMode(.plusLighter)
        )
        .allowsHitTesting(false)
    }

    private func generateNodes(count: Int, in size: CGSize, phase: CGFloat) -> [CGPoint] {
        (0..<count).map { index in
            let normalized = Double(index) / Double(count)
            let angle = normalized * Double.pi * 2 + Double(phase) * 0.12
            let radius = size.width * 0.3 + CGFloat(normalized) * size.width * 0.15
            let x = size.width * 0.5 + cos(angle) * radius * CGFloat.random(in: 0.85...1.1)
            let y = size.height * 0.5 + sin(angle) * radius * CGFloat.random(in: 0.7...1.0)
            return CGPoint(x: x, y: y)
        }
    }

    private func drawPathways(nodes: [CGPoint], context: inout GraphicsContext, size: CGSize, jitter: CGFloat, phase: CGFloat) {
        guard nodes.count > 1 else { return }
        var path = Path()
        for (index, point) in nodes.enumerated() {
            if index == 0 {
                path.move(to: point)
                continue
            }
            let previous = nodes[index - 1]
            let mid = CGPoint(x: (previous.x + point.x) / 2, y: (previous.y + point.y) / 2)
            path.addQuadCurve(to: mid, control: controlPoint(from: previous, to: point, jitter: jitter))
            path.addQuadCurve(to: point, control: controlPoint(from: point, to: previous, jitter: jitter))
        }
        context.stroke(path, with: .linearGradient(Color.neural.gradientPathway(intensity: activityLevel), startPoint: .zero, endPoint: CGPoint(x: size.width, y: size.height)), style: StrokeStyle(lineWidth: 2.2 + activityLevel, lineCap: .round, lineJoin: .round, miterLimit: 1, dash: [12, 8], dashPhase: phase * 1.4))
    }

    private func drawNodes(nodes: [CGPoint], context: inout GraphicsContext) {
        for node in nodes {
            let circle = Path(ellipseIn: CGRect(x: node.x - 4, y: node.y - 4, width: 8, height: 8))
            context.fill(circle, with: .color(Color.neural.accentSignal.opacity(0.35 + activityLevel * 0.4)))
            context.stroke(circle, with: .color(Color.neural.pathwayBlue.opacity(0.5 + activityLevel * 0.5)), lineWidth: 1.4)
        }
    }

    private func controlPoint(from start: CGPoint, to end: CGPoint, jitter: CGFloat) -> CGPoint {
        let midX = (start.x + end.x) / 2
        let midY = (start.y + end.y) / 2
        return CGPoint(x: midX + CGFloat.random(in: -22...22) * jitter, y: midY + CGFloat.random(in: -18...18) * jitter)
    }
}
