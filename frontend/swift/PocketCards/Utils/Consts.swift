//
//  Consts.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import Foundation

let APP_VERSION = "v0.9.20"

enum URLs {
    private static let HOST = API_URL

    static func WSS_URL(token: String) -> String {
        "\(SOCKET_URL)?Authorization=\(token)"
    }

    static let VISION_HANDWRITING = "\(HOST)/v1/vision/handwriting"

    static let STUDY_DAILY_CURRICULUM_ORDER = "\(HOST)/v1/study/daily/order/questions"

    static let STUDY_DAILY_PRACTICE = "\(HOST)/v1/study/daily/practice"
    static let STUDY_DAILY_EXAM = "\(HOST)/v1/study/daily/exam"
    static let STUDY_DAILY_REVIEW = "\(HOST)/v1/study/daily/review"
    static let STUDY_DAILY_ANSWER = "\(HOST)/v1/study/daily/answer"

    static let STUDY_WEEKLY_QUESTIONS = "\(HOST)/v1/study/weekly"

    static func STUDY_WEEKLY_ANSWER(qid: String) -> String {
        "\(HOST)/v1/study/weekly/\(qid)"
    }

    static let SIGN_IN = "\(HOST)/v1/auth/login"
    static let GROUP_LIST = "\(HOST)/v1/groups"

    static let CURRICULUM_LIST = "\(HOST)/v1/curriculums"

    static func CURRICULUM_QUESTIONS(curriculumId: String) -> String {
        "\(HOST)/v1/curriculums/\(curriculumId)/questions"
    }

    static let REPORTS_PROGRESS = "\(HOST)/v1/reports/progress"
    static let REPORTS_OVERALL = "\(HOST)/v1/reports/overall"
    static let REPORTS_DAILY_STATUS = "\(HOST)/v1/reports/status/daily"
    static let REPORTS_INQUIRY = "\(HOST)/v1/inquiries"

    static let REFRESH_TOKEN = "\(HOST)/v1/auth/refresh"

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

enum Consts {
    static let PRACTICE_TITLE = "日々の演習"
    static let TEST_TITLE = "日々のテスト"
    static let REVIEW_TITLE = "繰り替え学習"
}

let SUBJECT_TITLE: [String: String] = [
    SUBJECT.LANGUAGE: "国語",
    SUBJECT.SCIENCE: "理科",
    SUBJECT.SOCIETY: "社会",
]

enum ScreenStatus {
    static let INITIALIZE = "0"
    static let LOADING = "1"
    static let STUDING = "2"
    static let FINISHED = "3"
}

enum SUBJECT {
    static let ENGLISH = "0"
    static let LANGUAGE = "1"
    static let SCIENCE = "2"
    static let SOCIETY = "3"
    static let MATHS = "4"
    static let HANDWRITING = "5"
}

enum MODE {
    static let PRACTICE = "1"
    static let EXAM = "2"
    static let WEEKLY = "3"
    static let REVIEW = "4"
}

enum Correct {
    private static let correct = "1"
    private static let uncorrect = "0"

    static func convert(value: Bool) -> String {
        value ? correct : uncorrect
    }
}
