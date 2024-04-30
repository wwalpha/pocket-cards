//
//  ReportServices.swift
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

    enum DailyStatus {
        struct Request {}

        struct Response: Codable {
            var language: DailyTask
            var society: DailyTask
            var science: DailyTask

            private enum CodingKeys: String, CodingKey {
                case language
                case science
                case society
            }
        }
    }

    enum OverallTimes {
        struct Request {}

        struct Response: Codable {
            var language: [String: Int]
            var science: [String: Int]
            var society: [String: Int]
            var english: [String: Int]

            private enum CodingKeys: String, CodingKey {
                case language
                case science
                case society
                case english
            }
        }
    }
}
