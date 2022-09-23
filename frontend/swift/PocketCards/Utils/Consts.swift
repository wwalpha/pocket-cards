//
//  Consts.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import Foundation

class URLs {
    private static let HOST = API_URL

    static func WSS_URL(token: String) -> String {
        "\(SOCKET_URL)?Authorization=\(token)"
    }

    static let STUDY_DAILY_CURRICULUM_ORDER = "\(HOST)/v1/study/daily/order/questions"
    static let STUDY_DAILY_PRACTICE = "\(HOST)/v1/study/daily/practice/questions"
    static let STUDY_DAILY_TEST = "\(HOST)/v1/study/daily/test/questions"
    static let STUDY_DAILY_REVIEW = "\(HOST)/v1/study/daily/review/questions"

    static func STUDY_DAILY_ANSWER(id: String) -> String {
        "\(HOST)/v1/study/daily/test/questions/\(id)"
    }

    static func STUDY_WEEKLY_QUESTIONS(id: String) -> String {
        "\(HOST)/v1/study/weekly/\(id)/questions"
    }

    static func STUDY_WEEKLY_ANSWER(id: String, qid: String) -> String {
        "\(HOST)/v1/study/weekly/\(id)/questions/\(qid)"
    }

    static let SIGN_IN = "\(HOST)/v1/auth/login"
    static let GROUP_LIST = "\(HOST)/v1/groups"

    static let CURRICULUM_LIST = "\(HOST)/v1/curriculums"

    static func CURRICULUM_QUESTIONS(curriculumId: String) -> String {
        "\(HOST)/v1/curriculums/\(curriculumId)/questions"
    }

    static let REPORTS_PROGRESS = "\(HOST)/v1/reports/progress"
    static let REPORTS_OVERALL = "\(HOST)/v1/reports/overall"
    static let REPORTS_DAILY_TASKS = "\(HOST)/v1/reports/dailytasks"
    static let REPORTS_INQUIRY = "\(HOST)/v1/reports/inquiry"

    static func QUESTION_LIST(groupId: String) -> String {
        "\(HOST)/v1/groups/\(groupId)/questions"
    }

    static func QUESTION_DESCRIBE(gid: String, qid: String) -> String {
        "\(HOST)/v1/groups/\(gid)/questions/\(qid)"
    }

    static func USER_CURRICULUM_LIST(userId: String) -> String {
        "\(HOST)/v1/users/\(userId)/curriculums"
    }

    static let REPORT_DAILY = "\(HOST)/v1/reports/daily"
}

enum SUBJECT {
    static let ENGLISH = "0"
    static let LANGUAGE = "1"
    static let SCIENCE = "2"
    static let SOCIETY = "3"
    static let MATHS = "4"
}

enum MODE {
    static let STUDY = "1"
    static let TEST = "2"
    static let WEEKLY_ABILITY = "3"
    static let WEEKLY_PRACTICE = "4"
}

enum Correct {
    private static let correct = "1"
    private static let uncorrect = "0"

    static func convert(value: Bool) -> String {
        value ? correct : uncorrect
    }
}
