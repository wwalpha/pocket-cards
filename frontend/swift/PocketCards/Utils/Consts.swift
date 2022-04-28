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
    static let SIGN_IN = "\(HOST)/v1/auth/login"
    static let WEEKLY_TEST = "\(HOST)/v1/questions/weekly"
    static let WEEKLY_PRACTICE = "\(HOST)/v1/questions/weekly"

    static let GROUP_LIST = "\(HOST)/v1/groups"
    static let CURRICULUM_LIST = "\(HOST)/v1/curriculums"

    static let REPORTS_PROGRESS = "\(HOST)/v1/reports/progress"
    static let REPORTS_OVERALL = "\(HOST)/v1/reports/overall"
    static let REPORTS_DAILY_TASKS = "\(HOST)/v1/reports/dailytasks"

    static func QUESTION_LIST(groupId: String) -> String {
        "\(HOST)/v1/groups/\(groupId)/questions"
    }

    static func ANSWER(id: String) -> String {
        "\(HOST)/v1/questions/\(id)/answer"
    }

    static func USER_CURRICULUM_LIST(userId: String) -> String {
        "\(HOST)/v1/users/\(userId)/curriculums"
    }

    static func WEEKLY_ANSWER(id: String) -> String {
        "\(HOST)/v1/questions/weekly/\(id)"
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
