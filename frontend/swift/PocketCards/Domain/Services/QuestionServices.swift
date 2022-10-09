//
//  QuestionServices.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import Combine

enum QuestionServices {
    enum LoadQuestion {
        struct Request {}

        struct Response2: Codable {
            var count: Int
            var questions: [Question]
        }

        struct Response: Codable {
            var count: Int
            var questions: [Question]

            private enum CodingKeys: String, CodingKey {
                case count
                case questions
            }
        }
    }

    enum Weekly {
        struct Request {}

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
