//
//  DailyTasks.swift
//  PocketCards
//
//  Created by macmini on 2022/03/24.
//

import Foundation

struct DailyTask: Codable {
    var target: Int
    var test: Int
    var unlearned: Int
    var relearning: Int

    private enum CodingKeys: String, CodingKey {
        case target
        case test
        case unlearned
        case relearning
    }
}
