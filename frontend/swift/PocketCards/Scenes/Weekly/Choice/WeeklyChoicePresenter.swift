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
    func showGroups(res: UserServices.CurriculumList.Response) {
        let model = WeeklyChoiceViewModel()

        model.dataRows = res.items

        view?.showGroups(model: model)
    }
}
