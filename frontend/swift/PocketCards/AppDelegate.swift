//
//  AppDelegate.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import Amplify
import AmplifyPlugins

class AppDelegate: UIResponder, UIApplicationDelegate {
    let auth = Authentication()
//    let appState = AppState()

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
        do {
            try Amplify.add(plugin: AWSCognitoAuthPlugin())
            try Amplify.configure()
            
            print("Amplify configured with auth plugin")
//            try apiPlugin.add(interceptor: CustomInterceptor(), for: "API")

            auth.eventListen()
            // initialize
            auth.initialize()
            
        } catch {
            print("Failed to initialize Amplify with \(error)")
        }
        
        return true
    }
    

}
