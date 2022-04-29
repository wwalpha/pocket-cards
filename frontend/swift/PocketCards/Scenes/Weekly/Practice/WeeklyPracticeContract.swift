//
//  WeeklyPracticeContract.swift
//  PocketCards
//
//  Created by macmini on 2022/04/25.
//
//

import Foundation

// View logic
protocol WeeklyPracticeDisplayLogic {
    func showNext(model: WeeklyPracticeViewModel)

    func showError(index: String)
}

// Interactor logic
protocol WeeklyPracticeBusinessLogic {
    func loadQuestions()

    func onChoice(choice: String)

    func onAction(correct: Bool)
}

// Presenter logic
protocol WeeklyPracticePresentationLogic {
    func showNext(q: Question)

    func showFinish()

    func showLoading()

    func showError(index: String)
}
