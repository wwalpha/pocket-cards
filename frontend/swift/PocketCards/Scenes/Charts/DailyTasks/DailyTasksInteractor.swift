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
}

extension DailyTasksInteractor: DailyTasksBusinessLogic {
    func load() {
        API.request(URLs.REPORTS_DAILY_TASKS, method: .get)
            .validate()
            .responseDecodable(of: ReportServices.DailyTasks.Response.self) { response in

                guard let res = response.value else { return }

                print("==HUB== \(res)")

                self.presenter?.show(res: res)
            }
    }
}
