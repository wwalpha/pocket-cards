//
//  OAuthCredential.swift
//  PocketCards
//
//  Created by macmini on 2023/02/28.
//

import Alamofire
import Foundation

struct OAuthCredential: AuthenticationCredential {
    let accessToken: String
    let idToken: String
    let refreshToken: String
    let userID: String
    let expiration: Date

    // Require refresh if within 5 minutes of expiration
    var requiresRefresh: Bool { Date(timeIntervalSinceNow: 60 * 5) > expiration }
}
