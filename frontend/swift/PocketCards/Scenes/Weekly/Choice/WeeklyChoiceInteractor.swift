//
//  WeeklyChoiceInteractor.swift
//  PocketCards
//
//  Created by macmini on 2022/04/24.
//
//

import Foundation

class WeeklyChoiceInteractor {
    var presenter: WeeklyChoicePresentationLogic?
}

extension WeeklyChoiceInteractor: WeeklyChoiceBusinessLogic {
    func loadGroups(subject: String) {
        Task {
            var responses: [UserServices.CurriculumList.Response] = []

            if subject.count == 1 {
                let params2 = ["subject": "10" + subject]

                let response = try await API.request(URLs.USER_CURRICULUM_LIST(userId: Auth.userId), method: .get, parameters: params2).serializingDecodable(UserServices.CurriculumList.Response.self).value

                responses.append(response)
            }

            let params1 = ["subject": subject]

            let response = try await API.request(URLs.USER_CURRICULUM_LIST(userId: Auth.userId), method: .get, parameters: params1).serializingDecodable(UserServices.CurriculumList.Response.self).value

            responses.append(response)

            self.presenter?.showGroups(res: responses)
        }
    }
}
