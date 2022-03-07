//
//  DailyStudyPresenter.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import Foundation

class DailyStudyPresenter {
    var view: DailyStudyDisplayLogic?
}

extension DailyStudyPresenter: DailyStudyPresentationLogic {

    func showNext(q: Question) {
        let title = q.description.isEmpty ? q.title : "\(q.title)\n\n\(q.description)"
        
        view?.showNext(title: title, choices: q.choices)
    }
    
    func showError(index: String) {
        view?.showError(index: index)
    }

    func showNothing() {
        
    }
}
