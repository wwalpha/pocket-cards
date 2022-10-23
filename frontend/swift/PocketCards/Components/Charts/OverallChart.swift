//
//  OverallChart.swift
//  PocketCards
//
//  Created by macmini on 2022/04/16.
//

import Charts
import SwiftUI
import UIKit

struct OverallChart: UIViewRepresentable {
    var yVals: [BarChartDataEntry] = []
    var xLabels: [String] = []

    func makeUIView(context _: Context) -> BarChartView {
        let dataset = BarChartDataSet(entries: yVals, label: "")
        dataset.drawIconsEnabled = false
//        dataset.colors = [Color.maths_ui, Color.language_ui, Color.society_ui, Color.science_ui]
        dataset.colors = [Color.language_ui, Color.society_ui, Color.science_ui]

        dataset.stackLabels = xLabels

        let data = BarChartData(dataSet: dataset)
        data.setValueFont(.systemFont(ofSize: 16, weight: .medium))
        data.setValueTextColor(.black)
//        data.setDrawValues(false)

        let chartView = BarChartView()
        chartView.fitBars = true
        chartView.data = data
        chartView.chartDescription.enabled = false
        chartView.dragEnabled = false
        chartView.setScaleEnabled(false)
        chartView.pinchZoomEnabled = false
        chartView.animate(yAxisDuration: 1)
        chartView.extraLeftOffset = 12
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
        xAxis.labelPosition = .bottom
        xAxis.drawAxisLineEnabled = false
        xAxis.drawGridLinesEnabled = false
        xAxis.enabled = true
        xAxis.axisMinimum = 0
        xAxis.valueFormatter = OverallFormatter()
        xAxis.labelCount = 9

        let leftAxis = chartView.leftAxis
        leftAxis.labelFont = .systemFont(ofSize: 14)
        leftAxis.axisMinimum = 0
        leftAxis.granularityEnabled = true

        chartView.rightAxis.enabled = false

        return chartView
    }

    func updateUIView(_: BarChartView, context _: Context) {
        // 値が更新された時に呼び出される処理
    }
}
