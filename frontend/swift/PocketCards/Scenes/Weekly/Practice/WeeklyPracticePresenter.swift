//
//  WeeklyPracticePresenter.swift
//  PocketCards
//
//  Created by macmini on 2022/04/25.
//
//

import Foundation

class WeeklyPracticePresenter {
    var view: WeeklyPracticeDisplayLogic?
}

extension WeeklyPracticePresenter: WeeklyPracticePresentationLogic {
    func showNext(q: Question, count: Int? = 0) {
        debugPrint(1111, count)
        let model = WeeklyPracticeViewModel()
        model.question = q
        model.isLoading = false
        model.isFinish = false

        view?.showNext(model: model)
    }

    func showNothing() {
        let model = WeeklyPracticeViewModel()
        model.isLoading = false
        model.isFinish = true

        view?.showNext(model: model)
    }

    func showError(index: String) {
        view?.showError(index: index)
    }

    func showLoading() {
        let model = WeeklyPracticeViewModel()
        model.isLoading = true
        model.isFinish = false

        view?.showNext(model: model)
    }
}
