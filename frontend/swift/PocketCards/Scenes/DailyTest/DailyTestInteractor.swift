//
//  DailyTestInteractor.swift
//  PocketCards
//
//  Created by macmini on 2022/03/10.
//

import Alamofire

class DailyTestInteractor: TestInteractor {
    // update answer
    override func updateAnswer(id: String?, correct: Bool) {
        guard let qid = id else { return }

        // remove answered question
        removeQuestion(id: qid)

        Task {
            let params = ["correct": Correct.convert(value: correct)]

            debugPrint("updateAnswer", qid, correct)

            // update answer
            _ = await API.request(URLs.STUDY_DAILY_ANSWER(id: qid), method: .post, parameters: params).serializingString().response
        }
    }

    override func loadQuestions() {
        let params = ["subject": subject]

        API.request(URLs.STUDY_DAILY_TEST, method: .get, parameters: params)
            .validate()
            .responseDecodable(of: QuestionServices.LoadQuestion.Response.self) { response in
                guard let res = response.value else { return }

                print("==HUB== \(res)")

                // add new questions
                self.addQuestions(questions: res.questions)
            }
    }
}

extension DailyTestInteractor: DailyTestBusinessLogic {}
