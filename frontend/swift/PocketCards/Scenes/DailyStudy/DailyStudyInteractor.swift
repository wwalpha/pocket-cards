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
    func loadQuestion() {
        let params = ["subject": self.subject]
        
//        let headers:HTTPHeaders = [.authorization(TokenManager.shared.getIdToken())]
//        AF.request(URLs.STUDY,method: .get, parameters: params,  headers: headers)
//            .responseDecodable(of: QuestionServiceEnum.LoadQuestion.Response.self) { response in
//
//                switch (response).result {
//                case .success(let Value):
//                    print("success", Value)
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

                self.questions.append(contentsOf: res.questions)

                // No new questions
                if self.questions.count == 0 {
                    self.presenter?.showNothing()
                    return
                }

                // initialize
                if (self.current == nil) {
                    self.next()
                }
            }
    }
    
    func onAction(correct: Bool) {
        // wrong answer
        if !correct {
            self.questions.append(current!)
        }
        
        self.next()
    }
    
    func onChoice(choice: String) {
        if choice == current?.answer {
            if isAnswered {
                self.questions.append(current!)
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
        if self.questions.count < 3 {
            self.loadQuestion()
        }
    }
}
