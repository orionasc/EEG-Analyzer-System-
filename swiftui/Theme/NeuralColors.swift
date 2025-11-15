import SwiftUI

public enum NeuralColor: String {
    case surfacePrimary
    case surfaceSecondary
    case surfaceTertiary
    case accentSignal
    case pathwayBlue
    case pathwayPurple
    case textPrimary
    case textSecondary
    case textTertiary
    case outline
    case warning
}

public extension Color {
    static let neural = NeuralColorPalette()
}

public struct NeuralColorPalette {
    public let surfacePrimary = Color(red: 0.97, green: 0.94, blue: 0.90)
    public let surfaceSecondary = Color(red: 0.13, green: 0.13, blue: 0.15).opacity(0.85)
    public let surfaceTertiary = Color(red: 0.18, green: 0.18, blue: 0.21)
    public let accentSignal = Color(red: 0.98, green: 0.67, blue: 0.21)
    public let pathwayBlue = Color(red: 0.48, green: 0.71, blue: 0.87)
    public let pathwayPurple = Color(red: 0.56, green: 0.52, blue: 0.74)
    public let textPrimary = Color(red: 0.11, green: 0.10, blue: 0.12)
    public let textSecondary = Color(red: 0.27, green: 0.26, blue: 0.30)
    public let textTertiary = Color(red: 0.54, green: 0.51, blue: 0.55)
    public let outline = Color(red: 0.34, green: 0.32, blue: 0.36)
    public let warning = Color(red: 0.98, green: 0.42, blue: 0.22)

    public func gradientPathway(intensity: Double) -> LinearGradient {
        let blend = Gradient(colors: [pathwayPurple.opacity(0.7 + intensity * 0.2), pathwayBlue.opacity(0.6 + intensity * 0.3)])
        return LinearGradient(gradient: blend, startPoint: .topLeading, endPoint: .bottomTrailing)
    }

    public func surfaceGradient() -> LinearGradient {
        LinearGradient(gradient: Gradient(colors: [surfacePrimary.opacity(0.92), surfaceSecondary.opacity(0.45)]), startPoint: .topLeading, endPoint: .bottomTrailing)
    }
}
