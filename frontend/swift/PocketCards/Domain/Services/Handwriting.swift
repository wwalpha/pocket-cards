//
//  Handwriting.swift
//  PocketCards
//
//  Created by macmini on 2022/10/10.
//

import Foundation

enum HandwritingServices {
    enum Handwriting {
        struct Response: Codable {
            var results: [String]

            private enum CodingKeys: String, CodingKey {
                case results
            }
        }
    }
}
