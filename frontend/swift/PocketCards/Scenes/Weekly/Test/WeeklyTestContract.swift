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
    func initialize() async

    func onChoice(choice: String)

    func onAction(correct: Bool)

    func next() async

    func destory()
}

// Presenter logic
protocol WeeklyTestPresentationLogic {}
