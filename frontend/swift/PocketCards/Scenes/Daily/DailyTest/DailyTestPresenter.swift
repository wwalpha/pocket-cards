//
//  DailyTestPresenter.swift
//  PocketCards
//
//  Created by macmini on 2022/03/10.
//

import Foundation

class DailyTestPresenter {
    var view: DailyTestDisplayLogic?
}

extension DailyTestPresenter: DailyTestPresentationLogic {
    func showLoading() {}

    func showNext(q: Question) {
        let model = DailyTestViewModel()
        model.question = q
        model.isLoading = false
        model.isFinish = false

        view?.onUpdate(model: model)
        view?.showNext(model: model)
    }

    func showNothing() {
        let model = DailyTestViewModel()
        model.isFinish = true
        model.isLoading = false

        view?.onUpdate(model: model)
        view?.showNext(model: model)
    }

    func showError(index _: String) {}
}
