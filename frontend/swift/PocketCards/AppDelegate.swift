//
//  AppDelegate.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import Amplify
import AmplifyPlugins
import AWSPluginsCore

class AppDelegate: UIResponder, UIApplicationDelegate {

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
        do {
            try Amplify.add(plugin: AWSCognitoAuthPlugin())
            try Amplify.configure()
            
            print("Amplify configured with auth plugin")

            // listen
            Auth.eventListen()
            
        } catch {
            print("Failed to initialize Amplify with \(error)")
        }
        
        return true
    }
    

}
