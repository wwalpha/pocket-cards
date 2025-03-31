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

    init(loadUrl: String, subject: String, mode: String) {
        manager.subject = subject
        manager.loadUrl = loadUrl
        manager.mode = mode
    }
}

extension DailyPracticeInteractor: DailyPracticeBusinessLogic {
    func initialize() async {
        await next()
    }

    func onChoice(choice: String) {
        manager.onChoice(choice: choice)

        Task {
//            if manager.mode == MODE.PRACTICE {
//                // 正解の場合
//                if manager.checkAnswer(answer: choice) {
//                    await next()
//                } else {
//                    // 不正解の場合、回答を表示する
//                    presenter?.showError(index: manager.getAnswer()!)
//                }
//            } else {
//                await next()
//            }
            if manager.checkAnswer(answer: choice) {
                // 正解の場合、次の問題
                await next()
            } else {
                // 不正解の場合、回答を表示する
                presenter?.showError(index: manager.getAnswer()!)
            }
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
