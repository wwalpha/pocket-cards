//
//  DailyPracticeInteractor.swift
//  PocketCards
//
//  Created by macmini on 2022/11/16.
//
//

import Foundation

class DailyPracticeInteractor {
    private var manager: QuestionManager = .init()

    var presenter: DailyPracticePresenter?

    init(loadUrl: String, subject: String) {
        manager.subject = subject
        manager.loadUrl = loadUrl
        manager.mode = MODE.PRACTICE
    }
}

extension DailyPracticeInteractor: DailyPracticeBusinessLogic {
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

    func destory() {
        manager.clear()
    }
}
