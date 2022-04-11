//
//  HistoriesView.swift
//  PocketCards
//
//  Created by macmini on 2022/03/24.
//
//

import Charts
import SwiftUI

struct HistoriesView: View {
    var interactor: HistoriesBusinessLogic?

    @ObservedObject var viewModel = HistoriesViewModel()

    var body: some View {
        if viewModel.histories.count == 0 {
            Text("Loading....")
        } else {
            VStack {
                HistoriesChart(
                    japaneseVals: getJapaneseEntry(),
                    scienceVals: getScienceEntry(),
                    societyVals: getSocietyEntry(),
                    xLabels: getXLabels()
                )
            }.padding(32)
        }
    }
}

extension HistoriesView: HistoriesDisplayLogic {
    func setHistories(items: [History]) {
        viewModel.histories = items
    }

    func getXLabels() -> [String] {
        var labels = viewModel.histories.enumerated().map { _, item in
            var mmdd = String(item.timestamp.suffix(4))

            mmdd.insert("/", at: mmdd.index(mmdd.startIndex, offsetBy: 2))

            return mmdd
        } as [String]

        labels.insert(" ", at: 0)
        labels.append(" ")

        debugPrint(labels)
        return labels
    }

    func getJapaneseEntry() -> [ChartDataEntry] {
        let entries = viewModel.histories.enumerated().map { index, item in
            ChartDataEntry(x: Double(index + 2), y: Double(item.japanese!))
        }

        return entries
    }

    func getScienceEntry() -> [ChartDataEntry] {
        let entries = viewModel.histories.enumerated().map { index, item in
            ChartDataEntry(x: Double(index + 2), y: Double(item.science!))
        }

        return entries
    }

    func getSocietyEntry() -> [ChartDataEntry] {
        let entries = viewModel.histories.enumerated().map { index, item in
            ChartDataEntry(x: Double(index + 2), y: Double(item.society!))
        }

        return entries
    }
}

extension HistoriesView {
    func configureView() -> some View {
        var view = self
        let interactor = HistoriesInteractor()
        let presenter = HistoriesPresenter()

        view.interactor = interactor
        interactor.presenter = presenter
        presenter.view = view

        return view
    }
}

struct HistoriesView_Previews: PreviewProvider {
    static var previews: some View {
        HistoriesView()
    }
}
