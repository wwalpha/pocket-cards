//
//  ChartsPresenter.swift
//  PocketCards
//
//  Created by macmini on 2022/03/23.
//
//

import Foundation

class DailyStatusPresenter {
    var view: DailyStatusDisplayLogic?
}

extension DailyStatusPresenter: DailyStatusPresentationLogic {
    func show(res: ReportServices.DailyStatus.Response) {
        let model = DailyStatusViewModel()

        model.lanTarget = Double(res.language.target)
        model.lanArchive = Double(res.language.archive)
        model.sciTarget = Double(res.science.target)
        model.sciArchive = Double(res.science.archive)
        model.socTarget = Double(res.society.target)
        model.socArchive = Double(res.society.archive)

        view?.showTasks(model: model)
    }
}
