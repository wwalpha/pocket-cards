//
//  TestInteractor.swift
//  PocketCards
//
//  Created by macmini on 2022/05/10.
//

import Foundation

class TestInteractor: StudyBusinessLogic {
    var presenter: StudyPresentationLogic?
    var subject: String
    var current: Question?
    var index: Int = -1
    var maxCount = 10
    var questions: [Question] = []
    var answered: [String?] = []

    init(subject: String) {
        self.subject = subject
    }

    // for override
    func updateAnswer(id _: String?, correct _: Bool) {}

    // for override
    func loadQuestions() {}

    func addQuestions(questions: [Question]) {
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

        // initialize
        if current == nil {
            if self.questions.count > 0 {
                next()
            } else {
                presenter?.showNothing()
            }
        }
    }

    func removeQuestion(id: String) {
        // remove updated question
        questions.removeAll(where: { $0.id == id })
        // record answered questions
        answered.append(id)

        // add questions
        if questions.count < 5 {
            loadQuestions()
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

        // update flag
        updateAnswer(id: current?.id, correct: correct)
        // next question
        next()
    }

    func onChoice(choice: String) {
        if choice == current?.answer {
            Audio.playCorrect()
        } else {
            Audio.playInCorrect()
        }

        // update question state
        updateAnswer(id: current?.id, correct: choice == current?.answer)
        // show next question
        next()
    }

    func next() {
        if questions.count == 0 {
            presenter?.showNothing()
            return
        }

        index = (index + 1) % questions.count

        debugPrint(index, questions.count, questions)
        if questions.count > index {
            // get next question
            current = questions[index]
            // show next question
            presenter?.showNext(q: current!, count: questions.count)
        } else if questions.count != 0 {
            // some errors reset index
            index = 0
            // show next question
            current = questions[index]
        } else {
            presenter?.showNothing()
        }
    }
}
