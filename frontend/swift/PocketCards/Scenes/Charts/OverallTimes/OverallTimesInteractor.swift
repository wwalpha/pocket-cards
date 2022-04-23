//
//  OverallTimesInteractor.swift
//  PocketCards
//
//  Created by macmini on 2022/04/11.
//
//

import Foundation

class OverallTimesInteractor {
    var presenter: OverallTimesPresentationLogic?
}

extension OverallTimesInteractor: OverallTimesBusinessLogic {
    func load() {
        API.request(URLs.REPORTS_OVERALL, method: .get)
            .validate()
            .responseDecodable(of: ReportService.OverallTimes.Response.self) { response in

                guard let res = response.value else { return }

                self.presenter?.show(res: res)
            }
    }
}
