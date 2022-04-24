//
//  Authencation.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import Alamofire
import Amplify
import AmplifyPlugins
import AWSPluginsCore

let Auth = Authentication()

class Authentication: ObservableObject {
    @Published var isSignedIn: Bool = false

    func eventListen() {
        _ = Amplify.Hub.listen(to: .auth) { payload in
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
                DispatchQueue.main.async {
                    self.isSignedIn = false
                }
            //                self.initialize()
            case HubPayload.EventName.Auth.fetchSessionAPI:
                print("==HUB== Session expired, show sign in aui")
            case HubPayload.EventName.Auth.fetchUserAttributesAPI:
                self.initialize()
            default:
                print("==HUB== \(payload)")
            }
        }
    }

    func initialize() {
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
            switch result {
            case let .success(result):
                print(result)

                // fetch user details
                _ = Amplify.Auth.fetchUserAttributes { result in
                    switch result {
                    case let .success(session):
                        print(session)
                    case let .failure(error):
                        print(error)
                    }
                }
            case let .failure(error):
                print("Can not signin \(error)")
            }
        }
    }

    func signOut() {
        _ = Amplify.Auth.signOut(options: .init(globalSignOut: true)) { result in
            print(result)
            switch result {
            case .success():
                print("Signout succeded")
                TokenManager.shared.clear()

            case let .failure(error):
                print("Signout failed with \(error)")
            }
        }
    }

    func signInWithUser(username: String, password: String) {
        let params = [
            "username": username,
            "password": password,
        ]

        API.request(URLs.SIGN_IN, method: .post, parameters: params)
            .validate()
            .responseDecodable(of: UserServiceEnum.SignIn.Response.self) { response in
                guard let res = response.value else { return }

                // save token
                TokenManager.shared.updateToken(idToken: res.idToken)
                self.isSignedIn = true
            }
    }
}
