//
//  HistoryServices.swift
//  PocketCards
//
//  Created by macmini on 2022/03/23.
//

import Foundation

enum ReportServices {
    enum LearningProgress {
        struct Request {}

        struct Response: Codable {
            var histories: [History]

            private enum CodingKeys: String, CodingKey {
                case histories
            }
        }
    }

    enum DailyTasks {
        struct Request {}

        struct Response: Codable {
            var language: DailyTask
            var society: DailyTask
            var science: DailyTask
            var maths: DailyTask

            private enum CodingKeys: String, CodingKey {
                case language
                case science
                case society
                case maths
            }
        }
    }

    enum OverallTimes {
        struct Request {}

        struct Response: Codable {
            var language: [String: Int]
            var science: [String: Int]
            var society: [String: Int]
            var maths: [String: Int]

            private enum CodingKeys: String, CodingKey {
                case language
                case science
                case society
                case maths
            }
        }
    }
}
