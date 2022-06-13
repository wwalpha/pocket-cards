//
//  WeeklyTestInteractor.swift
//  PocketCards
//
//  Created by macmini on 2022/04/24.
//
//

import Alamofire

class WeeklyTestInteractor: TestInteractor {
    private var groupId: String

    init(groupId: String) {
        self.groupId = groupId
        super.init(subject: "", loadUrl: "")
    }

    override func removeQuestion(id: String) {
        // remove updated question
        questions.removeAll(where: { $0.id == id })
        // record answered questions
        answered.append(id)
    }

    override func loadQuestions() {
        Task {
            let parameters = ["reset": "1"]

            let response = try await API.request(URLs.STUDY_WEEKLY_QUESTIONS(id: groupId), method: .get, parameters: parameters)
                .serializingDecodable(WeeklyServices.List.Response.self).value

            self.addQuestions(questions: response.questions)
        }

//        Task {
//            var results = try await withThrowingTaskGroup(of: [Question]?.self) { group -> [Question] in
//                for id in groupIds {
//                    group.addTask {
//                        let response = await API.request(URLs.QUESTION_LIST(groupId: id), method: .get)
//                            .serializingDecodable(QuestionServiceEnum.Weekly.Response.self)
//                            .response
//
//                        return response.value?.questions
//                    }
//                }
//
//                var questions = [Question]()
//
//                for try await q in group {
//                    questions.append(contentsOf: q ?? [])
//                }
//
//                return questions
//            }
//
//            let question = results.removeFirst()
//
//            // show card
//            presenter?.showNext(q: question)
//
//            self.questions = results
//            self.current = question
//        }
    }

    override func updateAnswer(id: String?, correct: Bool) {
        guard let qid = id else { return }

        // remove answered question
        removeQuestion(id: qid)

        Task {
            let params = [
                "correct": Correct.convert(value: correct),
                "mode": "test",
            ]

            // update answer
            _ = await API.request(URLs.STUDY_WEEKLY_ANSWER(id: groupId, qid: qid), method: .post, parameters: params).serializingString().response
        }
    }
}

extension WeeklyTestInteractor: WeeklyTestBusinessLogic {}
