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
    func application(_: UIApplication, didFinishLaunchingWithOptions _: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
        do {
            try Amplify.add(plugin: AWSCognitoAuthPlugin())

            guard let data = AMPLIFY_CONFIGURATION else { return true }
            let configuration = try JSONDecoder().decode(AmplifyConfiguration.self, from: data)
            try Amplify.configure(configuration)

            #if CAT
                debugPrint(123_456)
                // listen
                Auth.eventListen()
            #endif
        } catch {
            print("Failed to initialize Amplify with \(error)")
        }

        return true
    }
}
