//
//  OverallTimesPresenter.swift
//  PocketCards
//
//  Created by macmini on 2022/04/11.
//
//

import Foundation

class OverallTimesPresenter {
    var view: OverallTimesDisplayLogic?
}

extension OverallTimesPresenter: OverallTimesPresentationLogic {
    func show(res: ReportServices.OverallTimes.Response) {
        view?.setOveralls(res: res)
    }
}
