//
//  Question.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import Foundation

struct Question: Codable {
    var id: String
    var setId: String
    var title: String
    var description: String
    var lastTime: String
    var nextTime: String
    var times: Int
    var choices: [String]
    var answer: String

    private enum CodingKeys: String, CodingKey {
        case id
        case setId
        case title
        case description
        case lastTime
        case nextTime
        case times
        case choices
        case answer
    }
}
