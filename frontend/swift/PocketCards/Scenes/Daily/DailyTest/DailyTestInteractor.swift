//
//  DailyTestInteractor.swift
//  PocketCards
//
//  Created by macmini on 2022/03/10.
//

import Alamofire

class DailyTestInteractor {
    private var manager: QuestionManager = .init()

    var presenter: DailyTestPresenter?

    init(loadUrl: String, subject: String) {
        manager.subject = subject
        manager.loadUrl = loadUrl
        manager.mode = MODE.EXAM
    }
//
//    // update answer
//    override func updateAnswer(id: String?, correct: Bool) {
//        guard let qid = id else { return }
//
//        // remove answered question
//        removeQuestion(id: qid)
//
//        Task {
//            let params = ["correct": Correct.convert(value: correct), "qid": id]
//
//            debugPrint("updateAnswer", params)
//
//            // update answer
//            _ = await API.request(URLs.STUDY_DAILY_ANSWER, method: .post, parameters: params).serializingString().response
//
//            // add questions
//            if questions.count < 5 {
//                loadQuestions()
//            }
//        }
//    }
//
//    override func loadQuestions() {
//        let params = ["subject": subject]
//
//        API.request(loadUrl, method: .get, parameters: params)
//            .validate()
//            .responseDecodable(of: QuestionServices.LoadQuestion.Response.self) { response in
//                guard let res = response.value else { return }
//
//                print("==HUB== \(res)")
//
//                // add new questions
//                self.addQuestions(questions: res.questions)
//            }
//    }
}

extension DailyTestInteractor: DailyTestBusinessLogic {
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
