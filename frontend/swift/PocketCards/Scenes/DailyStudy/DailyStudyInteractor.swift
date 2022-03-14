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
    private var isAnswered: Bool =  false
    
    var questions: [Question] = []
    
    init(subject: String){
        self.subject = subject
    }
}

extension DailyStudyInteractor: DailyStudyBusinessLogic {
    
    // update answer
    func updateAnswer(correct: Bool) {
        guard let id = current?.id else { return }

        let params = [
            "correct": Correct.convert(value: correct)
        ]
        
        print("updateAnswer", id, correct)
        API.request(URLs.ANSWER(id: id), method: .post, parameters: params)
            .responseData { response in
                print("response", response)
                switch response.result {
                case .success:
                    print("Successful")
                case let .failure(error):
                    print(error)
                }
            }
    }
    
    func loadQuestion() {
        let params = ["subject": self.subject]
        
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
        
        API.request(URLs.STUDY, method: .get, parameters: params)
            .validate(statusCode: 200..<300)
            .responseDecodable(of: QuestionServiceEnum.LoadQuestion.Response.self) { response in
                guard let res = response.value else { return }

                print("==HUB== \(res)")

                for q in res.questions {
                    if self.current?.id == q.id {
                        continue
                    }
                    
                    if !self.questions.contains(where: {$0.id == q.id } ) {
                        self.questions.append(q)
                    }
                }

                // initialize
                if (self.current == nil && self.questions.count > 0) {
                    self.next()
                }
            }
    }
    
    func onAction(correct: Bool) {
        // wrong answer
        if correct {
            self.updateAnswer(correct: true)
        } else {
            self.questions.append(current!)
        }
        
        self.next()
    }
    
    func onChoice(choice: String) {
        if choice == current?.answer {
            if isAnswered {
                self.questions.append(current!)
            } else {
                // update to known
                self.updateAnswer(correct: true)
            }
            self.next()
            self.isAnswered = false
        } else {
            self.isAnswered = true
            presenter?.showError(index: self.current!.answer)
        }
    }
    
    private func next() {
        current = self.questions.removeFirst()
        
        presenter?.showNext(q: current!)
        
        // add new questions
        if self.questions.count < 5 {
            print("Load Questions")
            self.loadQuestion()
        }
    }
}
