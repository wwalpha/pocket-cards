//
//  AppDelegate.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import Amplify
import AmplifyPlugins
import Foundation
import UIKit

class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(_: UIApplication, didFinishLaunchingWithOptions _: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
        do {
            try Amplify.add(plugin: AWSCognitoAuthPlugin())
            try Amplify.add(plugin: AWSS3StoragePlugin())

            guard let data = AMPLIFY_CONFIGURATION else { return true }
            let configuration = try JSONDecoder().decode(AmplifyConfiguration.self, from: data)
            try Amplify.configure(configuration)

            #if CAT
                // listen
                Auth.eventListen()
            #endif

            #if DEBUG
                // listen
                Auth.eventListen()
            #endif
        } catch {
            print("Failed to initialize Amplify with \(error)")
        }

        return true
    }
}
