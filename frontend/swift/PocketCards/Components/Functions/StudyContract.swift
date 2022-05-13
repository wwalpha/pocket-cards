//
//  PresentationLogic.swift
//  PocketCards
//
//  Created by macmini on 2022/05/09.
//

import Foundation

protocol StudyPresentationLogic {
    func showNext(q: Question, count: Int?)

    func showNothing()

    func showError(index: String)
}

protocol StudyBusinessLogic {
    func loadQuestions() async

    func addQuestions(questions: [Question])

    func removeQuestion(id: String)

    func updateAnswer(id: String?, correct: Bool)

    func onChoice(choice: String)

    func onAction(correct: Bool)

    func next()
}
