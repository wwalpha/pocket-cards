//
//  History.swift
//  PocketCards
//
//  Created by macmini on 2022/03/23.
//

import Foundation

struct History: Codable {
    var timestamp: String
    var japanese: Int?
    var science: Int?
    var society: Int?

    private enum CodingKeys: String, CodingKey {
        case timestamp
        case japanese
        case science
        case society
    }
}
