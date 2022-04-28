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
        let params = ["subject": subject]

        API.request(URLs.USER_CURRICULUM_LIST(userId: Auth.userId), method: .get, parameters: params)
            .validate()
            .responseDecodable(of: UserServices.CurriculumList.Response.self) { response in
                guard let res = response.value else { return }

                self.presenter?.showGroups(res: res)
            }
    }
}
