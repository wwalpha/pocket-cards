//
//  WeeklyPracticeInteractor.swift
//  PocketCards
//
//  Created by macmini on 2022/04/25.
//
//

import Foundation

class WeeklyPracticeInteractor {
    var presenter: WeeklyPracticePresentationLogic?

    private var questions: [Question] = []
    private var current: Question?
    private var subject: String

    init(subject: String) {
        self.subject = subject
    }
}

extension WeeklyPracticeInteractor: WeeklyPracticeBusinessLogic {
    func onAction(correct: Bool) {
        // 成功の場合、更新する
        if correct {
            updateAnswer(id: current!.id)
        }

        // no questions
        if questions.count == 0 {
            // show loading status
            presenter?.showLoading()

            // reload questions
            loadQuestions()

            return
        }

        let question = questions.removeFirst()

        // show next question
        presenter?.showNext(q: question)

        current = question
    }

    private func updateAnswer(id: String) {
        let params = [
            "correct": "1",
            "subject": subject,
        ]

        // update answer times
        _ = API.request(URLs.WEEKLY_ANSWER(id: id), method: .put, parameters: params).response { response in
            debugPrint(id, response.response!.statusCode)
        }
    }

    func loadQuestions() {
        let params = ["subject": subject]

        API.request(URLs.WEEKLY_TEST, method: .get, parameters: params)
            .validate()
            .responseDecodable(of: QuestionServiceEnum.Weekly.Response.self) { response in
                guard let res = response.value else { return }

                if res.questions.count == 0 {
                    self.presenter?.showFinish()
                    return
                }

                // save all
                self.questions = res.questions
                let question = self.questions.removeFirst()

                // show question
                self.presenter?.showNext(q: question)
                self.current = question
            }
    }
}
