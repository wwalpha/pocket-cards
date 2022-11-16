//
//  DailyPracticeContract.swift
//  PocketCards
//
//  Created by macmini on 2022/11/16.
//
//

import Foundation

// View logic
protocol DailyPracticeDisplayLogic {
    func showNext(model: DailyPracticeViewModel)

    func onUpdate(model: DailyPracticeViewModel)
}

// Interactor logic
protocol DailyPracticeBusinessLogic {
    func initialize() async

    func onChoice(choice: String)

    func onAction(correct: Bool)

    func next() async

    func destory()
}

// Presenter logic
protocol DailyPracticePresentationLogic {
    func showNext(q: Question)

    func showNothing()

    func showLoading()

    func showError(index: String)
}
