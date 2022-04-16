//
//  DailyStudyInteractor.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import Alamofire

class DailyStudyInteractor {
    var presenter: DailyStudyPresentationLogic?

    private var subject: String
    private var current: Question?
    private var isAnswered: Bool = false
    private var index: Int = -1
    private var maxCount = 10

    var questions: [Question] = []

    init(subject: String) {
        self.subject = subject
    }
}

extension DailyStudyInteractor: DailyStudyBusinessLogic {
    // update answer
    func updateAnswer(id _: String, correct: Bool) {
        guard let id = current?.id else { return }

        let params = [
            "correct": Correct.convert(value: correct),
        ]

        print("updateAnswer", id, correct)

        // remove updated question
        questions.removeAll(where: { $0.id == current?.id })

        API.request(URLs.ANSWER(id: id), method: .post, parameters: params)
            .response { response in
                print("response", response)
                switch response.result {
                case .success:
                    print("Successful")

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

        API.request(URLs.STUDY, method: .get, parameters: params)
            .validate()
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
        // wrong answer
        if correct {
            Audio.playCorrect()
            updateAnswer(id: current!.id, correct: true)
        }

        next()
    }

    func onChoice(choice: String) {
        if choice == current?.answer {
            Audio.playCorrect()

            if !isAnswered {
                // update to known
                updateAnswer(id: current!.id, correct: true)
            }
            next()
            isAnswered = false
        } else {
            Audio.playInCorrect()
            isAnswered = true
            presenter?.showError(index: current!.answer)
        }
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
