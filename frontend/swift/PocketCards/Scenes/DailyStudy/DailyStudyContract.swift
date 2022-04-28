//
//  DailyStudyContract.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import Foundation

protocol DailyStudyDisplayLogic {
    func showNext(model: DailyStudyViewModel)

    func showError(index: String)
}

protocol DailyStudyBusinessLogic {
    func loadQuestion()

    func updateAnswer(id: String, correct: Bool)

    func onChoice(choice: String)

    func onAction(correct: Bool)
}

protocol DailyStudyPresentationLogic {
    func showNext(q: Question)

    func showError(index: String)

    func showNothing()
}
