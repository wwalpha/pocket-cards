//
//  DailyStudyContract.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import Foundation

protocol DailyStudyDisplayLogic {
    func showNext(model: DailyStudyViewModel)

    func showError(model: DailyStudyViewModel)
}

protocol DailyStudyBusinessLogic: StudyBusinessLogic {}

protocol DailyStudyPresentationLogic: StudyPresentationLogic {}
