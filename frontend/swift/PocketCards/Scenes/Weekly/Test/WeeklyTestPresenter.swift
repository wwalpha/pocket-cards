//
//  WeeklyTestPresenter.swift
//  PocketCards
//
//  Created by macmini on 2022/04/24.
//
//

import Foundation

class WeeklyTestPresenter {
    var view: WeeklyTestDisplayLogic?
}

extension WeeklyTestPresenter: WeeklyTestPresentationLogic {
    func showNext(q: Question) {
        let model = WeeklyTestViewModel()
        model.question = q
        model.isLoading = false
        model.isFinish = false

        view?.onUpdate(model: model)
        view?.showNext(model: model)
    }

    func showNothing() {
        let model = WeeklyTestViewModel()
        model.isLoading = false
        model.isFinish = true

        view?.onUpdate(model: model)
    }

    func showLoading() {
        let model = WeeklyTestViewModel()
        model.isLoading = true
        model.isFinish = false

        view?.onUpdate(model: model)
    }

    func showError(index: String) {
        let model = WeeklyTestViewModel()
        model.isLoading = true
        model.isFinish = false
        model.isShowError = index

        view?.onUpdate(model: model)
    }
}
