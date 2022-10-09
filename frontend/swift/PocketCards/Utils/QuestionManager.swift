//
//  QuestionManager.swift
//  PocketCards
//
//  Created by macmini on 2022/10/06.
//

import Foundation

class QuestionManager {
    var loadUrl: String = ""
    var subject: String = ""
    var mode = MODE.STUDY

    private var current: Question?
    private var index: Int = -1
    private var questions: [Question] = []
    private var answered: [String?] = []
    private var isSuspended: Bool = false

    // get all questions
    func loadQuestions() async throws {
        let params = ["subject": subject]

        do {
            let res = try await API.request(loadUrl, method: .get, parameters: params).serializingDecodable(QuestionServices.LoadQuestion.Response.self).value

            print("==HUB== \(res)")

            addQuestions(questions: res.questions)

        } catch {
            debugPrint(error)

            isSuspended = true
        }
    }

    func onAction(correct: Bool) {
        // correct answer
        if correct {
            // play sound
            Audio.playCorrect()
        } else {
            // play sound
            Audio.playInCorrect()
        }

        Task {
            // update flag
            try await self.onUpdate(qid: current?.id, correct: correct)
        }
    }

    func onChoice(choice: String) {
        if choice == current?.answer {
            Audio.playCorrect()
        } else {
            Audio.playInCorrect()
        }

        Task {
            // update question state
            try await self.onUpdate(qid: current?.id, correct: choice == current?.answer)
        }
    }

    func next() async -> Question? {
        if isSuspended {
            return nil
        }

        do {
            if questions.count == 0 {
                try await loadQuestions()
            }

            if isSuspended {
                return nil
            }

        } catch {
            return nil
        }

        index = (index + 1) % questions.count

        if questions.count > index {
            // get next question
            current = questions[index]
        } else if questions.count != 0 {
            // some errors reset index
            index = 0
            // show next question
            current = questions[index]
        }

        // show next question
        return current
    }

    func clear() {
        current = nil
        index = -1
        questions = []
        answered = []
    }

    private func addQuestions(questions: [Question]) {
        for q in questions {
            // current question
            if current?.id == q.id {
                continue
            }

            // unanswer question
            if self.questions.contains(where: { $0.id == q.id }) {
                continue
            }

            // answered question
            if answered.contains(q.id) {
                continue
            }

            // add new question
            self.questions.append(q)
        }

        // check question count
        if self.questions.count == 0 {
            isSuspended = true
        }
    }

    // update question answer
    private func onUpdate(qid: String?, correct: Bool) async throws {
        guard let id = qid else { return }

        let params = ["correct": Correct.convert(value: correct)]

        if mode == MODE.STUDY {
            // update answer
            _ = await API.request(URLs.STUDY_DAILY_ANSWER(id: id), method: .post, parameters: params).serializingString().response
        }

        if mode == MODE.WEEKLY {
            // update answer
            _ = await API.request(URLs.STUDY_WEEKLY_ANSWER(qid: id), method: .post, parameters: params).serializingString().response
        }

        if questions.count <= 8 {
            try await loadQuestions()
        }
    }

    // delete answered question
    private func removeQuestion(id: String) {
        // remove updated question
        questions.removeAll(where: { $0.id == id })
        // record answered questions
        answered.append(id)
    }
}
