//
//  DailyStudyInteractor.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import Alamofire

class DailyStudyInteractor {
    private var manager: QuestionManager = .init()

    var presenter: DailyStudyPresenter?

    init(loadUrl: String, subject: String) {
        manager.subject = subject
        manager.loadUrl = loadUrl
        manager.mode = MODE.STUDY
    }
}

extension DailyStudyInteractor: DailyStudyBusinessLogic {
    func initialize() async {
        await next()
    }

    func onChoice(choice: String) {
        manager.onChoice(choice: choice)

        // 正解の場合
        if manager.checkAnswer(answer: choice) {
            Task {
                await next()
            }
        } else {
            // 不正解の場合、回答を表示する
            presenter?.showError(index: manager.getAnswer()!)
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
