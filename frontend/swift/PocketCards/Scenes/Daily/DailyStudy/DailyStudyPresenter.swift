//
//  DailyStudyPresenter.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import Foundation

class DailyStudyPresenter {
    var view: DailyStudyDisplayLogic?
}

extension DailyStudyPresenter: DailyStudyPresentationLogic {
    func showNext(q: Question, count _: Int? = 0) {
        let model = DailyStudyViewModel()
        model.question = q
        model.isFinish = false
        model.isLoading = false
        model.question?.title = q.description == nil ? q.title : "\(q.title)\n\n\(q.description!)"

        view?.showNext(model: model)
    }

    func showError(index: String) {
        let model = DailyStudyViewModel()

        model.isShowError = index
        model.isFinish = false
        model.isLoading = false

        view?.showError(model: model)
    }

    func showNothing() {
        let model = DailyStudyViewModel()
        model.isFinish = true
        model.isLoading = false

        view?.showNext(model: model)
    }
}
