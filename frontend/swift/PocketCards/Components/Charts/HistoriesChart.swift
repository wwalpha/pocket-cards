//
//  HistoriesChart.swift
//  PocketCards
//
//  Created by macmini on 2022/03/24.
//

import Charts
import SwiftUI

struct HistoriesChart: UIViewRepresentable {
    var japaneseVals: [ChartDataEntry] = []
    var scienceVals: [ChartDataEntry] = []
    var societyVals: [ChartDataEntry] = []
    var xLabels: [String] = []

    func makeUIView(context _: Context) -> LineChartView {
        // japanese set
        let set1 = LineChartDataSet(entries: japaneseVals, label: "国 語")
        set1.setColor(Color.language_ui)
        set1.valueFont = .systemFont(ofSize: 16)
        set1.lineWidth = 3
        set1.drawCirclesEnabled = false
//        set1.valueFormatter = DefaultValueFormatter(decimals: 0)
        set1.drawValuesEnabled = false

        let set2 = LineChartDataSet(entries: scienceVals, label: "理 科")
        set2.setColor(Color.science_ui)
        set2.valueFont = .systemFont(ofSize: 16)
        set2.lineWidth = 3
        set2.drawCirclesEnabled = false
//        set2.valueFormatter = DefaultValueFormatter(decimals: 0)
        set2.drawValuesEnabled = false

        let set3 = LineChartDataSet(entries: societyVals, label: "社 会")
        set3.setColor(Color.society_ui)
        set3.valueFont = .systemFont(ofSize: 16)
        set3.lineWidth = 3
        set3.drawCirclesEnabled = false
//        set3.valueFormatter = DefaultValueFormatter(decimals: 0)
        set3.drawValuesEnabled = false

        let data = LineChartData(dataSets: [set1, set2, set3])
        data.setValueFont(.systemFont(ofSize: 16))

        let chartView = LineChartView()
        chartView.data = data
        chartView.chartDescription.enabled = false
        chartView.dragEnabled = false
        chartView.setScaleEnabled(false)
        chartView.pinchZoomEnabled = false
        chartView.animate(yAxisDuration: 1)
        chartView.extraLeftOffset = 24
        chartView.extraTopOffset = 12
        chartView.extraRightOffset = 24
        chartView.extraBottomOffset = 12

        let legend = chartView.legend
        legend.form = .square
        legend.formSize = CGFloat(16.0)
        legend.font = UIFont(name: "HelveticaNeue-Light", size: 16)!
        legend.horizontalAlignment = .left
        legend.verticalAlignment = .bottom
        legend.orientation = .horizontal
        legend.drawInside = false
        legend.font = .systemFont(ofSize: 16)

        let xAxis = chartView.xAxis
        xAxis.labelFont = .systemFont(ofSize: 16)
        xAxis.labelTextColor = .black
        xAxis.drawAxisLineEnabled = false
        xAxis.drawGridLinesEnabled = false
        xAxis.enabled = false
        xAxis.axisMinimum = 1
        xAxis.axisMaximum = getXMaxAxis()
        xAxis.labelCount = 15

//        xAxis.valueFormatter = IndexAxisValueFormatter(values: ["03/21", "03/22", "03/23", "03/24"])
//        xAxis.labelPosition = .bottom

        let leftAxis = chartView.leftAxis
        leftAxis.labelFont = .systemFont(ofSize: 14)
        leftAxis.axisMaximum = getLeftMaxAxis()
        leftAxis.axisMinimum = 0
        leftAxis.granularityEnabled = true

        chartView.rightAxis.enabled = false

        return chartView
    }

    func updateUIView(_: LineChartView, context _: Context) {
        // 値が更新された時に呼び出される処理
    }

    // LeftAxis Maximum
    private func getLeftMaxAxis() -> Double {
        let japanse = japaneseVals.max { a, b in
            a.y < b.y
        }
        let science = scienceVals.max { a, b in
            a.y < b.y
        }
        let society = societyVals.max { a, b in
            a.y < b.y
        }

        guard let mjp = japanse?.y, let msc = science?.y, let mso = society?.y else {
            return 0
        }

        guard let maxY = [mjp, msc, mso].max() else { return 0 }

        return maxY * 1.2
    }

    // XAxis Maximum
    private func getXMaxAxis() -> Double {
        let japanse = japaneseVals.max { a, b in
            a.x < b.x
        }
        let science = scienceVals.max { a, b in
            a.x < b.x
        }
        let society = societyVals.max { a, b in
            a.x < b.x
        }

        guard let mjp = japanse?.x, let msc = science?.x, let mso = society?.x else {
            return 0
        }

        guard let maxX = [mjp, msc, mso].max() else { return 0 }

        return maxX + 1
    }
}
