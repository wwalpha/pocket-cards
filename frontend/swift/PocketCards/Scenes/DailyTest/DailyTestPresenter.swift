//
//  DailyTestPresenter.swift
//  PocketCards
//
//  Created by macmini on 2022/03/10.
//

import Foundation

class DailyTestPresenter {
    var view: DailyTestDisplayLogic?
}

extension DailyTestPresenter: DailyTestPresentationLogic {
    func showNext(q: Question) {
//        let title = q.description == nil ? q.title : "\(q.title)\n\n\(q.description!)"

        view?.showNext(q: q)
    }

    func showNothing() {
        view?.showNothing()
    }
}
