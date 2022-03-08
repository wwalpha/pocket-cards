//
//  PocketCardsApp.swift
//  PocketCards
//
//  Created by macmini on 2022/03/08.
//

import SwiftUI

@main
struct PocketCardsApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate

    var body: some Scene {
        WindowGroup {
            ContentView().onAppear {
                Auth.initialize()
            }.environmentObject(Auth)
        }
    }
}
