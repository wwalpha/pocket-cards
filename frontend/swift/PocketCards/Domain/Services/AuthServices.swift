//
//  AuthServices.swift
//  PocketCards
//
//  Created by macmini on 2023/02/28.
//

import Foundation

enum AuthServices {
    enum RefreshToken {
        struct Request {}

        struct Response: Codable {
            var accessToken: String
            var idToken: String

            private enum CodingKeys: String, CodingKey {
                case accessToken
                case idToken
            }
        }
    }
}
