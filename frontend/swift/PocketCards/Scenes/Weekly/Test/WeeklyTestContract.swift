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

    func showCount(model: WeeklyTestViewModel)
}

// Interactor logic
protocol WeeklyTestBusinessLogic: StudyBusinessLogic {}

// Presenter logic
protocol WeeklyTestPresentationLogic: StudyPresentationLogic {}
