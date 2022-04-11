//
//  Consts.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import Foundation

class URLs {
    private static let HOST = API_URL
    static let STUDY = "\(HOST)/v1/questions/study"
    static let TEST = "\(HOST)/v1/questions/test"

    static let PROGRESS = "\(HOST)/v1/reports/progress"
    static let DAILY_TASKS = "\(HOST)/v1/reports/dailytasks"

    static func ANSWER(id: String) -> String {
        "\(HOST)/v1/questions/\(id)/answer"
    }

    static let REPORT_DAILY = "\(HOST)/v1/reports/daily"
}

enum SUBJECT {
    static let LANGUAGE = "1"
    static let SCIENCE = "2"
    static let SOCIETY = "3"
}

enum MODE {
    static let STUDY = "1"
    static let TEST = "2"
}

enum Correct {
    private static let correct = "1"
    private static let uncorrect = "0"

    static func convert(value: Bool) -> String {
        value ? correct : uncorrect
    }
}
