//
//  Curriculum.swift
//  PocketCards
//
//  Created by macmini on 2022/04/26.
//

import Foundation

struct Curriculum: Codable {
    var id: String
    var subject: String
    var guardian: String
    var userId: String
    var groupId: String
    var groupName: String?

    private enum CodingKeys: String, CodingKey {
        case id
        case subject
        case guardian
        case userId
        case groupId
        case groupName
    }
}
