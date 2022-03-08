//
//  QuestionServices.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import Combine

enum QuestionServiceEnum {
    enum LoadQuestion {
        struct Request {}
        
        struct Response: Codable {
            var count: Int
            var questions: [Question]
            
            private enum CodingKeys: String, CodingKey {
                case count
                case questions
            }
        }
    }
}

//class QuestionService {
//
//    func loadQuestion(subject: String) -> Future<[Question], Never> {
//        return Future() { promise in
//            let params = ["subject": subject]
//
//            API.request(URLs.STUDY, method: .get, parameters: params)
//                .responseDecodable(of: QuestionServiceEnum.LoadQuestion.Response.self) { response in
//                    guard let res = response.value else { return }
//
//                    print("==HUB== \(res)")
//
//                    promise(.success(res.questions))
//                }
//        }
//    }
//}
