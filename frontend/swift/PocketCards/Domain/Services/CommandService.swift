//
//  CommandService.swift
//  PocketCards
//
//  Created by macmini on 2022/09/20.
//

import Foundation

enum CommandServices {
    enum QuestionQuery {
        struct Body: Codable {
            var gid: String
            var qid: String

            private enum CodingKeys: String, CodingKey {
                case gid
                case qid
            }
        }

        struct Response: Codable {
            var question: Question

            private enum CodingKeys: String, CodingKey {
                case question
            }
        }
    }
}
