//
//  DailyReviewPresenter.swift
//  PocketCards
//
//  Created by macmini on 2022/06/12.
//
//

import Foundation

class DailyReviewPresenter {
    var view: DailyReviewDisplayLogic?
}

extension DailyReviewPresenter: DailyReviewPresentationLogic {
    func showError(index _: String) {}

    func showNext(q: Question, count _: Int? = 0) {
        let model = DailyStudyViewModel()
        model.question = q
        model.isFinish = false
        model.isLoading = false
        model.question?.title = q.description == nil ? q.title : "\(q.title)\n\n\(q.description!)"

        debugPrint(q.id)

        view?.showNext(model: model)
    }

    func showNothing() {
        let model = DailyStudyViewModel()
        model.isFinish = true
        model.isLoading = false

        view?.showNext(model: model)
    }
}
