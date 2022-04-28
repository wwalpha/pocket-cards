//
//  DailyTestContract.swift
//  PocketCards
//
//  Created by macmini on 2022/03/10.
//
import Foundation

protocol DailyTestDisplayLogic {
    func showNext(q: Question)

    func showNothing()
}

protocol DailyTestBusinessLogic {
    func loadQuestion()

    func updateAnswer(id: String, correct: Bool)

    func onChoice(choice: String)

    func onAction(correct: Bool)
}

protocol DailyTestPresentationLogic {
    func showNext(q: Question)

    func showNothing()
}
