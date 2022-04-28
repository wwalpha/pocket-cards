//
//  GroupServices.swift
//  PocketCards
//
//  Created by macmini on 2022/04/25.
//

import Foundation

enum GroupServices {
    enum GroupList {
        struct Request {}

        struct Response: Codable {
            var count: Int
            var items: [Group]

            private enum CodingKeys: String, CodingKey {
                case count
                case items
            }
        }
    }
}
