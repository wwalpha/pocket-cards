//
//  Overalls.swift
//  PocketCards
//
//  Created by macmini on 2022/04/11.
//

import Foundation

struct Overalls: Codable {
    var language: [String: Int]
    var science: [String: Int]
    var society: [String: Int]

    private enum CodingKeys: String, CodingKey {
        case language
        case science
        case society
    }
}
