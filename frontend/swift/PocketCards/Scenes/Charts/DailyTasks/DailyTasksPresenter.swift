//
//  ChartsPresenter.swift
//  PocketCards
//
//  Created by macmini on 2022/03/23.
//
//

import Foundation

class DailyTasksPresenter {
    var view: DailyTasksDisplayLogic?
}

extension DailyTasksPresenter: DailyTasksPresentationLogic {
    func show(res: ReportServices.DailyTasks.Response) {
        let model = DailyTasksViewModel()

        model.lanTarget = Double(res.language.target)
        model.lanArchive = Double(res.language.archive)
        model.sciTarget = Double(res.science.target)
        model.sciArchive = Double(res.science.archive)
        model.socTarget = Double(res.society.target)
        model.socArchive = Double(res.society.archive)
        model.mathsTarget = Double(res.maths.target)
        model.mathsArchive = Double(res.maths.archive)

        view?.showTasks(model: model)
    }
}
