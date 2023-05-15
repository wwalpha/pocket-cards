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
    }

    func updateAccessToken(token: String) {
        accessToken = token
    }

    func updateIdToken(token: String) {
        idToken = token
    }

    func updateRefreshToken(token: String) {
        refreshToken = token
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

    func getRefreshToken() -> String {
        refreshToken
    }
}
