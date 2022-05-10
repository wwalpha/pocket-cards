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
    func validateResult(result: Bool) {
        view?.validation(result: result)
    }

    func showGroups(res: [Curriculum]) {
        let model = WeeklyChoiceViewModel()

        model.dataRows = res
        model.isLoading = false

        view?.showGroups(model: model)
    }
}
