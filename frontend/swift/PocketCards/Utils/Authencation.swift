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
                self.isSignedIn = true
            case HubPayload.EventName.Auth.signedOut:
                print("==HUB== User signed Out, update UI")
                self.isSignedIn = false
            case HubPayload.EventName.Auth.sessionExpired:
                print("==HUB== Session expired, show sign in aui")
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

                DispatchQueue.main.async {
                    self.isSignedIn = session.isSignedIn
                }
                
                if let cognitoTokenProvider = session as? AuthCognitoTokensProvider {
                    let tokens = try cognitoTokenProvider.getCognitoTokens().get()

                    TokenManager.shared.updateTokens(tokens: tokens)
                }

            } catch {
                print("Fetch auth session failed with error - \(error)")
            }
        }
    }
    
    func signIn() {
        _ = Amplify.Auth.signInWithWebUI(for: .google, presentationAnchor: UIApplication.shared.windows.first!) { result in
            switch(result) {
            case .success(let result):
                print(result)
                
                // fetch user details
                _ = Amplify.Auth.fetchUserAttributes() { (result) in
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
        _ = Amplify.Auth.signOut() { (result) in
            print(result)
            switch(result) {
            case .success():
                print("Signout succeded")
            case .failure(let error):
                print("Signout failed with \(error)")
            }
        }
    }
}
