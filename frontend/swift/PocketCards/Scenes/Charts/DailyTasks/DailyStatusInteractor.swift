//
//  ChartsInteractor.swift
//  PocketCards
//
//  Created by macmini on 2022/03/23.
//
//

import Foundation

class DailyStatusInteractor {
    var presenter: DailyStatusPresentationLogic?
}

extension DailyStatusInteractor: DailyStatusBusinessLogic {
    func load() {
        API.request(URLs.REPORTS_DAILY_STATUS, method: .get)
            .validate()
            .responseDecodable(of: ReportServices.DailyStatus.Response.self) { response in

                guard let res = response.value else { return }

                print("==HUB== \(res)")

                self.presenter?.show(res: res)
            }
    }
}
