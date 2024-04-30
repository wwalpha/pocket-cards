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
    static let english = Color("English")

    static let english_ui = UIColor(red: 27 / 255, green: 90 / 255, blue: 170 / 255, alpha: 1)
    static let language_ui = UIColor(red: 190 / 255, green: 32 / 255, blue: 47 / 255, alpha: 1)
    static let society_ui = UIColor(red: 44 / 255, green: 143 / 255, blue: 67 / 255, alpha: 1)
    static let science_ui = UIColor(red: 224 / 255, green: 108 / 255, blue: 39 / 255, alpha: 1)

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

    init(hex: UInt, alpha _: Double = 1) {
        self.init(
            .sRGB,
            red: Double((hex >> 16) & 0xFF) / 255,
            green: Double((hex >> 08) & 0xFF) / 255,
            blue: Double((hex >> 00) & 0xFF) / 255,
            opacity: 1
        )
    }
}
