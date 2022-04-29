//
//  WeeklyTestContract.swift
//  PocketCards
//
//  Created by macmini on 2022/04/24.
//
//

import Foundation

// View logic
protocol WeeklyTestDisplayLogic {
    func showNext(model: WeeklyTestViewModel)

    func showError(index: String)
}

// Interactor logic
protocol WeeklyTestBusinessLogic {
    func loadQuestion(selected: [Curriculum])

    func onChoice(choice: String)

    func onAction(correct: Bool)
}

// Presenter logic
protocol WeeklyTestPresentationLogic {
    func showNext(q: Question)

    func showFinish()

    func showLoading()

    func showError(index: String)
}
