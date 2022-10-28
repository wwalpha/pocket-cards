//
//  DailyStatus.swift
//  PocketCards
//
//  Created by macmini on 2022/03/24.
//

import Foundation

struct DailyTask: Codable {
    var target: Int
    var archive: Int

    private enum CodingKeys: String, CodingKey {
        case target
        case archive
    }
}
