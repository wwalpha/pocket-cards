//
//  DailyStudyInteractor.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import Foundation

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

        API.request(URLs.STUDY, method: .get, parameters: params)
            .responseDecodable(of: QuestionService.LoadQuestion.Response.self) { response in
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

    func onKnown() {
        // remove known question
//        questions.remove(at: index)
//
//        index -= 1
//        self.next()
    }
    
    func onUnknown() {
//        self.next()
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
