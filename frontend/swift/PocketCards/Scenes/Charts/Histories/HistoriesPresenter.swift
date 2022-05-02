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
//        var dataRows = histories
//
//        let v1 = dataRows.count % 20
//        let v2 = dataRows.count / 20
//
//        _ = dataRows.dropLast(v1)
//
//        for i in 0 ..< dataRows.count {
//            if i % 2 != 0 {
//                _ = dataRows.remove(at: i / v2)
//            }
//        }
//
//        view?.setHistories(items: dataRows)

        view?.setHistories(items: histories)
    }
}
