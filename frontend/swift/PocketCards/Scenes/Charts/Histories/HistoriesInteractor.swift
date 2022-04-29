//
//  HistoriesInteractor.swift
//  PocketCards
//
//  Created by macmini on 2022/03/24.
//
//

import Foundation

class HistoriesInteractor {
    var presenter: HistoriesPresentationLogic?
}

extension HistoriesInteractor: HistoriesBusinessLogic {
    // load data
    func load() {
        API.request(URLs.REPORTS_PROGRESS, method: .get)
            .validate()
            .responseDecodable(of: ReportServices.LearningProgress.Response.self) { response in

                guard let res = response.value else { return }

                print("==HUB== \(res)")

                self.presenter?.show(histories: res.histories)
            }
    }
}
