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
    private var groupId: String = ""
    private var isAnswered: Bool = false
}

extension WeeklyTestInteractor: WeeklyTestBusinessLogic {
    func loadQuestion(selected: [Curriculum]) {
        Task {
            var groupId = ""

            let results = selected.filter { item in
                item.subject == SUBJECT.SCIENCE || item.subject == SUBJECT.SOCIETY
            }

            if results.count == selected.count {
                // create new group
                let groupIds = selected.map { item in
                    item.groupId
                }

                let parameters = ["groupIds": groupIds]
                let response = try! await API.request(URLs.WEEKLY_REGIST, method: .post, parameters: parameters).serializingDecodable(WeeklyServices.Regist.Response.self).value

                groupId = response.groupId
            }

            if results.count == 0 {
                groupId = selected[0].groupId
            }

            let parameters = ["reset": "1"]
            let response = try await API.request(URLs.WEEKLY_LIST(id: groupId), method: .get, parameters: parameters)
                .serializingDecodable(WeeklyServices.List.Response.self).value

            var questions = response.questions
            let question = questions.removeFirst()

            // show card
            presenter?.showNext(q: question, count: questions.count)

            self.questions = questions
            self.current = question
            self.groupId = groupId
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

    func onChoice(choice: String) {
        // update times if correct
        if choice == current?.answer {
            // correct sound
            Audio.playCorrect()

            if !isAnswered {
                // update to known
                updateAnswer(correct: true)
            }

            // next question
            nextQuestion()

            isAnswered = false
        } else {
            // incorrect sound
            Audio.playInCorrect()
            // show error message
            presenter?.showError(index: current!.answer)

            isAnswered = true
        }
    }

    private func nextQuestion() {
        // no questions
        if questions.count == 0 {
            presenter?.showFinish()
            return
        }

        // show next question
        let question = questions.removeFirst()
        presenter?.showNext(q: question, count: questions.count)

        // save
        current = question
    }

    func onAction(correct: Bool) {
        debugPrint("correct", correct)

        // update times if correct
        if correct {
            // update answer
            updateAnswer(correct: correct)
        }

        nextQuestion()
    }

    private func updateAnswer(correct: Bool) {
        guard let qid = current?.id else { return }

        let params = [
            "correct": Correct.convert(value: correct),
        ]

        _ = API.request(URLs.WEEKLY_ABILITY(groupId: groupId, qid: qid), method: .post, parameters: params).response { response in
            debugPrint(qid, response.response!.statusCode)
        }
    }
}
