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
        model.status = ScreenStatus.STUDING

        view?.showNext(model: model)
    }

    func showNothing() {
        let model = DailyPracticeViewModel()
        model.status = ScreenStatus.FINISHED

        view?.onUpdate(model: model)
    }

    func showLoading() {
        let model = DailyPracticeViewModel()
        model.status = ScreenStatus.LOADING

        view?.onUpdate(model: model)
    }

    func showError(index: String) {
        let model = DailyPracticeViewModel()
        model.status = ScreenStatus.STUDING
        model.isShowError = index

        view?.onUpdate(model: model)
    }
}
