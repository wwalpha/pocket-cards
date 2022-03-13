//
//  Colors.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import SwiftUI

extension Color {
    static let language = Color("Language")
    static let languageLight = Color("LanguageLight")
    static let languageMiddle = Color("LanguageMiddle")

    static let society = Color("Society")
    static let science = Color("Science")
    static let grey50 = Color("Grey50")
    static let grey100 = Color("Grey100")
    static let systemYellow = Color("Yellow")
    static let green100 = Color("Green100")
    static let primaryColor = Color("Primary")
    static let primaryDarkColor = Color("PrimaryDark")
    static let secondaryColor = Color("Secondary")
    static let accentColor = Color("Accent1")
    static let accent2 = Color("Accent2")
    static let error = Color("Error")

    init(hex: UInt, alpha: Double = 1) {
        self.init(
            .sRGB,
            red: Double((hex >> 16) & 0xff) / 255,
            green: Double((hex >> 08) & 0xff) / 255,
            blue: Double((hex >> 00) & 0xff) / 255,
            opacity: 1
        )
    }
}

