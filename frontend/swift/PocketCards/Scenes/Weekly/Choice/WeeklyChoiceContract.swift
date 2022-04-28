//
//  WeeklyChoiceContract.swift
//  PocketCards
//
//  Created by macmini on 2022/04/24.
//
//

import Foundation

// View logic
protocol WeeklyChoiceDisplayLogic {
    func showGroups(model: WeeklyChoiceViewModel)
}

// Interactor logic
protocol WeeklyChoiceBusinessLogic {
    func loadGroups(subject: String)
}

// Presenter logic
protocol WeeklyChoicePresentationLogic {
    func showGroups(res: UserServices.CurriculumList.Response)
}
