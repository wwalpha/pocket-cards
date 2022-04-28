//
//  WeeklyTestInteractor.swift
//  PocketCards
//
//  Created by macmini on 2022/04/24.
//
//

import Alamofire

class WeeklyTestInteractor {
    var presenter: WeeklyTestPresentationLogic?

    private var questions: [Question] = []
    private var current: Question?
}

extension WeeklyTestInteractor: WeeklyTestBusinessLogic {
    func loadQuestion(groupIds: [String]) {
        Task {
            var results = try await withThrowingTaskGroup(of: [Question]?.self) { group -> [Question] in
                for id in groupIds {
                    group.addTask {
                        let response = await API.request(URLs.QUESTION_LIST(groupId: id), method: .get)
                            .serializingDecodable(QuestionServiceEnum.Weekly.Response.self)
                            .response

                        return response.value?.questions
                    }
                }

                var questions = [Question]()

                for try await q in group {
                    questions.append(contentsOf: q ?? [])
                }

                return questions
            }

            let question = results.removeFirst()

            // show card
            presenter?.showNext(q: question)

            self.questions = results
            self.current = question
        }
    }

    private func updateAnswer(id: String) {
        let params = [
            "qid": id,
        ]

        _ = API.request(URLs.WEEKLY_TEST, method: .post, parameters: params).response { response in
            debugPrint(id, response.response!.statusCode)
        }
    }

    func onChoice(choice _: String) {}

    func onAction(correct: Bool) {
        debugPrint("correct", correct)

        // update times if correct
        if !correct {
            // update answer
            updateAnswer(id: current!.id)
        }

        // no questions
        if questions.count == 0 {
            presenter?.showNothing()
            return
        }

        // show next question
        let question = questions.removeFirst()
        presenter?.showNext(q: question)

        // save
        current = question
    }
}
