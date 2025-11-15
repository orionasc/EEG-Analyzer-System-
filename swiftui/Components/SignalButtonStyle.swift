import SwiftUI

struct SignalButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .padding(.horizontal, 22)
            .padding(.vertical, 14)
            .background(
                Capsule(style: .continuous)
                    .fill(Color.neural.surfaceSecondary.opacity(0.85))
                    .overlay(
                        Capsule(style: .continuous)
                            .stroke(Color.neural.accentSignal.opacity(configuration.isPressed ? 1 : 0.65), lineWidth: 1.6)
                            .shadow(color: Color.neural.accentSignal.opacity(configuration.isPressed ? 0.6 : 0.25), radius: configuration.isPressed ? 12 : 24)
                    )
            )
            .overlay(
                Capsule(style: .continuous)
                    .strokeBorder(Color.neural.pathwayBlue.opacity(0.4), lineWidth: 0.8)
                    .blur(radius: 1)
                    .blendMode(.plusLighter)
            )
            .scaleEffect(configuration.isPressed ? 0.98 : 1)
            .animation(.easeInOut(duration: 0.16), value: configuration.isPressed)
            .background(
                PulseOverlay(isActive: configuration.isPressed)
            )
    }

    private struct PulseOverlay: View {
        var isActive: Bool
        @State private var pulse = false

        var body: some View {
            Capsule(style: .continuous)
                .stroke(Color.neural.accentSignal.opacity(0.55), lineWidth: 2)
                .scaleEffect(pulse ? 1.25 : 1)
                .opacity(pulse ? 0 : 1)
                .animation(isActive ? Animation.easeOut(duration: 0.6).repeatForever(autoreverses: false) : .default, value: pulse)
                .onAppear {
                    if isActive { pulse = true }
                }
                .onChange(of: isActive) { _, newValue in
                    if newValue {
                        pulse = true
                    } else {
                        pulse = false
                    }
                }
        }
    }
}
