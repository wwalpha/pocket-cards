//
//  Group.swift
//  PocketCards
//
//  Created by macmini on 2022/04/25.
//

import Foundation

struct Group: Codable {
    var id: String
    var subject: String
    var name: String?
    var description: String?
    var count: Int?
    var index: Int?

    private enum CodingKeys: String, CodingKey {
        case id
        case subject
        case name
        case description
        case count
        case index
    }
}
