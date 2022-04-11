//
//  DailyTestInteractor.swift
//  PocketCards
//
//  Created by macmini on 2022/03/10.
//

import Alamofire

class DailyTestInteractor {
    var presenter: DailyTestPresentationLogic?

    private var subject: String
    private var current: Question?
    private var index: Int = -1
    private var maxCount = 10

    var questions: [Question] = []

    init(subject: String) {
        self.subject = subject
    }
}

extension DailyTestInteractor: DailyTestBusinessLogic {
    // update answer
    func updateAnswer(id: String, correct: Bool) {
        guard let id = current?.id else { return }

        let params = [
            "correct": Correct.convert(value: correct),
        ]

        print("updateAnswer", id, correct)

        API.request(URLs.ANSWER(id: id), method: .post, parameters: params)
            .response { response in
                switch response.result {
                case .success:
                    print("Successful")
                    debugPrint("before", self.questions.count)

                    // remove updated question
                    self.questions.removeAll(where: { $0.id == id })
                    // reindex
                    guard let newIndex = self.questions.firstIndex(where: { $0.id == self.current?.id }) else { return }
                    self.index = newIndex

                    debugPrint("after", self.questions.count)
                    debugPrint(self.questions)

                    // add questions
                    if self.questions.count < 5 {
                        self.loadQuestion()
                    }
                case let .failure(error):
                    print(error)
                }
            }
    }

    func loadQuestion() {
        let params = ["subject": subject]

//        print("Token", TokenManager.shared.getIdToken())
//        let headers:HTTPHeaders = [.authorization(TokenManager.shared.getIdToken())]
//        AF.request(URLs.STUDY,method: .get, parameters: params,  headers: headers)
//            .responseData { response in
//
//                switch (response).result {
//                case .success(let Value):
//                    print("success \(String(data:Value,encoding: .utf8))")
//                case .failure(let Error):
//                    print("222222")
//
//                    print(Error)
//                }
//            }

        API.request(URLs.TEST, method: .get, parameters: params)
            .validate(statusCode: 200 ..< 300)
            .responseDecodable(of: QuestionServiceEnum.LoadQuestion.Response.self) { response in
                guard let res = response.value else { return }

                print("==HUB== \(res)")

                for q in res.questions {
                    if self.current?.id == q.id {
                        continue
                    }

                    if !self.questions.contains(where: { $0.id == q.id }) {
                        self.questions.append(q)
                    }
                }

                // initialize
                if self.current == nil {
                    if self.questions.count > 0 {
                        self.next()
                    } else {
                        self.presenter?.showNothing()
                    }
                }
            }
    }

    func onPlay(front: Bool) {
        guard let thisURL = front ? current?.voiceTitle : current?.voiceAnswer else { return }

        Audio.play(url: DOMAIN_HOST + thisURL)
    }

    func onAction(correct: Bool) {
        // update question state
        updateAnswer(id: current!.id, correct: correct)
        // show next question
        next()
    }

    func onChoice(choice: String) {
        // update question state
        updateAnswer(id: current!.id, correct: choice == current?.answer)
        // show next question
        next()
    }

    private func next() {
        if questions.count == 0 {
            presenter?.showNothing()
            return
        }

        index = (index + 1) % questions.count

        if questions.count > index {
            current = questions[index]
            presenter?.showNext(q: current!)
        } else if questions.count != 0 {
            index = 0
            current = questions[index]
        } else {
            presenter?.showNothing()
        }
    }
}
