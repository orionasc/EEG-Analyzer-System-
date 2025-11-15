import SwiftUI

public enum NeuralTypography {
    public static let display = Font.system(size: 32, weight: .semibold, design: .rounded)
    public static let title = Font.system(size: 24, weight: .semibold, design: .rounded)
    public static let headline = Font.system(size: 18, weight: .medium, design: .rounded)
    public static let body = Font.system(size: 15, weight: .regular, design: .rounded)
    public static let caption = Font.system(size: 13, weight: .medium, design: .rounded)
}

public struct NeuralTextStyle: ViewModifier {
    public enum Kind {
        case display, title, headline, body, caption
    }

    private let kind: Kind
    public init(_ kind: Kind) {
        self.kind = kind
    }

    public func body(content: Content) -> some View {
        switch kind {
        case .display:
            return content.font(NeuralTypography.display).foregroundStyle(Color.neural.textPrimary)
        case .title:
            return content.font(NeuralTypography.title).foregroundStyle(Color.neural.textPrimary)
        case .headline:
            return content.font(NeuralTypography.headline).foregroundStyle(Color.neural.textSecondary)
        case .body:
            return content.font(NeuralTypography.body).foregroundStyle(Color.neural.textSecondary)
        case .caption:
            return content.font(NeuralTypography.caption).foregroundStyle(Color.neural.textTertiary)
        }
    }
}

public extension View {
    func neuralTextStyle(_ kind: NeuralTextStyle.Kind) -> some View {
        modifier(NeuralTextStyle(kind))
    }
}
