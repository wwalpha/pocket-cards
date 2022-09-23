//
//  Commands.swift
//  PocketCards
//
//  Created by macmini on 2022/09/20.
//

import Foundation

struct Command: Codable {
    var command: String
    var payload: String?

    private enum CodingKeys: String, CodingKey {
        case command
        case payload
    }
}
