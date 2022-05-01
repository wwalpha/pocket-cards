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
import Combine

let Auth = Authentication()

class Authentication: ObservableObject {
    @Published var isSignedIn: Bool = false
    var userId: String = ""

    func eventListen() {
        _ = Amplify.Hub.listen(to: .auth) { payload in
            switch payload.eventName {
            case HubPayload.EventName.Auth.signedIn:
                print("==HUB== User signed In, update UI")
//                DispatchQueue.main.async {
//                    self.isSignedIn = true
//                }
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
                print("==HUB== fetchSessionAPI")
            case HubPayload.EventName.Auth.fetchUserAttributesAPI:
                print("==HUB== fetchUserAttributesAPI")
                guard let results = payload.data as? Swift.Result<[AuthUserAttribute], AuthError> else { return }

                switch results {
                case let .success(attributes):
                    let identities = attributes.first(where: { $0.key == AuthUserAttributeKey.unknown("identities") })
                    guard let value = identities?.value else { return }
                    guard let datas = value.data(using: .utf8) else { return }

                    do {
                        let decoder = JSONDecoder()

                        let attr = try decoder.decode([UserAttributes].self, from: datas)

                        DispatchQueue.main.async {
                            self.userId = "\(attr[0].providerName)_\(attr[0].userId)"
                            self.isSignedIn = true
                        }

                    } catch {}

                case let .failure(error):
                    print("Fetching user attributes failed with error \(error)")
                }

                print("==HUB== fetchUserAttributesAPI2")
            default:
                print("==HUB== \(payload)")
            }
        }
    }

    func initialize() {
        _ = Amplify.Auth.fetchAuthSession { result in
            do {
                let session = try result.get()

                if let cognitoTokenProvider = session as? AuthCognitoTokensProvider {
                    let tokens = try cognitoTokenProvider.getCognitoTokens().get()

                    TokenManager.shared.updateTokens(tokens: tokens)

                    _ = Amplify.Auth.fetchUserAttributes()
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
                _ = Amplify.Auth.fetchUserAttributes()
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
            .responseDecodable(of: UserServices.SignIn.Response.self) { response in
                guard let res = response.value else { return }

                // save token
                TokenManager.shared.updateToken(idToken: res.idToken)
                self.isSignedIn = true
            }
    }
}
