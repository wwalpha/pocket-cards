//
//  NavigationBarModifier.swift
//  PocketCards
//
//  Created by macmini on 2022/03/12.
//

import SwiftUI

struct NavigationBarModifier: ViewModifier {
    let backgroundColor: UIColor

    init(backgroundColor: UIColor, foregroundColor: UIColor) {
        self.backgroundColor = backgroundColor

        // [1]
        let coloredAppearance = UINavigationBarAppearance()
        coloredAppearance.configureWithTransparentBackground()
        coloredAppearance.backgroundColor = backgroundColor
        coloredAppearance.titleTextAttributes = [.foregroundColor: foregroundColor]
        coloredAppearance.largeTitleTextAttributes = [.foregroundColor: foregroundColor]

        // [2]
        UINavigationBar.appearance().standardAppearance = coloredAppearance
        UINavigationBar.appearance().compactAppearance = coloredAppearance
        UINavigationBar.appearance().scrollEdgeAppearance = coloredAppearance
        UINavigationBar.appearance().tintColor = .white
    }

    func body(content: Content) -> some View {
        content
    }
}

extension View {
    func navigationBarColor(_ backgroundColor: UIColor, _ foregroundColor: UIColor = UIColor.white) -> some View {
        modifier(NavigationBarModifier(backgroundColor: backgroundColor, foregroundColor: foregroundColor))
    }
}
