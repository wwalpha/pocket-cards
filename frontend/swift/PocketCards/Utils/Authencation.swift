//
//  Authencation.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import Amplify
import AmplifyPlugins
import AWSPluginsCore

let Auth = Authentication()

class Authentication: ObservableObject {
    @Published var isSignedIn: Bool = false

    func eventListen() -> Void {
        _ = Amplify.Hub.listen(to: .auth) { (payload) in
            switch payload.eventName {
            case HubPayload.EventName.Auth.signedIn:
                print("==HUB== User signed In, update UI")
                DispatchQueue.main.async {
                    self.isSignedIn = true
                }
            case HubPayload.EventName.Auth.signedOut:
                print("==HUB== User signed Out, update UI")
                DispatchQueue.main.async {
                    self.isSignedIn = false
                }
            case HubPayload.EventName.Auth.sessionExpired:
                print("==HUB== Session expired, show sign in aui")
                self.isSignedIn = false
                self.initialize()
            case HubPayload.EventName.Auth.fetchSessionAPI:
                print("==HUB== Session expired, show sign in aui")
            case HubPayload.EventName.Auth.fetchUserAttributesAPI:
                self.initialize()
            default:
                print("==HUB== \(payload)")
                break
            }
        }
    }
    
    func initialize() -> Void {
        _ = Amplify.Auth.fetchAuthSession { result in
            do {
                let session = try result.get()

                print("fetchAuthSession", session)
                
                DispatchQueue.main.async {
                    self.isSignedIn = session.isSignedIn
                }
                
                if let cognitoTokenProvider = session as? AuthCognitoTokensProvider {
                    let tokens = try cognitoTokenProvider.getCognitoTokens().get()

                    print("updateTokens", tokens)

                    TokenManager.shared.updateTokens(tokens: tokens)
                }

            } catch {
                print("Fetch auth session failed with error - \(error)")
            }
        }
    }
    
    func signIn() {
        let scenes = UIApplication.shared.connectedScenes
        let windowScene = scenes.first as? UIWindowScene
        let window = windowScene?.windows.first
        
        _ = Amplify.Auth.signInWithWebUI(for: .google, presentationAnchor: window!, options: .preferPrivateSession()) { result in
            switch(result) {
            case .success(let result):
                print(result)
                
                // fetch user details
                _ = Amplify.Auth.fetchUserAttributes() { result in
                    switch result {
                    case .success(let session):
                        print(session)
                    case .failure(let error):
                        print(error)
                    }
                }
            case .failure(let error):
                print("Can not signin \(error)")
            }
        }
    }
    
    func signOut() {
        _ = Amplify.Auth.signOut(options: .init(globalSignOut: true)) { (result) in
            print(result)
            switch(result) {
            case .success():
                print("Signout succeded")
                TokenManager.shared.clear()
                
            case .failure(let error):
                print("Signout failed with \(error)")
            }
        }
    }
}
