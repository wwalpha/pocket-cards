//
//  PocketCardsApp.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import SwiftUI

@main
struct PocketCardsApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appDelegate.auth)
        }
    }
}
