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
    private var isAnswered: Bool = false
    private var groupId: String = ""

    init(groupId: String) {
        self.groupId = groupId
    }
}

extension WeeklyPracticeInteractor: WeeklyPracticeBusinessLogic {
    func onChoice(choice: String) {
        if choice == current?.answer {
            // correct sound
            Audio.playCorrect()

            if !isAnswered {
                // update to known
                updateAnswer(id: current!.id)
            }

            // next question
            nextQuestion()

            isAnswered = false
        } else {
            // incorrect sound
            Audio.playInCorrect()

            isAnswered = true

            presenter?.showError(index: current!.answer)
        }
    }

    func onAction(correct: Bool) {
        // 成功の場合、更新する
        if correct {
            updateAnswer(id: current!.id)
        }

        // show next question
        nextQuestion()
    }

    private func nextQuestion() {
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
        guard let groupId = current?.groupId,
              let qid = current?.id else { return }

        let params = [
            "correct": "1",
        ]

        // update answer times
        _ = API.request(URLs.WEEKLY_PRACTICE(groupId: groupId, qid: qid), method: .put, parameters: params).response { response in
            debugPrint(id, response.response!.statusCode)
        }
    }

    func loadQuestions() {
        API.request(URLs.WEEKLY_LIST(id: groupId), method: .get)
            .validate()
            .responseDecodable(of: QuestionServices.Weekly.Response.self) { response in
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
