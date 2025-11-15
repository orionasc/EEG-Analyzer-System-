import SwiftUI

struct NeuralFormField<Accessory: View>: View {
    let title: String
    let placeholder: String
    @Binding var text: String
    var accessory: Accessory

    init(title: String, placeholder: String, text: Binding<String>, @ViewBuilder accessory: () -> Accessory) {
        self.title = title
        self.placeholder = placeholder
        self._text = text
        self.accessory = accessory()
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title)
                .neuralTextStyle(.caption)
            HStack {
                TextField(placeholder, text: $text)
                    .textFieldStyle(.plain)
                    .font(NeuralTypography.body)
                    .foregroundStyle(Color.neural.textPrimary)
                    .padding(.vertical, 12)
                accessory
            }
            .padding(.horizontal, 16)
            .background(
                RoundedRectangle(cornerRadius: 18, style: .continuous)
                    .fill(Color.neural.surfacePrimary.opacity(0.75))
                    .overlay(
                        RoundedRectangle(cornerRadius: 18, style: .continuous)
                            .stroke(Color.neural.pathwayPurple.opacity(0.3), lineWidth: 1)
                            .shadow(color: Color.neural.pathwayPurple.opacity(0.35), radius: 12)
                    )
            )
            .background(
                RoundedRectangle(cornerRadius: 24, style: .continuous)
                    .fill(Color.neural.surfaceSecondary.opacity(0.45))
                    .offset(y: 6)
            )
        }
    }
}

extension NeuralFormField where Accessory == EmptyView {
    init(title: String, placeholder: String, text: Binding<String>) {
        self.init(title: title, placeholder: placeholder, text: text) { EmptyView() }
    }
}
