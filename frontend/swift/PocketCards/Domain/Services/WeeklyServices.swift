//
//  WeeklyService.swift
//  PocketCards
//
//  Created by macmini on 2022/04/29.
//

import Foundation

enum WeeklyServices {
    enum Regist {
        struct Response: Codable {
            var groupId: String

            private enum CodingKeys: String, CodingKey {
                case groupId
            }
        }
    }

    enum List {
        struct Response: Codable {
            var count: Int
            var questions: [Question]

            private enum CodingKeys: String, CodingKey {
                case count
                case questions
            }
        }
    }
}
