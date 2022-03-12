//
//  AppDelegate.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import Amplify
import AmplifyPlugins
import AWSPluginsCore
import Foundation

class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
        do {
            try Amplify.add(plugin: AWSCognitoAuthPlugin())

            guard let data = AMPLIFY_CONFIGURATION else { return true }
            let configuration = try JSONDecoder().decode(AmplifyConfiguration.self, from: data)
            try Amplify.configure(configuration)

            print("Amplify configured with auth plugin")

            // listen
            Auth.eventListen()

        } catch {
            print("Failed to initialize Amplify with \(error)")
        }

        return true
    }
}
