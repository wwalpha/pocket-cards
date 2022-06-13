//
//  DailyReviewContract.swift
//  PocketCards
//
//  Created by macmini on 2022/06/12.
//
//

import Foundation

// View logic
protocol DailyReviewDisplayLogic {
    func showNext(model: DailyStudyViewModel)
}

// Interactor logic
protocol DailyReviewBusinessLogic: StudyBusinessLogic {}

// Presenter logic
protocol DailyReviewPresentationLogic: StudyPresentationLogic {}
