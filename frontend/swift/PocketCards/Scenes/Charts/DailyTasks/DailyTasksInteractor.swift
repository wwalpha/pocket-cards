//
//  ChartsInteractor.swift
//  PocketCards
//
//  Created by macmini on 2022/03/23.
//
//

import Foundation

class DailyTasksInteractor {
    var presenter: DailyTasksPresentationLogic?

    init() {
        load()
    }
}

extension DailyTasksInteractor: DailyTasksBusinessLogic {
    func load() {
        API.request(URLs.DAILY_TASKS, method: .get)
            .validate()
            .responseDecodable(of: ReportService.DailyTasks.Response.self) { response in

                guard let res = response.value else { return }

                print("==HUB== \(res)")

                self.presenter?.show(res: res)
            }
    }
}
