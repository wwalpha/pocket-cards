//
//  UserAttributes.swift
//  PocketCards
//
//  Created by macmini on 2022/04/26.
//

import Foundation

struct UserAttributes: Codable {
    var userId: String
    var providerName: String
    var providerType: String
    var issuer: String?
    var primary: Bool
    var dateCreated: Int

    private enum CodingKeys: String, CodingKey {
        case userId
        case providerName
        case providerType
        case issuer
        case primary
        case dateCreated
    }
}
