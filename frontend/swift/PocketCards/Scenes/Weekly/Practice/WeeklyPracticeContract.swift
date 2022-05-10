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
protocol WeeklyPracticeBusinessLogic: StudyBusinessLogic {}

// Presenter logic
protocol WeeklyPracticePresentationLogic: StudyPresentationLogic {}
