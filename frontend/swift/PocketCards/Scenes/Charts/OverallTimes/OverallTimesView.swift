//
//  OverallTimesView.swift
//  PocketCards
//
//  Created by macmini on 2022/04/11.
//
//

import Charts
import SwiftUI

struct OverallTimesView: View {
    var interactor: OverallTimesBusinessLogic?

    @ObservedObject var viewModel = OverallTimesViewModel()

    var body: some View {
        if self.viewModel.isLoaded {
            VStack {
                OverallChart(yVals: getBarChartData(), xLabels: ["国語", "社会", "理科"])
            }.padding(32)
                .onDisappear {
                    viewModel.isLoaded = false
                }
        } else {
            Text("Loading....")
                .onAppear {
                    interactor?.load()
                }
        }
    }
}

extension OverallTimesView: OverallTimesDisplayLogic {
    func setOveralls(res: ReportServices.OverallTimes.Response) {
        viewModel.science = res.science
        viewModel.society = res.society
        viewModel.language = res.language
        viewModel.isLoaded = true
    }

    func getBarChartData() -> [BarChartDataEntry] {
        let entries = (1 ..< 13).map { i -> BarChartDataEntry in
            let val1 = self.viewModel.language[String(i - 2)] ?? 0
            let val2 = self.viewModel.society[String(i - 2)] ?? 0
            let val3 = self.viewModel.science[String(i - 2)] ?? 0

            return BarChartDataEntry(x: Double(i), yValues: [Double(val1), Double(val2), Double(val3)])
//            return BarChartDataEntry(x: Double(i), yValues: [Double(val2), Double(val3)])
        }

        return entries
    }
}

extension OverallTimesView {
    func configureView() -> some View {
        var view = self
        let interactor = OverallTimesInteractor()
        let presenter = OverallTimesPresenter()

        view.interactor = interactor
        interactor.presenter = presenter
        presenter.view = view

        return view
    }
}

struct OverallTimesView_Previews: PreviewProvider {
    static var previews: some View {
        OverallTimesView()
            .previewInterfaceOrientation(.landscapeLeft)
    }
}
