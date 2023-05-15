//
//  OAuthAuthenticator.swift
//  PocketCards
//
//  Created by macmini on 2023/02/28.
//

import Alamofire
import Foundation

class OAuthAuthenticator: Authenticator {
    func apply(_ credential: OAuthCredential, to urlRequest: inout URLRequest) {
        urlRequest.headers.add(.authorization(credential.idToken))
    }

    func refresh(_ credential: OAuthCredential,
                 for _: Session,
                 completion: @escaping (Result<OAuthCredential, Error>) -> Void)
    {
        // 未初期化
        if credential.refreshToken.isEmpty, !TokenManager.shared.getRefreshToken().isEmpty {
            let newCredential = OAuthCredential(
                accessToken: TokenManager.shared.getAccessToken(),
                idToken: TokenManager.shared.getIdToken(),
                refreshToken: TokenManager.shared.getRefreshToken(),
                userID: "U0",
                expiration: Date(timeIntervalSinceNow: 60 * 60)
            )

            completion(.success(newCredential))

            return
        }

        let params = [
            "accessToken": credential.accessToken,
            "refreshToken": credential.refreshToken,
        ]

        AF.request(URLs.REFRESH_TOKEN, method: .post, parameters: params)
            .responseDecodable(of: AuthServices.RefreshToken.Response.self) { response in
                debugPrint("refresh token response", response)

                guard let res = response.value else { return }

                let newCredential = OAuthCredential(
                    accessToken: res.accessToken,
                    idToken: res.idToken,
                    refreshToken: credential.refreshToken,
                    userID: "U0",
                    expiration: Date(timeIntervalSinceNow: 60 * 60)
                )

                completion(.success(newCredential))
            }
    }

    func didRequest(_: URLRequest,
                    with response: HTTPURLResponse,
                    failDueToAuthenticationError _: Error) -> Bool
    {
        debugPrint(response.statusCode)

        // If authentication server CANNOT invalidate credentials, return `false`
        return response.statusCode == 403
    }

    func isRequest(_ urlRequest: URLRequest, authenticatedWith credential: OAuthCredential) -> Bool {
        // If authentication server CAN invalidate credentials, then compare the "Authorization" header value in the
        // `URLRequest` against the Bearer token generated with the access token of the `Credential`.
        urlRequest.headers["Authorization"] == credential.idToken
    }
}
