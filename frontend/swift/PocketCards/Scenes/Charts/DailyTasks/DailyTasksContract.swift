//
//  ChartsContract.swift
//  PocketCards
//
//  Created by macmini on 2022/03/23.
//
//

import Foundation

// View logic
protocol DailyTasksDisplayLogic {
    func showTasks(model: DailyTasksViewModel)
}

// Interactor logic
protocol DailyTasksBusinessLogic {
    func load()
}

// Presenter logic
protocol DailyTasksPresentationLogic {
    func show(res: ReportServices.DailyTasks.Response)
}
