//
//  WeeklyPracticeInteractor.swift
//  PocketCards
//
//  Created by macmini on 2022/04/25.
//
//

import Foundation

class WeeklyPracticeInteractor: PracticeInteractor {
    private var groupId: String

    init(groupId: String) {
        self.groupId = groupId
        super.init(subject: "")
    }

    override func updateAnswer(id: String?, correct: Bool) {
        guard let qid = id else { return }

        // remove answered question
        removeQuestion(id: qid)

        Task {
            let params = [
                "correct": Correct.convert(value: correct),
                "mode": "practice",
            ]

            // update answer
            _ = await API.request(URLs.STUDY_WEEKLY_ANSWER(id: groupId, qid: qid), method: .post, parameters: params).serializingString().response
        }
    }

    override func loadQuestions() {
        API.request(URLs.STUDY_WEEKLY_QUESTIONS(id: groupId), method: .get)
            .validate()
            .responseDecodable(of: QuestionServices.Weekly.Response.self) { response in
                guard let res = response.value else { return }

                self.addQuestions(questions: res.questions)
            }
    }
}

extension WeeklyPracticeInteractor: WeeklyPracticeBusinessLogic {}
