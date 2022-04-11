//
//  HistoriesContract.swift
//  PocketCards
//
//  Created by macmini on 2022/03/24.
//
//

import Charts
import Foundation

// View logic
protocol HistoriesDisplayLogic {
    func getJapaneseEntry() -> [ChartDataEntry]

    func getScienceEntry() -> [ChartDataEntry]

    func getSocietyEntry() -> [ChartDataEntry]

    func setHistories(items: [History])
}

// Interactor logic
protocol HistoriesBusinessLogic {
    func load()
}

// Presenter logic
protocol HistoriesPresentationLogic {
    func show(histories: [History])
}
