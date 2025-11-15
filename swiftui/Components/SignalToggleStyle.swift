import SwiftUI

struct SignalToggleStyle: ToggleStyle {
    func makeBody(configuration: Configuration) -> some View {
        HStack {
            configuration.label
            Spacer()
            ZStack {
                Capsule(style: .continuous)
                    .fill(Color.neural.surfaceSecondary.opacity(configuration.isOn ? 0.7 : 0.35))
                    .overlay(
                        Capsule(style: .continuous)
                            .stroke(Color.neural.pathwayBlue.opacity(configuration.isOn ? 0.5 : 0.25), lineWidth: 1.4)
                    )
                    .frame(width: 66, height: 32)
                Circle()
                    .fill(configuration.isOn ? Color.neural.accentSignal : Color.neural.surfacePrimary)
                    .frame(width: 28, height: 28)
                    .shadow(color: Color.neural.accentSignal.opacity(configuration.isOn ? 0.5 : 0.0), radius: 12, x: 0, y: 0)
                    .padding(2)
                    .offset(x: configuration.isOn ? 14 : -14)
                    .overlay(
                        Circle()
                            .stroke(Color.neural.pathwayPurple.opacity(0.4), lineWidth: 1)
                    )
                    .animation(.spring(response: 0.35, dampingFraction: 0.8), value: configuration.isOn)
            }
            .onTapGesture {
                configuration.isOn.toggle()
            }
        }
        .padding(.vertical, 6)
    }
}
