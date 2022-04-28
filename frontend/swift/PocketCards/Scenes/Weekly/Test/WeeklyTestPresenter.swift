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

        view?.showNext(model: model)
    }

    func showNothing() {
        view?.showNothing()
    }
}
