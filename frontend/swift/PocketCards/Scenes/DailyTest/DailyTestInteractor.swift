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
    
    var questions: [Question] = []
    
    init(subject: String){
        self.subject = subject
    }
}

extension DailyTestInteractor: DailyTestBusinessLogic {
    
    // update answer
    func updateAnswer(correct: Bool) {
        guard let id = current?.id else { return }

        let params = [
            "correct": Correct.convert(value: correct)
        ]
        
        print("updateAnswer", id, correct)
        API.request(URLs.ANSWER(id: id), method: .post, parameters: params)
            .response { response in
                switch response.result {
                case .success:
                    // show next question
                    self.next()
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
        
        API.request(URLs.TEST, method: .get, parameters: params)
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
                if (self.current == nil) {
                    self.next()
                }
            }
    }
    
    func onAction(correct: Bool) {
        // update question state
        self.updateAnswer(correct: correct)
    }
    
    func onChoice(choice: String) {
        // update question state
        self.updateAnswer(correct: choice == current?.answer )
    }
    
    private func next() {
        if (self.questions.count == 0) {
            presenter?.showNothing()
            return
        }
        
        current = self.questions.removeFirst()
        
        presenter?.showNext(q: current!)
        
        // add new questions
        if self.questions.count < 3 {
            print("Load Questions")
            self.loadQuestion()
        }
    }
}
