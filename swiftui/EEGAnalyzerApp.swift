import SwiftUI

@main
struct EEGAnalyzerApp: App {
    var body: some Scene {
        WindowGroup {
            NeuralRootView()
                .preferredColorScheme(.light)
        }
    }
}
