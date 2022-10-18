//
//  WeeklyTestInteractor.swift
//  PocketCards
//
//  Created by macmini on 2022/04/24.
//
//

import Alamofire

class WeeklyTestInteractor {
    private var manager: QuestionManager = .init()

    var presenter: WeeklyTestPresenter?

    init(loadUrl: String, subject: String) {
        manager.subject = subject
        manager.loadUrl = loadUrl
        manager.mode = MODE.WEEKLY
    }
}

extension WeeklyTestInteractor: WeeklyTestBusinessLogic {
    func destory() {
        manager.clear()
    }

    func initialize() async {
        await next()
    }

    func onChoice(choice: String) {
        manager.onChoice(choice: choice)

        Task {
            await next()
        }
    }

    func onAction(correct: Bool) {
        manager.onAction(correct: correct)

        Task {
            await next()
        }
    }

    func next() async {
        guard let question = await manager.next() else {
            presenter?.showNothing()
            return
        }

        presenter?.showNext(q: question)
    }
}
