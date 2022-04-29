//
//  WeeklyChoicePresenter.swift
//  PocketCards
//
//  Created by macmini on 2022/04/24.
//
//

import Foundation

class WeeklyChoicePresenter {
    var view: WeeklyChoiceDisplayLogic?
}

extension WeeklyChoicePresenter: WeeklyChoicePresentationLogic {
    func showGroups(res: [UserServices.CurriculumList.Response]) {
        let model = WeeklyChoiceViewModel()
        var dataRows: [Curriculum] = []

        res.forEach { response in
            dataRows.append(contentsOf: response.items)
        }

        model.dataRows = dataRows
        model.isLoading = false

        view?.showGroups(model: model)
    }
}
