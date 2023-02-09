//
//  TokenManager.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import AWSPluginsCore

class TokenManager {
    static let shared = TokenManager()
    private var accessToken: String = ""
    private var idToken: String = ""
    private var refreshToken: String = ""

    func updateTokens(tokens: AuthCognitoTokens) {
        accessToken = tokens.accessToken
        idToken = tokens.idToken
        refreshToken = tokens.refreshToken

        print(idToken)
    }

    func renewToken() {}

    func updateToken(idToken: String) {
        self.idToken = idToken
    }

    func clear() {
        accessToken = ""
        idToken = ""
        refreshToken = ""
    }

    func getIdToken() -> String {
        idToken
    }

    func getAccessToken() -> String {
        accessToken
    }
}
