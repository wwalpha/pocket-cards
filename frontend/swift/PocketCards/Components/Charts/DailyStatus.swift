//
//  DailyStatus.swift
//  PocketCards
//
//  Created by macmini on 2022/03/23.
//

import Charts
import SwiftUI

struct DailyStatus: UIViewRepresentable {
    private var target: Double
    private var test: Double
    private var unlearn: Double
    private var relearning: Double

    init(target: Double, test: Double, unlearn: Double, relearning: Double) {
        self.target = target
        self.test = test
        self.unlearn = unlearn
        self.relearning = relearning
    }

    func makeUIView(context _: Context) -> HorizontalBarChartView {
        let yVals1: [BarChartDataEntry] = [BarChartDataEntry(x: 4, y: target)]
        let yVals2: [BarChartDataEntry] = [BarChartDataEntry(x: 3, y: test)]
        let yVals3: [BarChartDataEntry] = [BarChartDataEntry(x: 2, y: relearning)]
        let yVals4: [BarChartDataEntry] = [BarChartDataEntry(x: 1, y: unlearn)]

        let chartView = HorizontalBarChartView()
        let set1 = BarChartDataSet(entries: yVals1, label: "今日の目標")
        set1.setColor(UIColor(red: 255 / 255, green: 92 / 255, blue: 141 / 255, alpha: 1))
        set1.valueFont = .systemFont(ofSize: 16)
        set1.valueFormatter = DefaultValueFormatter(decimals: 0)

        let set2 = BarChartDataSet(entries: yVals2, label: "今日のテスト")
        set2.setColor(UIColor(red: 101 / 255, green: 193 / 255, blue: 140 / 255, alpha: 1))
        set2.valueFont = .systemFont(ofSize: 16)
        set2.valueFormatter = DefaultValueFormatter(decimals: 0)

        let set3 = BarChartDataSet(entries: yVals3, label: "今日の再学習")
        set3.setColor(UIColor(red: 0 / 255, green: 48 / 255, blue: 146 / 255, alpha: 1))
        set3.valueFont = .systemFont(ofSize: 16)
        set3.valueFormatter = DefaultValueFormatter(decimals: 0)

        let set4 = BarChartDataSet(entries: yVals4, label: "今日の未学習")
        set4.setColor(UIColor(red: 255 / 255, green: 171 / 255, blue: 91 / 255, alpha: 1))
        set4.valueFont = .systemFont(ofSize: 16)
        set4.valueFormatter = DefaultValueFormatter(decimals: 0)

        let data = BarChartData(dataSets: [set1, set2, set3, set4])
        data.barWidth = Double(0.8)

        chartView.data = data
        chartView.drawBarShadowEnabled = false
        chartView.drawValueAboveBarEnabled = true
        //
        chartView.maxVisibleCount = 60
        chartView.setScaleEnabled(false)
        chartView.extraRightOffset = 16

        let xAxis = chartView.xAxis
        xAxis.labelPosition = .bottom
        xAxis.labelFont = .systemFont(ofSize: 10)
        xAxis.drawAxisLineEnabled = true
        xAxis.granularity = 10
        xAxis.enabled = false

        let leftAxis = chartView.leftAxis
        leftAxis.labelFont = .systemFont(ofSize: 10)
        leftAxis.drawAxisLineEnabled = true
        leftAxis.drawGridLinesEnabled = true
        leftAxis.axisMinimum = 0
        leftAxis.enabled = false

        let rightAxis = chartView.rightAxis
        rightAxis.enabled = true
        rightAxis.labelFont = .systemFont(ofSize: 10)
        rightAxis.drawAxisLineEnabled = true
        rightAxis.axisMinimum = 0
        rightAxis.enabled = false

        let legend = chartView.legend

        legend.drawInside = false
        legend.horizontalAlignment = .right
        legend.verticalAlignment = .top
        legend.orientation = .vertical
        legend.font = .systemFont(ofSize: 16)
        legend.form = .square
        legend.formSize = 12
        legend.font = UIFont(name: "HelveticaNeue-Light", size: 11)!
        legend.xEntrySpace = 4
        legend.yOffset = 12

        chartView.animate(yAxisDuration: 2)

        return chartView
    }

    func updateUIView(_: HorizontalBarChartView, context _: Context) {
        // 値が更新された時に呼び出される処理
    }
}
