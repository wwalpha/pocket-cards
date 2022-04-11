//
//  HistoriesPresenter.swift
//  PocketCards
//
//  Created by macmini on 2022/03/24.
//
//

import Foundation

class HistoriesPresenter {
    var view: HistoriesDisplayLogic?
}

extension HistoriesPresenter: HistoriesPresentationLogic {
    func show(histories: [History]) {
        view?.setHistories(items: histories)
    }
}
