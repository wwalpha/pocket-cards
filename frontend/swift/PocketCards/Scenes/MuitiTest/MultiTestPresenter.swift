//
//  MultiTestPresenter.swift
//  PocketCards
//
//  Created by macmini on 2022/09/17.
//
//

import Foundation

class MultiTestPresenter {
    var view: MultiTestDisplayLogic?
}

extension MultiTestPresenter: MultiTestPresentationLogic {
    func showNext(question: Question) {
        let model = MultiTestViewModel()
        model.question = question
        model.isShowQuestion = true
        model.isShowAnswer = true

        view?.showNext(model: model)
    }

    func showAnswer() {
        let model = MultiTestViewModel()
        model.isShowQuestion = false
        model.isShowAnswer = true

        view?.showAnswer(model: model)
    }

    func onConnecting() {
        let model = MultiTestViewModel()
        model.isConnecting = true
        model.isConnected = false

        view?.onConnecting(model: model)
    }

    func onConnected() {
        let model = MultiTestViewModel()
        model.isConnecting = false
        model.isConnected = true

        view?.onConnected(model: model)
    }

    func onDisconnected() {
        let model = MultiTestViewModel()
        model.isConnecting = false
        model.isConnected = false

        view?.onDisconnected(model: model)
    }
}
