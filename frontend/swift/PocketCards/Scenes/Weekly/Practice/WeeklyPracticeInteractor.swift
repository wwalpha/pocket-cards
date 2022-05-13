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

            // add questions
            if questions.count < 5 {
                await loadQuestions()
            }
        }
    }

    override func loadQuestions() async {
        do {
            let res = try await API.request(URLs.STUDY_WEEKLY_QUESTIONS(id: groupId), method: .get).serializingDecodable(QuestionServices.Weekly.Response.self).value

            addQuestions(questions: res.questions)
        } catch {
            debugPrint(error)
        }
    }
}

extension WeeklyPracticeInteractor: WeeklyPracticeBusinessLogic {}
