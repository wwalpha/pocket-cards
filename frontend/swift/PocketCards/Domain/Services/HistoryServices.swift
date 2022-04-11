//
//  HistoryServices.swift
//  PocketCards
//
//  Created by macmini on 2022/03/23.
//

import Foundation

enum ReportService {
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

            private enum CodingKeys: String, CodingKey {
                case language
                case science
                case society
            }
        }
    }
}
