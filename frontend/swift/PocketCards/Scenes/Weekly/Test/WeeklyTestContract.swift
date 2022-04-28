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

    func showNothing()
}

// Interactor logic
protocol WeeklyTestBusinessLogic {
    func loadQuestion(groupIds: [String])

    func onChoice(choice: String)

    func onAction(correct: Bool)
}

// Presenter logic
protocol WeeklyTestPresentationLogic {
    func showNext(q: Question)

    func showNothing()
}
