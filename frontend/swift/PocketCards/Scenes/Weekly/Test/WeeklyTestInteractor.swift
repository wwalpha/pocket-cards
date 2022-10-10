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
        Task {
            await manager.onChoice(choice: choice)

            await next()
        }
    }

    func onAction(correct: Bool) {
        Task {
            await manager.onAction(correct: correct)

            await next()
        }
    }

    func next() async {
        guard let question = await manager.next() else { return }

        presenter?.showNext(q: question)
    }
}
