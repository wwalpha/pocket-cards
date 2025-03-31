//
//  DailyStatusPresenter.swift
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
        model.lanTest = Double(res.language.test)
        model.lanUnlearned = Double(res.language.unlearned)
        model.lanRelearning = Double(res.language.relearning)
        model.sciTarget = Double(res.science.target)
        model.sciTest = Double(res.science.test)
        model.sciUnlearned = Double(res.science.unlearned)
        model.sciRelearning = Double(res.science.relearning)
        model.socTarget = Double(res.society.target)
        model.socTest = Double(res.society.test)
        model.socUnlearned = Double(res.society.unlearned)
        model.socRelearning = Double(res.society.relearning)

        view?.showTasks(model: model)
    }
}
