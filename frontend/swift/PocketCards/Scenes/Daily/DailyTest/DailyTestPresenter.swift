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
    func showNext(q: Question, count _: Int? = 0) {
        let model = DailyTestViewModel()
        model.question = q
        model.isFinish = false
        model.isLoading = false
        model.question?.title = q.description == nil ? q.title : "\(q.title)\n\n\(q.description!)"

        view?.showNext(model: model)
    }

    func showNothing() {
        let model = DailyTestViewModel()
        model.isFinish = true
        model.isLoading = false

        view?.showNext(model: model)
    }

    func showError(index _: String) {}
}
