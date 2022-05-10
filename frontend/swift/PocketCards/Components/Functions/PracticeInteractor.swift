//
//  PracticeInteractor.swift
//  PocketCards
//
//  Created by macmini on 2022/05/09.
//

import Foundation

class PracticeInteractor: StudyBusinessLogic {
    var presenter: StudyPresentationLogic?
    var subject: String
    var current: Question?
    var index: Int = -1
    var maxCount = 10
    var questions: [Question] = []

    init(subject: String) {
        self.subject = subject
    }

    // update answer
    func updateAnswer(id _: String?, correct _: Bool) {}

    func loadQuestions() {}

    func addQuestions(questions: [Question]) {
        for q in questions {
            if current?.id == q.id {
                continue
            }

            if self.questions.contains(where: { $0.id == q.id }) {
                continue
            }

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
            // update flag
            updateAnswer(id: current?.id, correct: true)
        } else {
            // play sound
            Audio.playInCorrect()
        }

        // next question
        next()
    }

    func onChoice(choice: String) {
        if choice == current?.answer {
            // play sound
            Audio.playCorrect()

            if let isAnswered = current?.isAnswered {
                // first time
                if !isAnswered {
                    // update to known
                    updateAnswer(id: current?.id, correct: true)
                }
            }

            // show next question
            next()
            // set flag
            current?.isAnswered = false
        } else {
            // play sound
            Audio.playInCorrect()
            // show error
            presenter?.showError(index: current!.answer)
            // set flag
            current?.isAnswered = true
        }
    }

    func next() {
        // if no questions
        if questions.count == 0 {
            presenter?.showNothing()
            return
        }

        index = (index + 1) % questions.count

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
            // show nothing
            presenter?.showNothing()
        }
    }
}
