//
//  MultiTestContract.swift
//  PocketCards
//
//  Created by macmini on 2022/09/17.
//
//

import Foundation

// View logic
protocol MultiTestDisplayLogic {
    func onConnecting(model: MultiTestViewModel)

    func onConnected(model: MultiTestViewModel)

    func onDisconnected(model: MultiTestViewModel)

    func showNext(model: MultiTestViewModel)

    func showAnswer(model: MultiTestViewModel)
}

// Interactor logic
protocol MultiTestBusinessLogic {
    func connect()

    func disconnect()

    func onAction(correct: Bool)

    func onChoice(choice: String)

    func updateAnswer(correct: Bool)
}

// Presenter logic
protocol MultiTestPresentationLogic {
    func onConnecting()

    func onConnected()

    func onDisconnected()

    func showNext(question: Question)

    func showAnswer()
}
