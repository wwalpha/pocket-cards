//
//  Question.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import Foundation

struct Question: Codable {
    var id: String
    var groupId: String
    var title: String
    var description: String?
    var choices: [String]?
    var answer: String

    private enum CodingKeys: String, CodingKey {
        case id
        case groupId
        case title
        case description
        case choices
        case answer
    }
}
