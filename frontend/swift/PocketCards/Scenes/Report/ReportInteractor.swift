//
//  ReportInteractor.swift
//  PocketCards
//
//  Created by macmini on 2022/03/18.
//

import Foundation

class ReportInteractor {
    var presenter: ReportPresentationLogic?
}

extension ReportInteractor: ReportBusinessLogic {
    func query() {
        API.request(URLs.REPORT_DAILY, method: .get)
            .response { response in
                debugPrint(response)
            }
    }
}
