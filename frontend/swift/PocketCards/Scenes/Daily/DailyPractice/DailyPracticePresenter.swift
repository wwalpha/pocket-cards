//
//  DailyPracticePresenter.swift
//  PocketCards
//
//  Created by macmini on 2022/11/16.
//
//

import Foundation

class DailyPracticePresenter {
    var view: DailyPracticeDisplayLogic?
}

extension DailyPracticePresenter: DailyPracticePresentationLogic {
    func showNext(q: Question) {
        let model = DailyPracticeViewModel()
        model.question = q
        model.isLoading = false
        model.isFinish = false

        view?.onUpdate(model: model)
        view?.showNext(model: model)
    }

    func showNothing() {
        let model = DailyPracticeViewModel()
        model.isLoading = false
        model.isFinish = true

        view?.onUpdate(model: model)
    }

    func showLoading() {
        let model = DailyPracticeViewModel()
        model.isLoading = true
        model.isFinish = false

        view?.onUpdate(model: model)
    }

    func showError(index: String) {
        let model = DailyPracticeViewModel()
        model.isLoading = true
        model.isFinish = false
        model.isShowError = index

        view?.onUpdate(model: model)
    }
}
