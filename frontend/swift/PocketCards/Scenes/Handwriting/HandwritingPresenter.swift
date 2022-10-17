//
//  HandwritingPresenter.swift
//  PocketCards
//
//  Created by macmini on 2022/10/06.
//
//

import Foundation

class HandwritingPresenter {
    var view: HandwritingDisplayLogic?
}

extension HandwritingPresenter: HandwritingPresentationLogic {
    func hideLoading() {
        let model = HandwritingViewModel()
        model.isLoading = false

        view?.showLoading(model: model)
    }

    func showLoading() {
        let model = HandwritingViewModel()
        model.isLoading = true

        view?.showLoading(model: model)
    }

    func showNext(q: Question) {
        let model = HandwritingViewModel()
        model.isInitialized = true
        model.isCorrect = true
        model.question = q

        view?.showNext(model: model)
    }

    func showNothing() {}

    func showError(result: String) {
        view?.showError(result: result)
    }
}
