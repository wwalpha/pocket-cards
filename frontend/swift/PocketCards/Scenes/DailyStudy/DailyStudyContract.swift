//
//  DailyStudyContract.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import Foundation

protocol DailyStudyDisplayLogic {
    func showNext(title: String, answer: String, choices: [String]?)

    func showError(index: String)

    func showNothing()
}

protocol DailyStudyBusinessLogic {
    func loadQuestion()

    func updateAnswer(id: String, correct: Bool)

    func onChoice(choice: String)

    func onAction(correct: Bool)

    func onPlay(front: Bool)
}

protocol DailyStudyPresentationLogic {
    func showNext(q: Question)

    func showError(index: String)

    func showNothing()
}
