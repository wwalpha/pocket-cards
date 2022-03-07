//
//  QuestionServices.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import Foundation

enum QuestionService {
    enum LoadQuestion {
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
