//
//  ChartsContract.swift
//  PocketCards
//
//  Created by macmini on 2022/03/23.
//
//

import Foundation

// View logic
protocol DailyStatusDisplayLogic {
    func showTasks(model: DailyStatusViewModel)
}

// Interactor logic
protocol DailyStatusBusinessLogic {
    func load()
}

// Presenter logic
protocol DailyStatusPresentationLogic {
    func show(res: ReportServices.DailyStatus.Response)
}
