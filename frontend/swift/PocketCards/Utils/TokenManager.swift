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
        self.accessToken = tokens.accessToken
        self.idToken = tokens.idToken
        self.refreshToken = tokens.refreshToken
    }
    
    func clear() {
        self.accessToken = ""
        self.idToken = ""
        self.refreshToken = ""
    }
    
    func getIdToken() -> String {
        return self.idToken
    }
    
    func getAccessToken() -> String {
        return self.accessToken
    }
}
