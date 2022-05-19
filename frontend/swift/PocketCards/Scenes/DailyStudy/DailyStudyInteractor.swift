//
//  DailyStudyInteractor.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import Alamofire

class DailyStudyInteractor: PracticeInteractor {
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

            if questions.count < 5 {
                await loadQuestions()
            }
        }
    }

    override func loadQuestions() async {
        do {
            let params = ["subject": subject]

            let res = try await API.request(URLs.STUDY_DAILY_PRACTICE, method: .get, parameters: params).serializingDecodable(QuestionServices.LoadQuestion.Response.self).value

            print("==HUB== \(res.questions)")

            // add new questions
            addQuestions(questions: res.questions)
        } catch {
            debugPrint(error)
        }
    }
}

extension DailyStudyInteractor: DailyStudyBusinessLogic {}
