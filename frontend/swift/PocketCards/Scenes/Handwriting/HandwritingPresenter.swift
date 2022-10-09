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
    func showNext(q: Question) {
        let model = HandwritingViewModel()
        model.isInitialized = true
        model.question = q

        view?.showNext(model: model)
    }

    func showNothing() {}

    func showError() {}
}
